"""정밀분석 파이프라인 — 영상 1개를 받아 추적/속도/거리/점유/하이라이트 산출.

흐름:
  영상 열기 → 프레임마다: YOLO감지+ByteTrack추적 → 팀색분류 → 카메라보정
            → (보정시) 미터좌표 → 속도/거리 누적 → 볼점유 → 오버레이 그리기
  → 결과 영상(mp4) + 지표 JSON 생성.

'클릭 선수지정': 첫 클릭 좌표(target_point)와 가장 가까운 트랙을 잠가서
해당 선수만 집중 리포트(등번호/이름은 입력값 사용). 등번호 자동인식은 신뢰 낮아 입력 보완.
"""
from __future__ import annotations

import cv2
import numpy as np

from .camera_movement import CameraMovementEstimator
from .ball_possession import PossessionCounter, nearest_player_to_ball
from .speed_distance import SpeedAndDistance
from .team_assigner import TeamAssigner
from .trackers import Tracker
from .view_transformer import ViewTransformer

TEAM_BGR = {1: (0, 0, 255), 2: (255, 128, 0), 0: (200, 200, 200)}


def _foot_point(bbox):
    """발 위치(박스 하단 중앙) — 경기장 평면 위치로 가장 적합."""
    x1, y1, x2, y2 = bbox
    return ((x1 + x2) / 2.0, float(y2))


def analyze_video(
    input_path: str,
    output_video_path: str,
    tracker: Tracker,
    calibrated: bool,
    source_points=None,
    pitch_length_m: float = 105.0,
    pitch_width_m: float = 68.0,
    target_point: tuple[float, float] | None = None,
    target_meta: dict | None = None,
    progress_cb=None,
) -> dict:
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise RuntimeError(f"영상을 열 수 없습니다: {input_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

    view = ViewTransformer(source_points, pitch_length_m, pitch_width_m)
    speed = SpeedAndDistance(fps=fps, calibrated=calibrated and view.calibrated)
    teams = TeamAssigner()
    possession = PossessionCounter()
    cam = None

    target_id: int | None = None
    teams_fitted = False
    frame_idx = 0
    highlights: list[dict] = []
    last_holder: int | None = None

    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if cam is None:
            cam = CameraMovementEstimator(frame)
            dx = dy = 0.0
        else:
            dx, dy = cam.movement_for_frame(frame)

        tracked_people, ball_det = tracker.detect_frame(frame)

        # 선수/심판 정리
        players: dict[int, dict] = {}
        for i in range(len(tracked_people)):
            tid = int(tracked_people.tracker_id[i])
            cid = int(tracked_people.class_id[i])
            role = tracker.role_for_class_id(cid)
            bbox = tracked_people.xyxy[i].tolist()
            if role in ("player", "goalkeeper"):
                players[tid] = {"bbox": bbox, "role": role}

        # 팀색 학습(선수 2명 이상 처음 잡힌 프레임)
        if not teams_fitted and len(players) >= 2:
            teams_fitted = teams.fit(frame, players)

        # 클릭 선수지정 → 가장 가까운 트랙 잠금
        if target_point is not None and target_id is None and players:
            tx, ty = target_point
            target_id = min(
                players,
                key=lambda t: (
                    (_foot_point(players[t]["bbox"])[0] - tx) ** 2
                    + (_foot_point(players[t]["bbox"])[1] - ty) ** 2
                ),
            )

        # 공
        ball_bbox = ball_det.xyxy[0].tolist() if len(ball_det) else None

        # 선수별 처리
        for tid, p in players.items():
            team = teams.team_of(frame, p["bbox"], tid) if teams_fitted else 0
            p["team"] = team
            fx, fy = _foot_point(p["bbox"])
            # 카메라 보정: 누적 이동량 보정 (간단화 — 프레임 단위 dx,dy 반영)
            fx_c, fy_c = fx + dx, fy + dy
            if view.calibrated:
                m = view.to_meters((fx_c, fy_c))
                if m is not None:
                    speed.update(frame_idx, tid, m)
            else:
                speed.update(frame_idx, tid, (fx_c, fy_c))
            _draw_player(frame, p, tid, team, highlight=(tid == target_id))

        # 볼 점유
        holder = nearest_player_to_ball(ball_bbox, players)
        if holder is not None and holder in players:
            possession.add(players[holder].get("team", 0))
            if holder != last_holder and players[holder].get("team", 0) != 0:
                # 소유권이 넘어가는 순간 = 하이라이트 후보(패스/탈취)
                highlights.append({
                    "time_sec": round(frame_idx / fps, 1),
                    "frame": frame_idx,
                    "event": "possession_change",
                    "track_id": holder,
                    "team": players[holder].get("team", 0),
                })
            last_holder = holder
        if ball_bbox is not None:
            _draw_ball(frame, ball_bbox)

        _draw_possession(frame, possession.percentages())
        writer.write(frame)

        frame_idx += 1
        if progress_cb and total_frames and frame_idx % 30 == 0:
            progress_cb(frame_idx / total_frames)

    cap.release()
    writer.release()

    # ── 결과 집계 ──
    players_summary = []
    for tid in speed.total_distance.keys():
        s = speed.summary(tid)
        s["track_id"] = tid
        s["team"] = teams.player_team.get(tid, 0)
        players_summary.append(s)
    players_summary.sort(key=lambda x: x["distance"], reverse=True)

    result = {
        "fps": round(fps, 2),
        "frames_processed": frame_idx,
        "duration_sec": round(frame_idx / fps, 1) if fps else None,
        "calibrated": bool(view.calibrated),
        "possession": possession.percentages(),
        "players": players_summary,
        "highlights": highlights[:30],
        "disclaimer": (
            "AI 측정값으로 오차가 있을 수 있습니다. "
            + ("" if view.calibrated else
               "경기장 보정점이 없어 거리/속도는 '상대 추정값(px)'이며 미터/‘km/h’가 아닙니다.")
        ),
    }
    if target_id is not None:
        ts = speed.summary(target_id)
        ts["track_id"] = target_id
        ts["team"] = teams.player_team.get(target_id, 0)
        if target_meta:
            ts.update({"name": target_meta.get("name"),
                       "number": target_meta.get("number"),
                       "jersey": target_meta.get("jersey")})
        result["target_player"] = ts
    return result


# ── 오버레이 그리기 ────────────────────────────────────────
def _draw_player(frame, p, tid, team, highlight=False):
    x1, y1, x2, y2 = [int(v) for v in p["bbox"]]
    color = TEAM_BGR.get(team, TEAM_BGR[0])
    thick = 3 if highlight else 2
    cv2.rectangle(frame, (x1, y1), (x2, y2), color, thick)
    label = f"#{tid}"
    if highlight:
        label = "★ " + label
        cv2.circle(frame, ((x1 + x2) // 2, y2), 6, (0, 255, 255), -1)
    cv2.putText(frame, label, (x1, max(0, y1 - 6)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)


def _draw_ball(frame, bbox):
    x1, y1, x2, y2 = [int(v) for v in bbox]
    cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
    cv2.circle(frame, (cx, cy), 8, (0, 255, 0), 2)


def _draw_possession(frame, pct):
    h, w = frame.shape[:2]
    txt = f"점유율  A {pct['team1']}%  |  B {pct['team2']}%"
    cv2.rectangle(frame, (10, 10), (360, 40), (0, 0, 0), -1)
    cv2.putText(frame, txt, (18, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
