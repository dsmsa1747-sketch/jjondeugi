# 메이크샵 자동등록 사용법

서버 없이 **GitHub가 대신 메이크샵에 상품을 자동 등록**해주는 방식입니다.
딱 한 번만 비밀값을 등록해두면, 그 뒤로는 시트에 상품만 추가하고 버튼 한 번이면 됩니다.

---

## ✅ 1단계 — 비밀값 등록 (딱 한 번만)

저장소 페이지에서:

1. 상단 **Settings**(설정) 탭 클릭
2. 왼쪽 메뉴 **Secrets and variables** → **Actions** 클릭
3. 초록색 **New repository secret** 버튼으로 아래 값들을 하나씩 등록

| 이름(Name) | 값(Secret) |
|------------|-----------|
| `MAKESHOP_ADMIN_ID` | 메이크샵 운영자 아이디 |
| `MAKESHOP_ADMIN_PASSWORD` | 메이크샵 운영자 비밀번호 |
| `TELEGRAM_BOT_TOKEN` | 텔레그램 봇 토큰 |
| `TELEGRAM_CHAT_ID` | 텔레그램 채팅 ID |
| `GOOGLE_CREDENTIALS_JSON` | 구글 인증 JSON 전체 내용 (아래 설명) |

### GOOGLE_CREDENTIALS_JSON 이란?
구글 시트를 읽고/쓰기 위한 열쇠 파일입니다. 두 가지 방법 중 하나:

- **방법 A (추천) — 서비스 계정**: 구글 클라우드에서 만든 서비스계정 키 JSON 파일 내용을 통째로 붙여넣기.
  그리고 시트 **공유** 버튼에서 그 서비스계정 이메일(`...@....iam.gserviceaccount.com`)을 **편집자**로 추가.
- **방법 B — 기존 OAuth 토큰**: 지금 쓰고 있는 `drive_token.json` 파일 내용을 통째로 붙여넣기.

> 어떤 걸 넣든 자동으로 알아서 인식합니다.

---

## ✅ 2단계 — 실행

### 수동 실행 (지금 바로 테스트)
1. 상단 **Actions** 탭 클릭
2. 왼쪽에서 **Makeshop 자동등록** 선택
3. 오른쪽 **Run workflow** 버튼 클릭 → 다시 **Run workflow**

### 자동 실행
별도 설정 없이 **매일 오전 10시(한국시간)**에 자동으로 시트의 "대기" 상품을 등록합니다.
시각을 바꾸려면 `.github/workflows/makeshop-register.yml` 의 `cron` 값을 수정하세요.

---

## ✅ 3단계 — 결과 확인

- **텔레그램**: 단계별 스크린샷과 성공/실패 알림이 옵니다.
- **시트**: 처리한 상품의 `상태`가 `완료`/`실패`로, `처리결과`·`완료시간`이 자동 기록됩니다.
- **스크린샷**: Actions 실행 결과 페이지 맨 아래 **Artifacts > makeshop-screenshots** 에서 다운로드 가능.

---

## 작동 방식

```
구글 시트(대기 상품)
   │   sheets_service.py 가 읽음
   ▼
makeshop_sheets_pipeline.py (Playwright)
   │   메이크샵 관리자 로그인 → 상품등록 폼 자동 입력 → 등록
   ▼
결과 → 텔레그램 알림 + 시트 상태 업데이트
```

처리 대상: 시트에서 **상태 = "대기"** 인 행만. 등록이 끝나면 자동으로 "완료"로 바뀌므로
같은 상품이 중복 등록되지 않습니다.
