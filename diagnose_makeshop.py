"""
메이크샵 자동등록 진단 스크립트 (standalone)
----------------------------------------------
목적: 실제 메이크샵 프리미엄 관리자에 로그인 → 상품등록 페이지를 열고
      "진짜 입력 필드 이름/셀렉터"와 스크린샷을 자동으로 수집한다.

이걸 한 번 돌려서 생성되는 결과(콘솔 출력 + diag_out/ 폴더의 png/html)를
그대로 공유해주면, 실제 화면에 맞는 정확한 셀렉터로 등록 코드를 고칠 수 있다.

실행 방법:
    pip install playwright python-dotenv
    playwright install chromium
    python diagnose_makeshop.py

.env 파일이 같은 폴더에 있으면 자동으로 읽고,
없으면 아래 환경변수를 직접 채워도 된다.
"""
import asyncio
import os
import sys
import json
import re
from pathlib import Path

# ---- .env 로드 (python-dotenv 있으면 사용, 없으면 수동 파싱) ----
def load_env():
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


load_env()

ADMIN_URL = os.environ.get("MAKESHOP_ADMIN_URL", "https://premium.makeshop.co.kr").rstrip("/")
ADMIN_ID = os.environ.get("MAKESHOP_ADMIN_ID", "")
ADMIN_PW = os.environ.get("MAKESHOP_ADMIN_PASSWORD", "")

OUT = Path(__file__).parent / "diag_out"
OUT.mkdir(exist_ok=True)


def log(msg):
    print(msg, flush=True)


async def dump_inputs(frame, tag):
    """프레임 안의 모든 input/select/textarea의 name/id/type/value 수집"""
    try:
        data = await frame.evaluate(
            """() => {
                const out = [];
                document.querySelectorAll('input, select, textarea').forEach(el => {
                    out.push({
                        tag: el.tagName.toLowerCase(),
                        type: el.type || '',
                        name: el.name || '',
                        id: el.id || '',
                        placeholder: el.placeholder || '',
                        value: (el.type === 'password') ? '***' : String(el.value || '').slice(0, 40),
                    });
                });
                return out;
            }"""
        )
        log(f"\n   [{tag}] 입력 요소 {len(data)}개:")
        for d in data:
            log(f"      <{d['tag']} type={d['type']!r} name={d['name']!r} id={d['id']!r} ph={d['placeholder']!r} val={d['value']!r}>")
        return data
    except Exception as e:
        log(f"   [{tag}] 입력 요소 수집 실패: {e}")
        return []


async def dump_submit_buttons(frame, tag):
    """등록/저장 류 버튼 후보 수집"""
    try:
        data = await frame.evaluate(
            """() => {
                const out = [];
                document.querySelectorAll("button, input[type=submit], input[type=button], a").forEach(el => {
                    const txt = (el.value || el.innerText || el.textContent || '').trim().slice(0, 30);
                    if (/등록|저장|확인|submit|save|reg/i.test(txt)) {
                        out.push({tag: el.tagName.toLowerCase(), type: el.type||'', name: el.name||'', id: el.id||'', text: txt});
                    }
                });
                return out;
            }"""
        )
        log(f"\n   [{tag}] 등록/저장 버튼 후보 {len(data)}개:")
        for d in data:
            log(f"      <{d['tag']} type={d['type']!r} name={d['name']!r} id={d['id']!r} text={d['text']!r}>")
        return data
    except Exception as e:
        log(f"   [{tag}] 버튼 수집 실패: {e}")
        return []


async def save_frame(frame, name):
    try:
        html = await frame.content()
        (OUT / f"{name}.html").write_text(html, encoding="utf-8")
        log(f"   💾 HTML 저장: diag_out/{name}.html")
    except Exception as e:
        log(f"   HTML 저장 실패({name}): {e}")


async def main():
    log("=" * 70)
    log("메이크샵 자동등록 진단 시작")
    log("=" * 70)
    log(f"ADMIN_URL = {ADMIN_URL}")
    log(f"ADMIN_ID  = {ADMIN_ID!r}")
    log(f"ADMIN_PW  = {'(설정됨)' if ADMIN_PW else '(비어있음!)'}")

    if not ADMIN_ID or not ADMIN_PW:
        log("\n❌ MAKESHOP_ADMIN_ID / MAKESHOP_ADMIN_PASSWORD 가 비어있습니다. .env 확인 필요.")
        return

    # ---- Playwright import / 브라우저 설치 확인 ----
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        log("\n❌ playwright 미설치. 다음을 실행하세요:")
        log("     pip install playwright && playwright install chromium")
        return

    try:
        async with async_playwright() as p:
            try:
                browser = await p.chromium.launch(
                    headless=True,
                    args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
                )
            except Exception as e:
                log(f"\n❌ 크로미움 실행 실패(브라우저 미설치 가능성): {e}")
                log("     해결: playwright install chromium")
                return

            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )
            page = await context.new_page()

            dialog_msgs = []
            page.on("dialog", lambda d: (dialog_msgs.append(d.message), asyncio.create_task(d.dismiss())))

            # ===== 1. 로그인 =====
            login_url = f"{ADMIN_URL}/newmakeshop/home/login.html"
            log(f"\n[1] 로그인 페이지 이동: {login_url}")
            try:
                await page.goto(login_url, wait_until="domcontentloaded", timeout=30000)
            except Exception as e:
                log(f"   ⚠️ 로그인 페이지 이동 실패: {e}")
                log(f"   → 다른 로그인 URL 후보를 시도해봅니다.")
                for alt in [f"{ADMIN_URL}/manage/login.html", f"{ADMIN_URL}/login.html", f"{ADMIN_URL}/"]:
                    try:
                        log(f"     시도: {alt}")
                        await page.goto(alt, wait_until="domcontentloaded", timeout=30000)
                        log(f"     ✅ 도달: {page.url}")
                        break
                    except Exception as e2:
                        log(f"     실패: {e2}")

            await page.screenshot(path=str(OUT / "01_login_page.png"))
            log(f"   📸 diag_out/01_login_page.png  (현재 URL: {page.url})")
            await dump_inputs(page, "로그인 페이지")
            await save_frame(page, "01_login_page")

            # 로그인 시도 (원본 코드와 동일 셀렉터)
            log("\n[2] 로그인 정보 입력 및 제출")
            filled_id = filled_pw = False
            for sel in ['input#id', 'input[name="id"]', 'input[name="loginId"]', 'input[name="userid"]']:
                try:
                    if await page.query_selector(sel):
                        await page.fill(sel, ADMIN_ID)
                        filled_id = True
                        log(f"   아이디 입력 성공: {sel}")
                        break
                except Exception:
                    pass
            for sel in ['input#password', 'input[name="passwd"]', 'input[name="password"]', 'input[type="password"]']:
                try:
                    if await page.query_selector(sel):
                        await page.fill(sel, ADMIN_PW)
                        filled_pw = True
                        log(f"   비밀번호 입력 성공: {sel}")
                        break
                except Exception:
                    pass
            if not filled_id or not filled_pw:
                log(f"   ⚠️ 아이디/비밀번호 입력 필드를 못 찾음 (id={filled_id}, pw={filled_pw}) — 위 입력요소 목록 참고")

            try:
                btn = await page.query_selector('button:has-text("운영자 로그인"), input[type="submit"], button[type="submit"]')
                if btn:
                    await btn.click()
                    log("   로그인 버튼 클릭")
                else:
                    await page.keyboard.press("Enter")
                    log("   Enter로 제출")
            except Exception as e:
                log(f"   제출 중 예외: {e}")

            await page.wait_for_timeout(5000)
            if dialog_msgs:
                log(f"   ⚠️ alert 발생: {dialog_msgs}")

            current_url = page.url
            await page.screenshot(path=str(OUT / "02_after_login.png"))
            log(f"   📸 diag_out/02_after_login.png  (현재 URL: {current_url})")

            logged_in = "login.html" not in current_url
            log(f"\n   로그인 판정: {'✅ 성공 추정' if logged_in else '❌ 실패 추정 (아직 login.html)'}")

            # 리다이렉트된 실제 클러스터 도메인 추출
            m = re.match(r"(https?://[^/]+)", current_url)
            active_url = m.group(1) if (m and logged_in) else ADMIN_URL
            log(f"   활성 관리자 도메인: {active_url}")

            if not logged_in:
                log("\n   → 로그인이 실패로 보입니다. 위 alert 메시지 / 02_after_login.png를 확인하세요.")
                await browser.close()
                return

            # ===== 3. 상품등록 페이지 탐색 =====
            reg_candidates = [
                f"{active_url}/shop/goodsreg.html",
                f"{active_url}/manage/product/regist.html",
                f"{active_url}/manage/goods/goods_regist.html",
                f"{active_url}/newmakeshop/manage/product/product_regist.html",
            ]
            log("\n[3] 상품등록 페이지 후보 탐색")
            reached = None
            for url in reg_candidates:
                try:
                    log(f"   시도: {url}")
                    await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                    await page.wait_for_timeout(1500)
                    # goods_name 같은 상품 입력 필드가 있는지 확인
                    has_form = await page.evaluate(
                        """() => !!document.querySelector("input[name='goods_name'], input[name='prd_name'], input[name='product_name'], input[name='name']")"""
                    )
                    log(f"     → 도달 URL: {page.url}  (상품명 필드 발견: {has_form})")
                    if has_form:
                        reached = page.url
                        break
                except Exception as e:
                    log(f"     실패: {e}")

            # 프레임 구조 출력
            log("\n[4] 페이지 프레임 구조")
            for fr in page.frames:
                log(f"   - frame name={fr.name!r} url={fr.url}")

            # main 프레임 우선
            target = page.frame(name="main") or page
            target_label = "main 프레임" if page.frame(name="main") else "top 페이지"
            log(f"\n[5] 상품등록 폼 분석 대상: {target_label}")

            await page.screenshot(path=str(OUT / "03_goodsreg.png"), full_page=True)
            log("   📸 diag_out/03_goodsreg.png")

            await dump_inputs(target, "상품등록 폼")
            await dump_submit_buttons(target, "상품등록 폼")
            await save_frame(target, "03_goodsreg")

            # 모든 프레임에서도 입력요소 수집(폼이 다른 프레임에 있을 수 있음)
            for i, fr in enumerate(page.frames):
                if fr is target:
                    continue
                cnt = await fr.evaluate("() => document.querySelectorAll('input,select,textarea').length")
                if cnt and cnt > 3:
                    await dump_inputs(fr, f"프레임#{i} name={fr.name!r}")

            log("\n" + "=" * 70)
            log("진단 완료. diag_out/ 폴더의 png/html 파일과 위 콘솔 출력을 공유해주세요.")
            log("=" * 70)

            await browser.close()
    except Exception as e:
        import traceback
        log(f"\n❌ 진단 중 예외 발생: {e}")
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
