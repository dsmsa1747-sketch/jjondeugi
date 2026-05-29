"""유니폼 색으로 팀 분류 (KMeans).

각 선수 박스 상단(상의 영역) 픽셀을 모아 KMeans(k=2)로 두 팀 대표색을 찾고,
이후 각 선수를 가까운 팀에 배정합니다. (원본 football_analysis와 동일 기법.)
"""
from __future__ import annotations

import numpy as np
from sklearn.cluster import KMeans


class TeamAssigner:
    def __init__(self):
        self.kmeans: KMeans | None = None
        self.team_colors: dict[int, np.ndarray] = {}
        self.player_team: dict[int, int] = {}  # track_id → 팀(1 or 2)

    @staticmethod
    def _jersey_color(frame: np.ndarray, bbox) -> np.ndarray:
        x1, y1, x2, y2 = [int(v) for v in bbox]
        x1, y1 = max(x1, 0), max(y1, 0)
        crop = frame[y1:y2, x1:x2]
        if crop.size == 0:
            return np.array([0, 0, 0], dtype=float)
        # 상의는 박스 위쪽 절반 → 그중 가운데 영역(다리/배경 노이즈 줄임)
        top = crop[: max(1, crop.shape[0] // 2), :]
        h, w = top.shape[:2]
        center = top[:, w // 4 : (3 * w) // 4] if w >= 4 else top
        pixels = center.reshape(-1, 3).astype(float)
        if len(pixels) < 2:
            return pixels.mean(axis=0) if len(pixels) else np.array([0, 0, 0], float)
        km = KMeans(n_clusters=2, n_init=4, random_state=0).fit(pixels)
        # 모서리(배경)에 많은 군집을 배경으로 보고, 반대 군집을 유니폼색으로 채택
        labels = km.labels_.reshape(center.shape[:2])
        corners = [labels[0, 0], labels[0, -1], labels[-1, 0], labels[-1, -1]]
        bg = max(set(corners), key=corners.count)
        jersey = 1 - bg
        return km.cluster_centers_[jersey]

    def fit(self, frame: np.ndarray, players: dict[int, dict]):
        """첫 유효 프레임에서 두 팀 대표색 학습. players: {track_id: {"bbox": ...}}"""
        colors = [self._jersey_color(frame, p["bbox"]) for p in players.values()]
        if len(colors) < 2:
            return False
        self.kmeans = KMeans(n_clusters=2, n_init=10, random_state=0).fit(colors)
        self.team_colors = {1: self.kmeans.cluster_centers_[0],
                            2: self.kmeans.cluster_centers_[1]}
        return True

    def team_of(self, frame: np.ndarray, bbox, track_id: int) -> int:
        if self.kmeans is None:
            return 0
        if track_id in self.player_team:
            return self.player_team[track_id]
        color = self._jersey_color(frame, bbox)
        team = int(self.kmeans.predict([color])[0]) + 1
        self.player_team[track_id] = team
        return team
