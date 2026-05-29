"""카메라 움직임 보정 (광학 흐름).

핸드폰 영상은 카메라가 흔들리고 패닝합니다. 그대로 두면 가만히 선 선수도
'움직인 것'으로 잡혀 속도/거리가 부풀려집니다. Lucas-Kanade 광학흐름으로
배경 특징점의 이동을 카메라 이동량으로 보고, 선수 좌표에서 빼서 보정합니다.
(원본 football_analysis와 동일 기법.)
"""
from __future__ import annotations

import cv2
import numpy as np


class CameraMovementEstimator:
    def __init__(self, first_frame: np.ndarray):
        self.min_distance = 5
        self.lk_params = dict(
            winSize=(15, 15), maxLevel=2,
            criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 10, 0.03),
        )
        gray = cv2.cvtColor(first_frame, cv2.COLOR_BGR2GRAY)
        # 화면 좌우 가장자리(관중/배경)에서 특징점 추출 — 선수보다 배경이 카메라움직임을 잘 반영
        mask = np.zeros_like(gray)
        mask[:, 0:20] = 1
        mask[:, -20:] = 1
        self.features = dict(maxCorners=100, qualityLevel=0.3,
                             minDistance=3, blockSize=7, mask=mask)
        self.prev_gray = gray
        self.prev_pts = cv2.goodFeaturesToTrack(gray, **self.features)

    def movement_for_frame(self, frame: np.ndarray) -> tuple[float, float]:
        """이전 프레임 대비 (dx, dy) 카메라 이동량(px). 실패 시 (0,0)."""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        dx = dy = 0.0
        if self.prev_pts is not None and len(self.prev_pts):
            new_pts, status, _ = cv2.calcOpticalFlowPyrLK(
                self.prev_gray, gray, self.prev_pts, None, **self.lk_params)
            if new_pts is not None:
                max_d = 0.0
                for new, old in zip(new_pts, self.prev_pts):
                    nx, ny = new.ravel()
                    ox, oy = old.ravel()
                    d = ((nx - ox) ** 2 + (ny - oy) ** 2) ** 0.5
                    if d > max_d:
                        max_d, dx, dy = d, ox - nx, oy - ny
                if max_d < self.min_distance:
                    dx = dy = 0.0
        self.prev_gray = gray
        self.prev_pts = cv2.goodFeaturesToTrack(gray, **self.features)
        return dx, dy
