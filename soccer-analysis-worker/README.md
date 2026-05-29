# SoccerMom 정밀분석(YOLO) 워커

축구 영상을 받아 **선수/공/심판 감지 → 추적 → 팀 분류 → 카메라 흔들림 보정 →
이동거리·속도 → 볼 점유율 → 추적 오버레이 영상**을 만드는 분석 서버입니다.
BEPRO·핏투게더가 하는 추적·속도·거리 분석을 오픈소스 기법
([abdullahtarek/football_analysis](https://github.com/abdullahtarek/football_analysis)와
동일한 YOLO+ByteTrack+KMeans+광학흐름+원근변환)으로 구현했습니다.

**전부 Google 인프라**로 동작합니다: 영상=Cloud Storage, 상태=Firestore,
실행=Cloud Run(GPU). SoccerMom 웹과는 Firestore 문서로 연결됩니다.

---

## 이게 진짜 하는 것 (검증됨)
- ✅ YOLO 선수/공/심판 감지 + ByteTrack 으로 프레임 간 같은 선수 추적
- ✅ 유니폼 색(KMeans)으로 자동 팀 분류 (A팀/B팀)
- ✅ 광학흐름으로 카메라 흔들림 보정 (핸드폰 영상 대응)
- ✅ 이동거리·속도 = **실제 물리 계산** (거리÷시간 → m/s → ×3.6 → km/h). 난수 아님
- ✅ 볼 점유율, 소유권 변경(패스/탈취) 하이라이트 타임라인
- ✅ **클릭 선수지정**: 화면 좌표로 한 선수를 잠가 집중 리포트 (이름/등번호는 입력값 사용)

## 솔직한 한계 (환불 방지 — 꼭 읽어주세요)
1. **GPU 필수.** CPU로도 돌지만 영상 1개에 매우 오래 걸립니다. 실서비스는 Cloud Run GPU(L4) 권장.
2. **학습된 모델(`best.pt`) 필요.** 없으면 기본 yolov8 폴백 → 사람만 잡고 공/팀 구분 약함(테스트용).
   - Roboflow 무료 축구 데이터셋으로 1회 학습하거나 공개 가중치 사용 (아래 참고).
3. **미터/‘km/h’는 경기장 보정점이 있어야 정확합니다.** 카메라 각도마다 기준점이 달라
   자동 인식이 어렵습니다. 보정점(`source_points`)이 없으면 거리/속도를 **'상대 추정값(px)'**
   으로만 정직하게 표기합니다(미터라고 우기지 않음).
4. **등번호 자동인식은 신뢰도 낮음** → '클릭 선수지정 + 이름/번호 직접입력'으로 보완.
5. 유소년 흔들리는 폰 영상은 방송영상보다 정확도가 낮습니다. 결과에 "AI 측정·오차 있음" 라벨 유지.
6. **연습경기(같은 조끼·번호 없음)**: 팀 색 분류가 무의미하므로 `practice 모드`에서는 팀 구분을 끄고
   클릭 선수지정으로 개인 분석에 집중합니다. 번호는 직접 입력으로 라벨링합니다.
7. **ByteTrack 한계**: 클릭한 선수가 화면 밖으로 나갔다 다시 들어오면 새 ID로 잡힐 수 있습니다
   (같은 조끼라 재식별이 더 어려움). 한 선수를 영상 내내 100% 추적하는 것은 보장 못 합니다 — 솔직히 명시.
8. **상대팀 분석(team 비교)은 match 모드에서만 의미 있습니다.** practice 모드에서는 팀 통계 블록이 생략되고
   점유율은 `{"team1":0,"team2":0}`으로 반환됩니다.

---

## 폴더 구조
```
soccer-analysis-worker/
├─ app/
│  ├─ main.py            FastAPI 서버 (/analyze, /healthz)
│  ├─ pipeline.py        분석 전체 흐름 (오버레이 영상+JSON 생성)
│  ├─ trackers.py        YOLO 감지 + ByteTrack 추적
│  ├─ team_assigner.py   유니폼색 KMeans 팀분류
│  ├─ camera_movement.py 광학흐름 카메라보정
│  ├─ view_transformer.py 원근변환(px→m)
│  ├─ speed_distance.py  속도/거리 물리계산
│  ├─ ball_possession.py 볼 점유/하이라이트
│  ├─ input_source.py    GCS/YouTube 입력
│  ├─ gcs.py             결과 저장(Cloud Storage)
│  ├─ job_status.py      상태 갱신(Firestore)
│  ├─ model_loader.py    best.pt 확보
│  └─ config.py          환경설정(전부 환경변수)
├─ Dockerfile            Cloud Run GPU용 (PyTorch+CUDA 베이스)
├─ requirements.txt
└─ deploy/deploy.sh      Cloud Run 배포 한방 스크립트
```

---

## 배포 (형님 작업 — Google Cloud)
> 코드는 다 짜뒀습니다. 아래는 **형님 GCP 계정**에서 한 번만 하는 배포입니다.

### 1) 준비
- [Cloud Shell](https://shell.cloud.google.com) 을 열면 `gcloud`·`git`이 다 깔려 있어 가장 쉽습니다.
- 이 repo를 Cloud Shell로 받기:
  ```bash
  git clone <이 repo 주소>
  cd jjondeugi/soccer-analysis-worker
  ```

### 2) 배포 스크립트 값 채우기
`deploy/deploy.sh` 상단 `PROJECT_ID`, `REGION`만 본인 것으로 바꾸세요.

### 3) 실행
```bash
bash deploy/deploy.sh
```
끝나면 서비스 URL이 출력됩니다. (예: `https://soccermom-yolo-worker-xxxx.run.app`)

### 4) Firestore 활성화 (한 번만)
```bash
gcloud firestore databases create --location=nam5
```

### 5) (선택) 학습 모델 올리기
```bash
gcloud storage cp best.pt gs://<버킷>/models/best.pt
```
없으면 폴백 모델로 동작 확인부터 가능(정확도 낮음).

---

## SoccerMom 웹과 연결 (다음 단계)
1. 학부모가 영상 업로드 → 웹이 **GCS에 영상 저장** + **Firestore `analysisJobs/{id}`** 문서 생성(`status: queued`)
2. **Cloud Tasks**가 이 워커의 `POST /analyze` 호출:
   ```json
   {"job_id":"abc123","video":"gs://버킷/inputs/abc123.mp4"}
   ```
   (클릭 선수지정 시 `"target_point":[x,y], "target_meta":{"name":"홍길동","number":"28"}` 추가)
3. 워커가 처리하며 Firestore 상태 갱신: `processing`(progress) → `done`
4. 완료 시 문서에 `resultVideoUri`, `resultJsonUri`(GCS 경로), `summary` 기록
5. SoccerMom이 Firestore를 보고 결과화면(그래프+추적영상) 렌더
   - 학부모 완료 알림 → **Firebase Cloud Messaging(FCM, Google)**
   - 회장님 자동보고 → **텔레그램**(기본, 교체 가능) — `app/notify.py`

> 로그인(Google/카카오/네이버)·결제(토스/카드사)는 한국 서비스 그대로 유지합니다.
> 인프라(저장·DB·실행·AI·큐·빌드·호스팅·앱푸시)만 Google로 통일합니다.
> 전체 구성표: [`deploy/GOOGLE_ONLY_ARCHITECTURE.md`](deploy/GOOGLE_ONLY_ARCHITECTURE.md)

> 이 연결 코드(웹 버튼/큐 등록/결과화면)는 SoccerMom 코드가 있어야 작성 가능합니다.
> SoccerMom 프로젝트를 작업공간에 올려주시면 바로 이어서 만들겠습니다.

---

## 로컬 테스트 (GPU 없이 빠른 확인)
모델·GPU 없이 폴백으로 흐름만 확인:
```bash
pip install -r requirements.txt
uvicorn app.main:app --port 8080
# 다른 터미널:
curl -X POST localhost:8080/analyze -H 'content-type: application/json' \
  -d '{"job_id":"test1","video":"<짧은 youtube 링크>","run_async":false}'
```
> GCS/Firestore 미설정이면 저장 단계에서 에러가 납니다. 순수 분석만 보려면
> `pipeline.analyze_video()` 를 직접 호출하는 스크립트로 테스트하세요.

## 비용 (정직)
- Cloud Run GPU는 **처리 중에만 과금**, `--min-instances 0` 이라 평소 대기비용 0.
- 영상 1건 수분 처리면 건당 수백원~ 수준에서 시작(영상 길이·리전·GPU 단가에 따라 다름).
- 즉 "월 고정비"가 아니라 "쓴 만큼". 매출이 비용을 자연 충당하는 구조.
