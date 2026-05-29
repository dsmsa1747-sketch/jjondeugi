"""원근변환: 화면 픽셀 좌표 → 경기장 미터 좌표.

카메라는 비스듬히 찍으므로 화면에서의 1px가 실제 거리로는 위치마다 다릅니다.
경기장 위 4개 기준점(예: 페널티박스 모서리)의 화면좌표 ↔ 실제좌표(미터)를 알면
호모그래피(원근변환)로 모든 점을 미터 좌표로 펼 수 있습니다.

⚠️ 한계(정직): 이 4점은 영상/카메라각도마다 다릅니다. 자동 경기장 인식은 어렵고,
보정점이 없으면 미터/속도를 단정할 수 없습니다. 그래서:
  - 보정점(source_points)이 주어지면 → 실제 미터/‘km/h’ 계산
  - 없으면 → 미터 변환을 끄고, 거리/속도는 '상대 추정값'으로만 표기
"""
from __future__ import annotations

import cv2
import numpy as np


class ViewTransformer:
    def __init__(self, source_points: list[list[float]] | None,
                 pitch_length_m: float, pitch_width_m: float):
        """source_points: 화면상의 4점 [[x,y]×4] (좌상,우상,우하,좌하 순서 권장).
        주어지면 그 4점이 경기장 한 구역(가로 pitch_width, 세로 pitch_length의 일부)에
        대응한다고 보고 호모그래피를 만듭니다. None이면 변환 비활성(calibrated=False).
        """
        self.calibrated = False
        self.M = None
        if source_points and len(source_points) == 4:
            src = np.array(source_points, dtype=np.float32)
            # 대상(실제) 사각형: 폭=경기장 너비, 높이=경기장 길이 (미터)
            dst = np.array([
                [0, 0],
                [pitch_width_m, 0],
                [pitch_width_m, pitch_length_m],
                [0, pitch_length_m],
            ], dtype=np.float32)
            self.M = cv2.getPerspectiveTransform(src, dst)
            self.calibrated = True

    def to_meters(self, point: tuple[float, float]) -> tuple[float, float] | None:
        """화면 좌표 → 미터 좌표. 보정 안됐으면 None."""
        if not self.calibrated:
            return None
        p = np.array([[point]], dtype=np.float32)
        out = cv2.perspectiveTransform(p, self.M)
        return float(out[0][0][0]), float(out[0][0][1])
