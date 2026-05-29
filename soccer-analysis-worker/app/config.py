"""환경설정 — 전부 환경변수로 주입 (Cloud Run 콘솔/배포 스크립트에서 설정).

코드에 비밀키를 박지 않습니다. Cloud Run 서비스 계정 권한으로 GCS/Firestore에 접근합니다.
"""
import os


class Settings:
    # ── 모델 ──────────────────────────────────────────────
    # 학습된 축구 모델(best.pt) 위치.
    #   - "gs://버킷/models/best.pt" 형태면 시작 시 GCS에서 내려받습니다.
    #   - 로컬 경로면 그대로 사용 (Docker 이미지에 함께 넣은 경우).
    #   - 비워두면 ultralytics 기본 모델(yolov8)을 받아 사람만 감지 (테스트용, 정확도 낮음).
    MODEL_PATH = os.environ.get("MODEL_PATH", "")
    LOCAL_MODEL_PATH = "/app/models/best.pt"

    # 클래스 이름 → 우리가 쓰는 역할 매핑.
    # 직접 학습한 모델은 보통 0:ball 1:goalkeeper 2:player 3:referee (Roboflow 축구셋 기준).
    # 기본 yolov8(COCO) 폴백 시에는 "person"(0)만 player 로 취급합니다.
    CLASS_PLAYER = os.environ.get("CLASS_PLAYER", "player")
    CLASS_GOALKEEPER = os.environ.get("CLASS_GOALKEEPER", "goalkeeper")
    CLASS_REFEREE = os.environ.get("CLASS_REFEREE", "referee")
    CLASS_BALL = os.environ.get("CLASS_BALL", "ball")

    # ── 영상 처리 ─────────────────────────────────────────
    # 프레임 스킵: N프레임마다 1번 추론. 1=모든 프레임(정확·느림), 2~3=빠름.
    FRAME_STRIDE = int(os.environ.get("FRAME_STRIDE", "1"))
    # 추론 입력 해상도 (작을수록 빠름).
    IMGSZ = int(os.environ.get("IMGSZ", "1280"))
    CONF = float(os.environ.get("CONF", "0.25"))
    DEVICE = os.environ.get("DEVICE", "0")  # "0"=첫 GPU, "cpu"=CPU 폴백

    # ── 실제 경기장 보정 (원근변환: 픽셀 → 미터) ──────────
    # 정밀한 속도/거리에는 영상별 보정이 필요합니다(아래 README의 한계 설명 참고).
    # 보정값이 없으면 속도/거리는 "상대값(추정)"으로만 표기하고 단위 단정을 피합니다.
    PITCH_LENGTH_M = float(os.environ.get("PITCH_LENGTH_M", "105.0"))
    PITCH_WIDTH_M = float(os.environ.get("PITCH_WIDTH_M", "68.0"))

    # ── Google 인프라 ────────────────────────────────────
    GCS_BUCKET = os.environ.get("GCS_BUCKET", "")          # 결과 영상/JSON 저장 버킷
    FIRESTORE_COLLECTION = os.environ.get("FIRESTORE_COLLECTION", "analysisJobs")
    GCP_PROJECT = os.environ.get("GCP_PROJECT", "")

    # 알림은 Google 전용(Firebase Cloud Messaging)으로 통일합니다.
    # 워커는 외부에 직접 쏘지 않고 Firestore 상태만 갱신 →
    # Firebase가 상태변경을 감지해 FCM 푸시(웹/앱)로 알립니다. (비구글 알림 미사용)


settings = Settings()
