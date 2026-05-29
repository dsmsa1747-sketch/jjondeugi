"""YOLO 감지 + ByteTrack 추적.

ultralytics(YOLO)로 프레임마다 선수/심판/공을 감지하고,
supervision의 ByteTrack으로 프레임 전반에 걸쳐 같은 객체에 같은 id를 부여합니다.
(원본 football_analysis와 동일한 기법 — 검증된 조합.)
"""
from __future__ import annotations

import numpy as np
import supervision as sv
from ultralytics import YOLO

from .config import settings


class Tracker:
    def __init__(self, model_path: str):
        self.model = YOLO(model_path)
        # 공은 작고 빠르므로 추적을 길게 유지하도록 lost_track_buffer 를 늘림.
        self.tracker = sv.ByteTrack(lost_track_buffer=60)
        self.names = self.model.names  # {id: 클래스명}

    def _role_of(self, class_name: str) -> str:
        """모델 클래스명을 우리 역할(player/goalkeeper/referee/ball)로 정규화."""
        cn = (class_name or "").lower()
        if cn in (settings.CLASS_BALL.lower(), "ball", "sports ball"):
            return "ball"
        if cn in (settings.CLASS_REFEREE.lower(), "referee", "ref"):
            return "referee"
        if cn in (settings.CLASS_GOALKEEPER.lower(), "goalkeeper", "gk"):
            return "goalkeeper"
        if cn in (settings.CLASS_PLAYER.lower(), "player", "person"):
            return "player"
        return "player"  # 알 수 없으면 선수로 취급

    def detect_frame(self, frame: np.ndarray):
        """한 프레임 추론 → supervision Detections (track_id 부여됨)."""
        result = self.model.predict(
            frame, conf=settings.CONF, imgsz=settings.IMGSZ,
            device=settings.DEVICE, verbose=False,
        )[0]
        detections = sv.Detections.from_ultralytics(result)
        # 공(ball)은 ByteTrack에 넣으면 끊기기 쉬워 별도로 다룸.
        ball_mask = np.array([
            self._role_of(self.names[c]) == "ball" for c in detections.class_id
        ]) if len(detections) else np.array([], dtype=bool)

        ball_det = detections[ball_mask] if len(detections) else detections
        people_det = detections[~ball_mask] if len(detections) else detections
        tracked_people = self.tracker.update_with_detections(people_det)
        return tracked_people, ball_det

    def role_for_class_id(self, class_id: int) -> str:
        return self._role_of(self.names.get(int(class_id), "player"))
