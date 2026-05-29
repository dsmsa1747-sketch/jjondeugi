"""볼 점유: 공에 가장 가까운 선수가 '소유' → 팀별 점유율 누적."""
from __future__ import annotations


def nearest_player_to_ball(ball_bbox, players: dict[int, dict], max_px: float = 70.0):
    """공 중심에 가장 가까운(임계 이내) 선수 track_id 반환. 없으면 None."""
    if ball_bbox is None:
        return None
    bx = (ball_bbox[0] + ball_bbox[2]) / 2
    by = (ball_bbox[1] + ball_bbox[3]) / 2
    best_id, best_d = None, max_px
    for tid, p in players.items():
        x1, y1, x2, y2 = p["bbox"]
        # 발 위치(박스 하단 중앙) 기준이 점유 판단에 적합
        px, py = (x1 + x2) / 2, y2
        d = ((px - bx) ** 2 + (py - by) ** 2) ** 0.5
        if d < best_d:
            best_d, best_id = d, tid
    return best_id


class PossessionCounter:
    def __init__(self):
        self.frames_by_team = {1: 0, 2: 0}

    def add(self, team: int):
        if team in (1, 2):
            self.frames_by_team[team] += 1

    def percentages(self) -> dict[str, float]:
        total = self.frames_by_team[1] + self.frames_by_team[2]
        if total == 0:
            return {"team1": 0.0, "team2": 0.0}
        return {
            "team1": round(100 * self.frames_by_team[1] / total, 1),
            "team2": round(100 * self.frames_by_team[2] / total, 1),
        }
