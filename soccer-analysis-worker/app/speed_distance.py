"""선수별 속도·이동거리 계산.

원리(가짜 난수 아님 — 실제 물리 계산):
  거리 = 위치 변화량,  속도 = 거리 / 시간(프레임수/fps)
  보정(원근변환)이 됐으면 미터 단위 → m/s → ×3.6 → km/h
  보정이 안 됐으면 픽셀 단위 → '상대 추정값'으로만 표기(단위 단정 금지)
"""
from __future__ import annotations

from collections import defaultdict


class SpeedAndDistance:
    def __init__(self, fps: float, calibrated: bool, window_frames: int = 5):
        self.fps = max(fps, 1.0)
        self.calibrated = calibrated
        self.window = max(window_frames, 1)
        self._last_pos: dict[int, tuple[int, tuple[float, float]]] = {}  # tid → (frame, pos)
        self.total_distance: dict[int, float] = defaultdict(float)
        self.max_speed: dict[int, float] = defaultdict(float)
        self.speed_samples: dict[int, list[float]] = defaultdict(list)

    def update(self, frame_idx: int, track_id: int, pos: tuple[float, float]):
        """pos: 보정됐으면 미터좌표, 아니면 화면 픽셀좌표."""
        prev = self._last_pos.get(track_id)
        if prev is not None:
            pf, ppos = prev
            df = frame_idx - pf
            if df >= self.window:
                dist = ((pos[0] - ppos[0]) ** 2 + (pos[1] - ppos[1]) ** 2) ** 0.5
                dt = df / self.fps
                if dt > 0:
                    speed = dist / dt  # m/s 또는 px/s
                    if self.calibrated:
                        speed *= 3.6  # km/h
                    self.total_distance[track_id] += dist  # m 또는 px
                    self.max_speed[track_id] = max(self.max_speed[track_id], speed)
                    self.speed_samples[track_id].append(speed)
                self._last_pos[track_id] = (frame_idx, pos)
        else:
            self._last_pos[track_id] = (frame_idx, pos)

    def summary(self, track_id: int) -> dict:
        samples = self.speed_samples.get(track_id, [])
        avg = sum(samples) / len(samples) if samples else 0.0
        return {
            "distance": round(self.total_distance.get(track_id, 0.0), 1),
            "avg_speed": round(avg, 1),
            "max_speed": round(self.max_speed.get(track_id, 0.0), 1),
            "unit_distance": "m" if self.calibrated else "px(상대)",
            "unit_speed": "km/h" if self.calibrated else "px/s(상대)",
            "estimated": not self.calibrated,
        }
