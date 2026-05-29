"""학습된 축구 모델(best.pt) 확보.

우선순위:
 1) MODEL_PATH 가 gs:// → GCS에서 다운로드
 2) MODEL_PATH 가 로컬 경로(존재) → 그대로 사용
 3) 이미지에 포함된 LOCAL_MODEL_PATH 존재 → 사용
 4) 아무것도 없으면 → ultralytics 기본 yolov8 (사람만 감지; 테스트용·정확도 낮음)
"""
from __future__ import annotations

import os

from .config import settings
from . import gcs


def resolve_model_path() -> tuple[str, bool]:
    """(모델경로, is_soccer_model) 반환. is_soccer_model=False면 폴백 yolov8."""
    mp = settings.MODEL_PATH.strip()
    if mp.startswith("gs://"):
        local = gcs.download_to_tmp(mp, suffix=".pt")
        return local, True
    if mp and os.path.exists(mp):
        return mp, True
    if os.path.exists(settings.LOCAL_MODEL_PATH):
        return settings.LOCAL_MODEL_PATH, True
    # 폴백: COCO yolov8 (사람=person 만 잡음). 실서비스 전 best.pt 권장.
    return "yolov8x.pt", False
