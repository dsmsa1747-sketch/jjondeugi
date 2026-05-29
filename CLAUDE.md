# CLAUDE.md — 콩나물 / 디에스컴퍼니 작업 메모리

> 이 파일은 세션이 바뀌어도 유지되는 **영구 메모리**다. 새 작업을 시작하면 먼저 이 문서를 읽는다.

## 0. 최우선 원칙 — 모든 정보는 Google Drive에 있다
**어떤 작업이든, 필요한 정보·자료·과거 산출물은 먼저 Google Drive에서 스스로 찾는다.**
- 사용할 도구: `mcp__*__search_files`, `mcp__*__read_file_content`, `mcp__*__list_recent_files`, `mcp__*__get_file_metadata` (Google Drive MCP)
- 추측하지 말고, 관련 키워드(`콩나물`, `DSCompany`, `n8n`, 파일명 등)로 Drive를 검색해 근거를 확보한 뒤 진행한다.
- 새 산출물도 가능하면 Drive 표준 폴더에 백업한다(아래 폴더 ID 참고).

## 1. 회사 / 대표
- 대표: **오금주** (회장) · 이메일 dsmsa1747@gmail.com
- 회사: **디에스컴퍼니(DS Company)** / **식스푼** · 사업자 119-20-86708
- 목표: 1인 기업 유니콘 · 핸드폰 중심 · 24/365 자동화 · 사람 의존 최소

## 2. Google Drive 지도 (핵심 폴더/문서 ID)
| 이름 | ID | 비고 |
|------|----|------|
| DS_Automation_Workspace (메인 작업몰) | `1AjWcO-mttszUd5V6sCJkqbqxFL3vuIyI` | n8n·configs·reports 등 |
| 콩나물플랫폼자동화 | `1zTqSHOsmlJBdvXzwH7HtNmEMH1Q-ceg7` | 콩나물 산출물 표준 폴더 |
| 마스터 문서 `00_DSCompany_AI_OS_v1.md` | `1MyesOnbhD4Kkjq7R5a2mwBxl948qo3UM` | 운영 SOP 전체 |
| `📋 콩나물_프로젝트_가이드_v7.md` | `1n0vYgttjNQtQgTnSvX_0xVuVEWnXnOZa` | 콩나물 스펙 v7 |
> 갱신/추가 자료는 Drive 검색으로 최신본을 다시 확인할 것.

## 3. 콩나물 플랫폼 개념 (v7 스펙 요약)
- **무자본 분양 커머스**: 전 세계 누구나 SNS 채널만으로 즉시 자기 쇼핑몰(분양몰)을 받아 수익.
- **수익 구조(Atomic)**: 브랜드사 **90%** / 콩나물 **7%** / 오너 **3%**(즉시 캐시백).
- **정산**: 배송완료 **D+7**. 세금: 매월 말일 **3.3% 원천징수** 자동 공제. 샘플은 Zero-Billing(정산 제외).
- **앱 화면**: 로그인(소셜4종)·온보딩·홈피드(Wadiz 펀딩 스타일: 달성률/서포터/D-day)·검색·내 쇼핑몰·수익 대시보드·주문내역·정산·AI마케팅·프로필·상품상세·출금모달.
- 다국어(한/영/일/중/힌/스) + 6통화.

## 4. 이 저장소 (dsmsa1747-sketch/jjondeugi)
- **콩나물 프론트엔드**를 GitHub Pages로 **jjondeugi.com**(CNAME)에 배포.
- 파일:
  - `index.html` — 콩나물 SPA(모바일 우선). 백엔드 미설정 시 localStorage 데모, `CONFIG.API_BASE` 설정 시 실서비스.
  - `backend/Code.gs` + `backend/appsscript.json` — **Google Apps Script** 백엔드(구글 시트=DB, 토스 결제, D+7 정산, 텔레그램).
  - `SETUP.md` — 데모→실서비스 연결 가이드.
  - `SELLZY_complete.html` — 구버전 분양몰 데모(참고 보관).
- 개발 브랜치: `claude/brave-brahmagupta-owU0w` → PR #4.

## 5. 기술 방침
- **이 저장소의 백엔드는 "Google 도구만" 사용**: Google Apps Script + Google Sheets(+ Drive). (대표 지시)
- 더 넓은 자동화 스택은 별도: Firebase(Functions/Firestore/Hosting), n8n, Telegram, 토스/카카오페이.
- 시간대: KST(Asia/Seoul).

## 6. 보안 (절대 위반 금지)
- ❌ API Key·Secret·토큰을 코드/문서/커밋에 하드코딩 금지.
- ✅ 시크릿은 Apps Script **스크립트 속성** 또는 환경변수에만.
- ✅ 비밀번호는 SHA-256+salt 해시 저장. 토큰은 서명 검증.
- ✅ Telegram Bot은 chat ID 화이트리스트.

## 7. 모델 정체성
- 채팅에서 모델을 물으면 `claude-opus-4-8`로 답한다. (커밋/PR/코드 등 산출물에는 모델 ID를 적지 않는다.)
