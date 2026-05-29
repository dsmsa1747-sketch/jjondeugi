"""
makeshop_sheets_pipeline.py
-----------------------------
Google Sheets "디에스컴퍼니 자동화 시트"에서 상태="대기" 상품을 읽어
Playwright로 메이크샵에 자동 등록한 뒤 시트와 텔레그램을 업데이트한다.

실행 방법:
    pip install playwright python-dotenv google-auth google-auth-oauthlib \
                google-api-python-client requests
    playwright install chromium
    python makeshop_sheets_pipeline.py
"""

import asyncio
import json
import os
import re
import sys
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

# ---- .env 로드 ----
def _load_env():
    env_path = Path(__file__).parent / ".env"
    try:
        from dotenv import load_dotenv
        load_dotenv(env_path)
        return
    except ImportError:
        pass
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())


_load_env()

# ---- 환경변수 ----
ADMIN_URL       = os.environ.get("MAKESHOP_ADMIN_URL", "https://premium.makeshop.co.kr").rstrip("/")
ADMIN_ID        = os.environ.get("MAKESHOP_ADMIN_ID", "")
ADMIN_PW        = os.environ.get("MAKESHOP_ADMIN_PASSWORD", "")
TG_TOKEN        = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TG_CHAT_ID      = os.environ.get("TELEGRAM_CHAT_ID", "")
CREDS_FILE_PATH = os.environ.get("DRIVE_CREDENTIALS_FILE", "credentials.json")
TOKEN_FILE_PATH = os.environ.get("DRIVE_TOKEN_FILE", "drive_token.json")

SHEET_ID = "1UcrfwRtiy9Qgs4aVbAHhYE1_gW2r6bCCae5Jh1190g4"

# 로컬 스크린샷 저장 폴더
DIAG_OUT = Path(__file__).parent / "diag_out"
DIAG_OUT.mkdir(exist_ok=True)

KST = timezone(timedelta(hours=9))

# Google Drive 업로드 대상 폴더 이름 (없으면 생성하지 않고 건너뜀)
DRIVE_LOG_FOLDER = "DS_Automation_Workspace/logs/screenshots"


# =====================================================================
# 텔레그램 헬퍼
# =====================================================================

def _tg_api(method: str, **kwargs) -> dict:
    """텔레그램 Bot API 호출 (requests 동기)"""
    import requests
    url = f"https://api.telegram.org/bot{TG_TOKEN}/{method}"
    try:
        resp = requests.post(url, timeout=15, **kwargs)
        return resp.json()
    except Exception as e:
        print(f"[TG] API 오류({method}): {e}", flush=True)
        return {}


def tg_send(text: str):
    """텍스트 메시지 전송"""
    if not TG_TOKEN or not TG_CHAT_ID:
        print(f"[TG 미설정] {text}", flush=True)
        return
    _tg_api("sendMessage", data={"chat_id": TG_CHAT_ID, "text": text, "parse_mode": "HTML"})


def tg_send_photo(image_path: Path, caption: str = ""):
    """로컬 이미지 파일을 텔레그램으로 전송"""
    if not TG_TOKEN or not TG_CHAT_ID:
        return
    if not image_path.exists():
        return
    import requests
    url = f"https://api.telegram.org/bot{TG_TOKEN}/sendPhoto"
    try:
        with open(image_path, "rb") as f:
            requests.post(
                url,
                data={"chat_id": TG_CHAT_ID, "caption": caption[:1024], "parse_mode": "HTML"},
                files={"photo": f},
                timeout=30,
            )
    except Exception as e:
        print(f"[TG] 사진 전송 실패: {e}", flush=True)


# =====================================================================
# Google Drive 업로드 헬퍼
# =====================================================================

def _get_drive_service():
    """Drive API 서비스 객체 반환 (sheets_service.py 와 동일한 인증 로직)"""
    base = Path(__file__).parent
    token_file = base / TOKEN_FILE_PATH
    creds_file = base / CREDS_FILE_PATH
    scopes = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]

    from google.oauth2.credentials import Credentials
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build

    creds = None

    if token_file.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(token_file), scopes)
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
                token_file.write_text(creds.to_json(), encoding="utf-8")
        except Exception as e:
            print(f"[Drive] OAuth 토큰 갱신 실패: {e}", flush=True)
            creds = None

    if creds is None and creds_file.exists():
        try:
            info = json.loads(creds_file.read_text(encoding="utf-8"))
            if info.get("type") == "service_account":
                creds = service_account.Credentials.from_service_account_info(info, scopes=scopes)
        except Exception as e:
            print(f"[Drive] 서비스 계정 로드 실패: {e}", flush=True)

    if creds is None:
        return None

    return build("drive", "v3", credentials=creds, cache_discovery=False)


def _find_or_create_folder(service, folder_path: str) -> str | None:
    """
    'DS_Automation_Workspace/logs/screenshots' 형식의 경로를 Drive에서 찾거나 생성한다.
    최상위 폴더가 없으면 None 반환(자동 생성하지 않음).
    """
    parts = [p for p in folder_path.split("/") if p]
    parent_id = "root"

    for part in parts:
        query = (
            f"name = '{part}' and '{parent_id}' in parents "
            f"and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
        )
        resp = service.files().list(q=query, fields="files(id, name)").execute()
        files = resp.get("files", [])
        if files:
            parent_id = files[0]["id"]
        else:
            # 폴더 생성
            meta = {
                "name": part,
                "mimeType": "application/vnd.google-apps.folder",
                "parents": [parent_id],
            }
            created = service.files().create(body=meta, fields="id").execute()
            parent_id = created["id"]

    return parent_id


def upload_screenshot_to_drive(image_path: Path) -> str | None:
    """스크린샷을 Drive 로그 폴더에 업로드하고 파일 ID를 반환한다."""
    try:
        from googleapiclient.http import MediaFileUpload

        service = _get_drive_service()
        if service is None:
            return None

        folder_id = _find_or_create_folder(service, DRIVE_LOG_FOLDER)
        if folder_id is None:
            return None

        meta = {"name": image_path.name, "parents": [folder_id]}
        media = MediaFileUpload(str(image_path), mimetype="image/png")
        uploaded = service.files().create(body=meta, media_body=media, fields="id").execute()
        return uploaded.get("id")
    except Exception as e:
        print(f"[Drive] 업로드 실패({image_path.name}): {e}", flush=True)
        return None


# =====================================================================
# 스크린샷 저장 + 업로드 + 텔레그램 전송 통합 헬퍼
# =====================================================================

async def capture_and_send(page_or_frame, filename: str, caption: str, product_name: str = ""):
    """
    스크린샷을 찍어 로컬 저장 → Drive 업로드 → 텔레그램 전송.
    page_or_frame 은 Playwright Page 또는 Frame.
    caption 에 product_name이 있으면 앞에 붙인다.
    """
    if product_name:
        caption = f"[{product_name}] {caption}"
    path = DIAG_OUT / filename
    try:
        await page_or_frame.screenshot(path=str(path), full_page=False)
    except Exception as e:
        print(f"[스크린샷] 실패({filename}): {e}", flush=True)
        return

    upload_screenshot_to_drive(path)
    tg_send_photo(path, caption=caption)


# =====================================================================
# 메이크샵 로그인
# =====================================================================

async def login_makeshop(page) -> tuple[bool, str]:
    """
    메이크샵 관리자 로그인을 수행한다.
    반환: (성공 여부, 로그인 후 활성 도메인)
    """
    login_url = f"{ADMIN_URL}/newmakeshop/home/login.html"
    alt_urls = [
        f"{ADMIN_URL}/manage/login.html",
        f"{ADMIN_URL}/login.html",
        f"{ADMIN_URL}/",
    ]

    # 로그인 페이지 이동
    reached = False
    for url in [login_url] + alt_urls:
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30_000)
            reached = True
            print(f"[로그인] 페이지 도달: {page.url}", flush=True)
            break
        except Exception as e:
            print(f"[로그인] {url} 이동 실패: {e}", flush=True)

    if not reached:
        return False, ADMIN_URL

    # 아이디 입력
    id_selectors = [
        'input#id',
        'input[name="id"]',
        'input[name="loginId"]',
        'input[name="mem_id"]',
        'input[name="userid"]',
    ]
    filled_id = False
    for sel in id_selectors:
        try:
            el = await page.query_selector(sel)
            if el:
                await el.fill(ADMIN_ID)
                filled_id = True
                print(f"[로그인] 아이디 입력: {sel}", flush=True)
                break
        except Exception:
            pass

    # 비밀번호 입력
    pw_selectors = [
        'input#password',
        'input[name="passwd"]',
        'input[name="password"]',
        'input[type="password"]',
    ]
    filled_pw = False
    for sel in pw_selectors:
        try:
            el = await page.query_selector(sel)
            if el:
                await el.fill(ADMIN_PW)
                filled_pw = True
                print(f"[로그인] 비밀번호 입력: {sel}", flush=True)
                break
        except Exception:
            pass

    if not filled_id or not filled_pw:
        print(f"[로그인] 입력 필드 미발견 (id={filled_id}, pw={filled_pw})", flush=True)
        return False, ADMIN_URL

    # 제출
    submit_selectors = [
        'button:has-text("운영자 로그인")',
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("로그인")',
    ]
    submitted = False
    for sel in submit_selectors:
        try:
            el = await page.query_selector(sel)
            if el:
                await el.click()
                submitted = True
                print(f"[로그인] 제출 버튼 클릭: {sel}", flush=True)
                break
        except Exception:
            pass
    if not submitted:
        await page.keyboard.press("Enter")
        print("[로그인] Enter 키로 제출", flush=True)

    # 완료 대기
    await page.wait_for_timeout(5_000)

    current_url = page.url
    success = "login.html" not in current_url and "login" not in current_url.lower().split("?")[0].split("/")[-1]

    # 클러스터 리다이렉트 처리: https://premium268.makeshop.co.kr 같은 실제 도메인 추출
    m = re.match(r"(https?://[^/]+)", current_url)
    active_domain = m.group(1) if (m and success) else ADMIN_URL

    print(f"[로그인] {'성공' if success else '실패'} — 활성 도메인: {active_domain}", flush=True)
    return success, active_domain


# =====================================================================
# 상품등록 페이지 이동
# =====================================================================

async def navigate_to_goodsreg(page, active_domain: str) -> bool:
    """
    상품등록 페이지로 이동한다. 여러 URL을 시도하고, 3회까지 재시도한다.
    성공 시 True 반환.
    """
    candidates = [
        f"{active_domain}/shop/goodsreg.html",
        f"{active_domain}/manage/goods/goods_regist.html",
        f"{active_domain}/newmakeshop/manage/product/product_regist.html",
        f"{active_domain}/manage/product/regist.html",
    ]

    # 상품 입력 필드 감지 JS
    _detect_js = (
        "() => !!document.querySelector("
        "\"input[name='goods_name'], input[name='prd_name'], "
        "input[name='product_name'], input[name='goodsName'], "
        "input[name='name']\")"
    )

    for attempt in range(3):
        for url in candidates:
            try:
                print(f"[등록페이지] 시도: {url} (attempt {attempt+1})", flush=True)
                await page.goto(url, wait_until="domcontentloaded", timeout=30_000)
                await page.wait_for_timeout(1_500)

                # 직접 페이지 또는 프레임에서 필드 탐지
                found = await _has_goodsreg_form(page)
                if found:
                    print(f"[등록페이지] 폼 발견: {page.url}", flush=True)
                    return True

                print(f"[등록페이지] 폼 미발견: {page.url}", flush=True)
            except Exception as e:
                print(f"[등록페이지] 이동 실패: {e}", flush=True)

        if attempt < 2:
            print(f"[등록페이지] {attempt+1}차 재시도 전 2초 대기...", flush=True)
            await page.wait_for_timeout(2_000)

    return False


async def _has_goodsreg_form(page) -> bool:
    """페이지 또는 내부 프레임에 상품명 입력 필드가 있는지 확인한다."""
    selector = (
        "input[name='goods_name'], input[name='prd_name'], "
        "input[name='product_name'], input[name='goodsName'], input[name='name']"
    )
    # 최상위 페이지 확인
    try:
        el = await page.query_selector(selector)
        if el:
            return True
    except Exception:
        pass

    # 모든 프레임 확인
    for frame in page.frames:
        try:
            el = await frame.query_selector(selector)
            if el:
                return True
        except Exception:
            pass

    return False


def _get_form_frame(page):
    """상품 폼이 있는 프레임을 반환한다 (없으면 page 자체)."""
    name_priority = ["main", "content", "body"]
    selector = (
        "input[name='goods_name'], input[name='prd_name'], "
        "input[name='product_name'], input[name='goodsName']"
    )
    # 이름 우선순위로 탐색
    for fname in name_priority:
        fr = page.frame(name=fname)
        if fr:
            return fr

    # 모든 프레임에서 폼 필드 탐색
    for frame in page.frames:
        try:
            # 동기 evaluate로 확인 (비동기 컨텍스트에서 호출되므로 await 필요)
            # 여기서는 None 반환 후 caller가 await로 처리
            pass
        except Exception:
            pass

    return page  # 프레임 없으면 top page 반환


async def _get_form_frame_async(page):
    """비동기로 상품 폼이 있는 프레임을 반환한다."""
    selector = (
        "input[name='goods_name'], input[name='prd_name'], "
        "input[name='product_name'], input[name='goodsName']"
    )
    name_priority = ["main", "content", "body"]
    for fname in name_priority:
        fr = page.frame(name=fname)
        if fr:
            try:
                el = await fr.query_selector(selector)
                if el:
                    return fr
            except Exception:
                pass

    # 이름 없는 프레임까지 전수 탐색
    for frame in page.frames:
        try:
            el = await frame.query_selector(selector)
            if el:
                return frame
        except Exception:
            pass

    return page


# =====================================================================
# 폼 채우기 (다중 셀렉터 폴백)
# =====================================================================

async def _try_fill(frame, selectors: list[str], value: str) -> bool:
    """셀렉터 목록을 순서대로 시도해 첫 번째 성공 시 True 반환."""
    for sel in selectors:
        try:
            el = await frame.query_selector(sel)
            if el:
                await el.fill(str(value))
                return True
        except Exception:
            pass
    return False


async def _try_select(frame, selectors: list[str], value: str) -> bool:
    """select 요소에 값을 선택한다."""
    for sel in selectors:
        try:
            el = await frame.query_selector(sel)
            if el:
                await el.select_option(value=value)
                return True
        except Exception:
            pass
    return False


async def fill_product_form(frame, product: dict):
    """
    상품 폼에 데이터를 채운다.
    product 키: 상품명, 원산지, 제조사, 옵션1_판매가, 옵션1_원가, 무료배송, 이미지폴더URL, 상세페이지URL
    """
    name = product.get("상품명", "")
    sell_price = product.get("옵션1_판매가", "") or product.get("옵션2_판매가", "")
    cost_price  = product.get("옵션1_원가", "")  or product.get("옵션2_원가", "")
    origin      = product.get("원산지", "")
    maker       = product.get("제조사", "")
    free_ship   = product.get("무료배송", "N").upper() == "Y"
    ship_fee    = "0" if free_ship else "3000"
    detail_url  = product.get("상세페이지URL", "")

    # 숫자 필드 — 콤마/공백 제거
    def _num(val: str) -> str:
        return re.sub(r"[^\d]", "", val) if val else ""

    sell_price_n = _num(sell_price)
    cost_price_n = _num(cost_price)

    # 상품명
    ok = await _try_fill(frame, [
        "input[name='goods_name']",
        "input[name='prd_name']",
        "input[name='product_name']",
        "input[name='goodsName']",
    ], name)
    print(f"  상품명 입력: {'OK' if ok else 'FAIL'}", flush=True)

    # 판매가
    if sell_price_n:
        ok = await _try_fill(frame, [
            "input[name='goods_price']",
            "input[name='prd_price']",
            "input[name='sell_price']",
            "input[name='price']",
        ], sell_price_n)
        print(f"  판매가 입력 ({sell_price_n}): {'OK' if ok else 'FAIL'}", flush=True)

    # 공급가(원가)
    if cost_price_n:
        ok = await _try_fill(frame, [
            "input[name='supply_price']",
            "input[name='cost_price']",
            "input[name='purchase_price']",
            "input[name='base_price']",
        ], cost_price_n)
        print(f"  공급가 입력 ({cost_price_n}): {'OK' if ok else 'FAIL'}", flush=True)

    # 배송비
    ok = await _try_fill(frame, [
        "input[name='goods_delivery']",
        "input[name='delivery_price']",
        "input[name='ship_fee']",
        "input[name='delivery']",
    ], ship_fee)
    print(f"  배송비 입력 ({ship_fee}): {'OK' if ok else 'FAIL'}", flush=True)

    # 원산지 (텍스트 또는 select)
    if origin:
        ok = await _try_fill(frame, ["input[name='origin']", "input[name='origin_text']"], origin)
        if not ok:
            ok = await _try_select(frame, ["select[name='origin_code']", "select[name='origin']"], origin)
        print(f"  원산지 입력 ({origin}): {'OK' if ok else 'FAIL'}", flush=True)

    # 브랜드/제조사
    if maker:
        ok = await _try_fill(frame, [
            "input[name='brand_name']",
            "input[name='maker']",
            "input[name='brand']",
            "input[name='manufacturer']",
        ], maker)
        print(f"  제조사 입력 ({maker}): {'OK' if ok else 'FAIL'}", flush=True)

    # 재고 (999 고정)
    await _try_fill(frame, [
        "input[name='stock']",
        "input[name='goods_stock']",
        "input[name='inventory']",
    ], "999")

    # 상품 설명 (상세페이지 URL이 있으면 iframe 삽입)
    if detail_url:
        desc_html = f'<iframe src="{detail_url}" width="100%" frameborder="0"></iframe>'
        ok = await _try_fill(frame, [
            "textarea[name='goods_content']",
            "textarea[name='goods_desc']",
            "textarea[name='content']",
            "textarea[name='description']",
        ], desc_html)
        if not ok:
            # TinyMCE 또는 CKEditor 인 경우 JavaScript로 삽입
            try:
                await frame.evaluate(
                    f"""
                    (function() {{
                        var ta = document.querySelector("textarea[name='goods_content']") ||
                                 document.querySelector("textarea[name='goods_desc']") ||
                                 document.querySelector("textarea[name='content']");
                        if (ta) ta.value = {json.dumps(desc_html)};
                        // TinyMCE
                        if (window.tinymce && tinymce.activeEditor) {{
                            tinymce.activeEditor.setContent({json.dumps(desc_html)});
                        }}
                        // CKEditor 4
                        if (window.CKEDITOR) {{
                            for (var k in CKEDITOR.instances) {{
                                CKEDITOR.instances[k].setData({json.dumps(desc_html)});
                            }}
                        }}
                    }})();
                    """
                )
                print(f"  상품설명 (JS): OK", flush=True)
            except Exception as e:
                print(f"  상품설명 설정 실패: {e}", flush=True)


# =====================================================================
# 옵션 등록 (옵션이 2개인 경우)
# =====================================================================

async def fill_options(frame, product: dict) -> bool:
    """
    옵션1, 옵션2 가 모두 있으면 옵션 섹션을 채운다.
    성공 여부 반환.
    """
    opt1_name  = product.get("옵션1_이름", "")
    opt1_price = product.get("옵션1_판매가", "")
    opt2_name  = product.get("옵션2_이름", "")
    opt2_price = product.get("옵션2_판매가", "")

    if not opt1_name:
        return False

    def _num(v): return re.sub(r"[^\d]", "", v) if v else ""

    has_options = bool(opt2_name)

    # 옵션 사용 체크박스 활성화
    opt_chk_selectors = [
        "input[name='opt_use'][value='Y']",
        "input[id='opt_use']",
        "input[name='option_use']",
    ]
    for sel in opt_chk_selectors:
        try:
            el = await frame.query_selector(sel)
            if el:
                await el.check()
                print(f"  옵션 체크박스 활성: {sel}", flush=True)
                break
        except Exception:
            pass

    await asyncio.sleep(0.5)

    # 옵션1 이름/가격 입력
    ok1 = await _try_fill(frame, [
        "input[name='opt_name1']",
        "input[name='option_name1']",
        "input[name='opt_title1']",
    ], opt1_name)
    if _num(opt1_price):
        await _try_fill(frame, [
            "input[name='opt_price1']",
            "input[name='option_price1']",
        ], _num(opt1_price))

    # 옵션2 이름/가격 입력
    if has_options:
        ok2 = await _try_fill(frame, [
            "input[name='opt_name2']",
            "input[name='option_name2']",
            "input[name='opt_title2']",
        ], opt2_name)
        if _num(opt2_price):
            await _try_fill(frame, [
                "input[name='opt_price2']",
                "input[name='option_price2']",
            ], _num(opt2_price))

    print(f"  옵션 입력 완료 (opt1={opt1_name}, opt2={opt2_name or '-'})", flush=True)
    return True


# =====================================================================
# 등록 버튼 클릭 및 UID 추출
# =====================================================================

async def submit_form_and_get_uid(page, frame) -> str | None:
    """
    등록 버튼을 클릭하고 결과 페이지에서 상품 UID를 추출한다.
    """
    submit_selectors = [
        "input[type='submit'][value*='등록']",
        "input[value='상품등록']",
        "input[value='등록하기']",
        "button:has-text('등록')",
        "input[type='submit']",
        "button[type='submit']",
    ]

    submitted = False
    for sel in submit_selectors:
        try:
            el = await frame.query_selector(sel)
            if el:
                await el.click()
                submitted = True
                print(f"[등록] 버튼 클릭: {sel}", flush=True)
                break
        except Exception:
            pass

    if not submitted:
        # 최상위 페이지에서도 시도
        for sel in submit_selectors:
            try:
                el = await page.query_selector(sel)
                if el:
                    await el.click()
                    submitted = True
                    print(f"[등록] 최상위 버튼 클릭: {sel}", flush=True)
                    break
            except Exception:
                pass

    if not submitted:
        print("[등록] 제출 버튼을 찾지 못해 Enter로 시도", flush=True)
        await page.keyboard.press("Enter")

    # 페이지 이동 대기
    await page.wait_for_timeout(5_000)

    # UID 추출 시도 (URL 또는 페이지 내용)
    uid = _extract_uid(page.url)
    if not uid:
        try:
            body_text = await page.content()
            uid = _extract_uid(body_text)
        except Exception:
            pass

    # 모든 프레임 내용에서도 탐색
    if not uid:
        for frame_obj in page.frames:
            try:
                content = await frame_obj.content()
                uid = _extract_uid(content)
                if uid:
                    break
            except Exception:
                pass

    return uid


def _extract_uid(text: str) -> str | None:
    """URL 또는 HTML 내에서 branduid 값을 추출한다."""
    if not text:
        return None
    patterns = [
        r"branduid=(\d+)",
        r"goods_uid=(\d+)",
        r"uid=(\d+)",
        r"prd_no=(\d+)",
        r"goods_no=(\d+)",
    ]
    for pat in patterns:
        m = re.search(pat, text)
        if m:
            return m.group(1)
    return None


# =====================================================================
# 메이크샵 상품 등록 (핵심)
# =====================================================================

async def register_on_makeshop(product_data: dict) -> dict:
    """
    메이크샵에 상품을 등록한다.

    product_data 키:
        상품명, 카테고리, 원산지, 제조사,
        옵션1_이름, 옵션1_원가, 옵션1_판매가,
        옵션2_이름, 옵션2_원가, 옵션2_판매가,
        수수료율, 무료배송, 이미지폴더URL, 상세페이지URL, 메모

    반환:
        {
          "success": bool,
          "uid": str or None,
          "method": str,
          "error": str or None,
          "screenshot_paths": list[str],
        }
    """
    from playwright.async_api import async_playwright

    product_name = product_data.get("상품명", "알 수 없는 상품")
    screenshots = []

    result = {
        "success": False,
        "uid": None,
        "method": "Playwright",
        "error": None,
        "screenshot_paths": screenshots,
    }

    ts = datetime.now(KST).strftime("%Y%m%d_%H%M%S")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--window-size=1280,900",
            ],
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
        )
        page = await context.new_page()

        # alert 자동 dismiss
        dialog_msgs = []
        page.on(
            "dialog",
            lambda d: (
                dialog_msgs.append(d.message),
                asyncio.create_task(d.dismiss()),
            ),
        )

        try:
            # ---- 1. 로그인 ----
            print(f"\n[{product_name}] ▶ 로그인 시작", flush=True)
            logged_in, active_domain = await login_makeshop(page)

            shot1 = f"{ts}_01_after_login_{_safe_name(product_name)}.png"
            await capture_and_send(page, shot1, "로그인 완료 후 화면", product_name)
            screenshots.append(str(DIAG_OUT / shot1))

            if dialog_msgs:
                print(f"[로그인] alert: {dialog_msgs}", flush=True)

            if not logged_in:
                result["error"] = f"로그인 실패 (alert: {'; '.join(dialog_msgs)})"
                await browser.close()
                return result

            # ---- 2. 상품등록 페이지 이동 ----
            print(f"[{product_name}] ▶ 상품등록 페이지 이동", flush=True)
            found_reg_page = await navigate_to_goodsreg(page, active_domain)

            shot2 = f"{ts}_02_goodsreg_{_safe_name(product_name)}.png"
            await capture_and_send(page, shot2, "상품등록 페이지", product_name)
            screenshots.append(str(DIAG_OUT / shot2))

            if not found_reg_page:
                result["error"] = "상품등록 페이지를 찾을 수 없음"
                await browser.close()
                return result

            # ---- 3. 폼이 있는 프레임 탐색 ----
            form_frame = await _get_form_frame_async(page)
            frame_label = getattr(form_frame, "name", None) or "top"
            print(f"[{product_name}] ▶ 폼 프레임: {frame_label}", flush=True)

            # ---- 4. 폼 채우기 ----
            print(f"[{product_name}] ▶ 폼 채우기 시작", flush=True)
            await fill_product_form(form_frame, product_data)
            await fill_options(form_frame, product_data)

            shot3 = f"{ts}_03_form_filled_{_safe_name(product_name)}.png"
            await capture_and_send(page, shot3, "폼 입력 완료", product_name)
            screenshots.append(str(DIAG_OUT / shot3))

            # ---- 5. 등록 제출 ----
            print(f"[{product_name}] ▶ 등록 제출", flush=True)
            uid = await submit_form_and_get_uid(page, form_frame)

            shot4 = f"{ts}_04_after_submit_{_safe_name(product_name)}.png"
            await capture_and_send(page, shot4, "등록 제출 후 화면", product_name)
            screenshots.append(str(DIAG_OUT / shot4))

            if dialog_msgs:
                print(f"[등록] 제출 후 alert: {dialog_msgs}", flush=True)

            # UID 없어도 URL에 login이 없으면 성공으로 간주
            if uid:
                result["success"] = True
                result["uid"] = uid
                print(f"[{product_name}] ▶ 등록 성공 UID: {uid}", flush=True)
            elif "login" not in page.url.lower():
                # 등록 후 상품 목록 페이지 등으로 리다이렉트 — UID 추출 실패지만 성공 가능성
                result["success"] = True
                result["uid"] = "미추출"
                print(f"[{product_name}] ▶ 등록 완료 (UID 미추출, URL: {page.url})", flush=True)
            else:
                result["error"] = f"등록 후 페이지가 로그인으로 되돌아감: {page.url}"
                print(f"[{product_name}] ▶ 등록 실패: {result['error']}", flush=True)

        except Exception as exc:
            import traceback
            tb = traceback.format_exc()
            result["error"] = str(exc)
            print(f"[{product_name}] ▶ 예외 발생:\n{tb}", flush=True)
            try:
                shot_err = f"{ts}_ERR_{_safe_name(product_name)}.png"
                await capture_and_send(page, shot_err, f"오류 발생: {exc}", product_name)
                screenshots.append(str(DIAG_OUT / shot_err))
            except Exception:
                pass
        finally:
            await browser.close()

    return result


def _safe_name(name: str, max_len: int = 20) -> str:
    """파일명에 사용 가능한 ASCII+숫자 형태로 변환 (한글 제거)"""
    safe = re.sub(r"[^\w가-힣]", "_", name)[:max_len]
    return safe or "product"


# =====================================================================
# 메인 파이프라인
# =====================================================================

async def main():
    print("=" * 70, flush=True)
    print("메이크샵 자동등록 파이프라인 시작", flush=True)
    print(f"시각(KST): {datetime.now(KST).strftime('%Y-%m-%d %H:%M:%S')}", flush=True)
    print("=" * 70, flush=True)

    # 필수 환경변수 확인
    missing = [k for k, v in {
        "MAKESHOP_ADMIN_ID": ADMIN_ID,
        "MAKESHOP_ADMIN_PASSWORD": ADMIN_PW,
    }.items() if not v]
    if missing:
        msg = f"필수 환경변수 미설정: {', '.join(missing)}"
        print(f"[ERROR] {msg}", flush=True)
        tg_send(f"❌ 자동등록 실패: {msg}")
        sys.exit(1)

    # ---- Google Sheets에서 대기 상품 읽기 ----
    from sheets_service import read_pending_products, update_product_result, now_kst

    print("\n[시트] 대기 상품 조회 중...", flush=True)
    try:
        products = read_pending_products(SHEET_ID)
    except Exception as e:
        msg = f"시트 읽기 실패: {e}"
        print(f"[ERROR] {msg}", flush=True)
        tg_send(f"❌ 자동등록 파이프라인 오류: {msg}")
        sys.exit(1)

    if not products:
        print("[시트] 대기 상품 없음. 종료.", flush=True)
        tg_send("ℹ️ 메이크샵 자동등록: 대기 중인 상품이 없습니다.")
        return

    total = len(products)
    print(f"[시트] 대기 상품 {total}개 발견", flush=True)
    tg_send(f"📋 메이크샵 자동등록 시작\n총 {total}개 상품 처리 예정")

    success_count = 0
    fail_count    = 0

    for idx, product in enumerate(products, 1):
        pname     = product.get("상품명", f"상품{idx}")
        row_index = product["sheet_row_index"]

        print(f"\n{'─'*60}", flush=True)
        print(f"[{idx}/{total}] 처리 중: {pname} (행 {row_index})", flush=True)

        # 텔레그램: 등록 시작 알림
        tg_send(f"🔄 [{pname}] 등록 시작... ({idx}/{total})")

        # 메이크샵 등록
        reg_result = await register_on_makeshop(product)

        completed_at = now_kst()

        if reg_result["success"]:
            uid        = reg_result["uid"] or "미추출"
            status     = "완료"
            result_msg = f"Makeshop UID: {uid} ({reg_result['method']})"
            tg_send(f"✅ [{pname}] 등록 완료 (UID: {uid})")
            success_count += 1
        else:
            err        = reg_result.get("error") or "알 수 없는 오류"
            status     = "실패"
            result_msg = f"실패: {err[:200]}"
            tg_send(f"❌ [{pname}] 등록 실패\n사유: {err[:300]}")
            fail_count += 1

        # 시트 업데이트
        try:
            update_product_result(
                sheet_id=SHEET_ID,
                row_index=row_index,
                status=status,
                result=result_msg,
                completed_at=completed_at,
            )
            print(f"[시트] 행 {row_index} 업데이트 완료: {status}", flush=True)
        except Exception as e:
            print(f"[시트] 행 {row_index} 업데이트 실패: {e}", flush=True)

        # 상품 간 짧은 대기 (서버 부하 방지)
        if idx < total:
            await asyncio.sleep(3)

    # ---- 최종 요약 ----
    summary = (
        f"📊 메이크샵 자동등록 완료\n"
        f"총 {total}개 처리\n"
        f"✅ 성공: {success_count}개\n"
        f"❌ 실패: {fail_count}개\n"
        f"완료시각: {now_kst()} (KST)"
    )
    print(f"\n{'='*70}", flush=True)
    print(summary, flush=True)
    print("="*70, flush=True)
    tg_send(summary)


if __name__ == "__main__":
    asyncio.run(main())
