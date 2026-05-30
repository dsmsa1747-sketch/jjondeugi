# STATE — 콩나물 플랫폼 진행 상태 (매 작업 전후 갱신 의무)

> 세션이 끊겨도 이 파일만 읽으면 어디부터 이어야 할지 안다. (Control Kit RULES 적용)

## 최근 갱신
2026-05-30 — Control Kit 운영 규칙을 콩나물에 적용 + UI 규칙 준수화

## 지금 진행 중인 큰 목표
**콩나물 멀티역할 커머스 플랫폼을 실서비스로 오픈** (쇼핑몰·분양몰·입점업체·총관리자)
- 화면: GitHub Pages(jjondeugi.com / github.io) — 데모(localStorage)
- 실서비스: Google Apps Script 웹앱(화면+백엔드) + Google Sheets(DB) — 회장님 배포 1회 필요

## 진행 현황
- [x] 4역할 플랫폼 UI (역할 허브 + 쇼핑몰/분양몰/입점업체/총관리자), PC 반응형
- [x] 데이터 계층 백엔드 연결형(MEM + google.script.run/fetch, 데모 폴백)
- [x] Apps Script 백엔드(doGet 화면 서빙, loadAll/saveAll 시트 저장, 미러 시트, 토스/텔레그램)
- [x] Drive 배포 가이드 v2 + 임시로 CNAME 제거해 github.io 미리보기 제공
- [x] **DESIGN/VERIFY 규칙 준수화**: 그라데이션 0, Math.random 0, 장식 이모지 0, 색 단순화, 데모 모드 정직 표기
- [ ] 구매자 회원/로그인 + 주문내역(구매자 본인 조회)
- [ ] 오너 추천링크 실작동(`?ref=오너코드` 구매 → 오너 매출 적립)
- [ ] 토스 실결제(테스트키) 연결
- [ ] (회장님) Apps Script 배포로 실데이터 전환

## 지금 막힌 것 / 사람 필요
- Apps Script "배포" 버튼은 계정 소유자(회장님)만 가능 — 1회 클릭 필요 (Drive 가이드 v2 참조)
- 텔레그램 자동보고: 이 클라우드 환경에 `TELEGRAM_BOT_TOKEN`/`CHAT_ID` 미설정 → 전송 불가, STATE에 기록으로 대체

## 다음 1개 작업 → NEXT_TASK.md

## 작업 로그 (최근 5)
- 2026-05-30 ✅ DESIGN 규칙 준수화(검증 통과) + 규칙 영구 메모리(CLAUDE.md §8) 저장
- 2026-05-30 ✅ 데이터 계층 백엔드 연결형 전환 + Apps Script 멀티역할 백엔드
- 2026-05-30 ✅ 4역할 플랫폼으로 UI 전면 재구성(PC 반응형)
- 2026-05-30 ✅ 임시 CNAME 제거 → github.io 미리보기 노출
- 2026-05-30 ✅ PWA·AI마케팅·주문추적·수익분배표 추가(이전 단계)
