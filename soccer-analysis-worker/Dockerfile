# ── SoccerMom 정밀분석(YOLO) 워커 — Cloud Run + GPU(NVIDIA L4) ──
# PyTorch+CUDA 공식 런타임 이미지 위에 우리 의존성을 얹습니다.
# (torch는 이 베이스의 GPU 빌드를 그대로 사용 → requirements 로 재설치하지 않음)
FROM pytorch/pytorch:2.4.1-cuda12.1-cudnn9-runtime

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8080 \
    DEVICE=0

# OpenCV/yt-dlp 런타임 라이브러리
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# (선택) 학습된 모델을 이미지에 함께 넣고 싶으면 아래 주석 해제:
# COPY models/best.pt /app/models/best.pt

COPY app ./app

# Cloud Run 은 $PORT 로 트래픽을 보냅니다.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
