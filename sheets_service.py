"""
sheets_service.py — Google Sheets 헬퍼 모듈
---------------------------------------------
get_sheets_service()      : Sheets API 서비스 객체 반환
read_pending_products()   : 상태=="대기" 행 목록 반환
update_product_result()   : 처리 결과를 시트에 기록
"""

import os
from pathlib import Path
from datetime import datetime, timezone, timedelta

# python-dotenv가 있으면 자동 로드
def _load_env():
    env_path = Path(__file__).parent / ".env"
    try:
        from dotenv import load_dotenv
        load_dotenv(env_path)
    except ImportError:
        if env_path.exists():
            for line in env_path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

_load_env()

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

BASE_DIR = Path(__file__).parent
TOKEN_FILE = BASE_DIR / os.environ.get("DRIVE_TOKEN_FILE", "drive_token.json")
CREDS_FILE = BASE_DIR / os.environ.get("DRIVE_CREDENTIALS_FILE", "credentials.json")

# 한국 표준시 (UTC+9)
KST = timezone(timedelta(hours=9))

# 시트 컬럼 인덱스 (0-based, Row 1 = 헤더)
COL = {
    "번호": 0,
    "상태": 1,
    "등록일": 2,
    "상품명": 3,
    "카테고리": 4,
    "공급처": 5,
    "원산지": 6,
    "제조사": 7,
    "옵션1_이름": 8,
    "옵션1_원가": 9,
    "옵션1_판매가": 10,
    "옵션2_이름": 11,
    "옵션2_원가": 12,
    "옵션2_판매가": 13,
    "수수료율": 14,
    "무료배송": 15,
    "판매처": 16,
    "이미지폴더URL": 17,
    "상세페이지URL": 18,
    "메모": 19,
    "처리결과": 20,
    "완료시간": 21,
    "텔레그램알림": 22,
}

# 총 컬럼 수 (A ~ W = 23)
TOTAL_COLS = 23


def get_sheets_service():
    """
    Google Sheets API 서비스 객체를 반환한다.
    우선순위: drive_token.json (OAuth) → credentials.json (서비스 계정)
    """
    from google.oauth2.credentials import Credentials
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build

    creds = None

    # 1) OAuth 토큰 파일
    if TOKEN_FILE.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
                TOKEN_FILE.write_text(creds.to_json(), encoding="utf-8")
        except Exception as e:
            print(f"[sheets_service] OAuth 토큰 로드 실패, 서비스 계정으로 시도: {e}")
            creds = None

    # 2) 서비스 계정 JSON
    if creds is None and CREDS_FILE.exists():
        try:
            info = __import__("json").loads(CREDS_FILE.read_text(encoding="utf-8"))
            if info.get("type") == "service_account":
                creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
            else:
                # credentials.json이 OAuth 클라이언트 형식인 경우 InstalledAppFlow 사용
                from google_auth_oauthlib.flow import InstalledAppFlow
                flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_FILE), SCOPES)
                creds = flow.run_local_server(port=0)
                TOKEN_FILE.write_text(creds.to_json(), encoding="utf-8")
        except Exception as e:
            raise RuntimeError(f"credentials.json 로드 실패: {e}") from e

    if creds is None:
        raise RuntimeError(
            f"인증 파일을 찾을 수 없습니다. "
            f"'{TOKEN_FILE}' 또는 '{CREDS_FILE}'가 있어야 합니다."
        )

    return build("sheets", "v4", credentials=creds, cache_discovery=False)


def _cell(col_name: str, row_number: int) -> str:
    """컬럼 이름과 1-based 행 번호로 A1 표기법 반환 (예: A3)"""
    idx = COL[col_name]
    col_letter = ""
    n = idx
    while True:
        col_letter = chr(ord("A") + (n % 26)) + col_letter
        n = n // 26 - 1
        if n < 0:
            break
    return f"{col_letter}{row_number}"


def read_pending_products(sheet_id: str) -> list:
    """
    시트에서 상태=="대기" 인 행을 모두 읽어 dict 목록으로 반환.
    각 dict는 COL 키를 가지며, sheet_row_index(1-based, 헤더 포함) 도 포함.
    """
    service = get_sheets_service()
    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=sheet_id, range="A:W")
        .execute()
    )
    rows = result.get("values", [])

    if not rows:
        return []

    col_keys = list(COL.keys())
    pending = []
    for sheet_idx, row in enumerate(rows):
        if sheet_idx == 0:
            continue  # 헤더 스킵

        # 짧은 행 패딩 (빈 셀)
        padded = row + [""] * (TOTAL_COLS - len(row))

        status = padded[COL["상태"]].strip()
        if status != "대기":
            continue

        product = {key: padded[COL[key]].strip() for key in col_keys}
        product["sheet_row_index"] = sheet_idx + 1  # 1-based (헤더=1, 데이터 시작=2)
        pending.append(product)

    return pending


def update_product_result(
    sheet_id: str,
    row_index: int,
    status: str,
    result: str,
    completed_at: str,
    telegram_sent: str = "발송완료",
):
    """
    처리 결과를 시트에 기록한다.

    row_index : 1-based 행 번호 (헤더=1, 데이터 첫 행=2)
    status    : "완료" or "실패"
    result    : 처리 결과 메시지 (예: "Makeshop UID: 12345")
    completed_at : "YYYY-MM-DD HH:MM:SS" 형식 KST 시각
    """
    service = get_sheets_service()

    # 상태(B), 처리결과(U), 완료시간(V), 텔레그램알림(W) 업데이트
    updates = [
        {
            "range": f"{_cell('상태', row_index)}",
            "values": [[status]],
        },
        {
            "range": f"{_cell('처리결과', row_index)}",
            "values": [[result]],
        },
        {
            "range": f"{_cell('완료시간', row_index)}",
            "values": [[completed_at]],
        },
        {
            "range": f"{_cell('텔레그램알림', row_index)}",
            "values": [[telegram_sent]],
        },
    ]

    body = {"valueInputOption": "USER_ENTERED", "data": updates}
    service.spreadsheets().values().batchUpdate(
        spreadsheetId=sheet_id, body=body
    ).execute()


def now_kst() -> str:
    """현재 KST 시각을 'YYYY-MM-DD HH:MM:SS' 형식으로 반환"""
    return datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S")
