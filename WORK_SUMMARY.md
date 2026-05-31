# SoccerMom 작업 압축 (인수인계 / 다음 세션 시작점)

> 최종 갱신: 2026-05-30 / 회장님: 오금주(디에스컴퍼니)
> 이 파일만 읽으면 어디까지 됐고 다음에 뭘 하면 되는지 안다.

## 핵심 경로
- 앱: `soccermom-app/` (Next.js, Cloud Run 배포)
- 워커: `soccer-analysis-worker/` (YOLO 정밀분석, Cloud Run + GPU)
- 웹연결 드롭인: `soccermom-integration/`
- GCP 프로젝트: `soccermom-bcbfd`
- 앱 URL: https://soccermom-app-744182431053.asia-northeast3.run.app
- 워커 URL: https://soccermom-yolo-worker-f562nh2ebq-uc.a.run.app

## ✅ 완성·검증됨
- 앱 빌드 15페이지 0오류
- Gemini 분석엔진 = gemini-2.5-flash, 회장님 키로 실제 작동 확인
- 텔레그램 알림 = 회장님 봇(chat 8673163394)으로 수신 확인
- GPU 워커 Cloud Run 배포됨
- 기능 코드 완성: 빠른분석(능력치그래프)·정밀분석(클릭/스피드/거리/팀비교)·
  선수케어(식단/훈련/성장)·커뮤니티(8카테고리+광고)·광고(요금표)·결제(토스)·
  로그인(구글/카카오/네이버)·법무(약관/환불/개인정보)·CS(FAQ/문의)

## ❌ 막힌 것 — 외부 공개 (최우선 해결 대상)
- soccermom-bcbfd가 회사 조직에 묶여 allUsers 공개를 조직정책(domainRestrictedSharing)이 차단
- 회장님 계정으로 org-policy 해제 시도 → 권한 거부됨
- 결과: 일반 학부모 브라우저 접속 불가 → 로그인 필요한 기능 끝까지 테스트 불가
- 재배포 때마다 공개권한이 풀려서 403 재발 (배포스크립트에 자동화 넣었으나 조직정책이 상위에서 막음)

### 해결 두 갈래 (회장님 조치 필요)
- A. 회사 조직관리자에게 domainRestrictedSharing 해제 요청 → 즉시 공개
- B. 조직에 안 묶인 개인 구글 계정 새 프로젝트 + 결제연결 → 거기 배포

## ⚠️ 아직 화면에서 끝까지 테스트 못 한 것 (공개 막혀서)
- 빠른분석 결과화면 / 식단·훈련 / 정밀분석 큐→워커 실동작 / 결제흐름 / 커뮤니티·광고 저장

## 보안 경고 (SECURITY.md)
- 드라이브 SoccerMom_V5_FINAL.gs 에 텔레그램 토큰·Claude API 키 평문 노출 → 폐기/재발급 필요
- Gemini 키도 노출 이력 → 재발급 권장

## 정밀분석 정확도 한계
- best.pt 모델 없으면 폴백(사람만 감지). 학습 노트북: soccer-analysis-worker/train/train_best_pt.ipynb

## 다음 1개 작업 (NEXT)
→ 외부공개 해제 (A 또는 B 결정). 이게 풀려야 전체 테스트·오픈 가능.
