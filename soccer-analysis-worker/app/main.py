"""FastAPI 서버 — Cloud Run + GPU 엔드포인트.

권장 흐름(설계문서 V4 Queue):
  SoccerMom → Firestore에 작업 등록(status=queued) → Cloud Tasks가 이 서버의
  POST /analyze 를 호출 → 서버가 처리하며 Firestore 상태 갱신(processing→done) →
  결과(영상/JSON)는 GCS 저장 → SoccerMom이 Firestore 보고 결과화면 렌더.

엔드포인트:
  GET  /            헬스체크 (Cloud Run 기동 확인)
  GET  /healthz     모델 로드 상태 포함 헬스체크
  POST /analyze     분석 작업 1건 처리
"""
from __future__ import annotations

import os
import tempfile
import traceback

from fastapi import BackgroundTasks, FastAPI
from pydantic import BaseModel

from . import gcs, input_source, job_status, notify
from .config import settings
from .model_loader import resolve_model_path
from .pipeline import analyze_video
from .trackers import Tracker

app = FastAPI(title="SoccerMom 정밀분석 워커", version="1.0")

# 모델은 1회 로드 후 재사용(콜드스타트 비용 절감)
_tracker: Tracker | None = None
_is_soccer_model = False


def get_tracker() -> Tracker:
    global _tracker, _is_soccer_model
    if _tracker is None:
        path, is_soccer = resolve_model_path()
        _tracker = Tracker(path)
        _is_soccer_model = is_soccer
    return _tracker


class AnalyzeRequest(BaseModel):
    job_id: str                      # Firestore 문서 id
    video: str                       # gs://... 또는 youtube 링크
    # 결과 저장 경로(미지정 시 job_id 기준 자동)
    output_prefix: str | None = None
    # 원근변환 보정점(화면 4점). 없으면 거리/속도는 상대 추정값(px).
    source_points: list[list[float]] | None = None
    # 클릭 선수지정: 화면 좌표(영상 원본 픽셀) + 클릭 시점(초) + 메타(이름/번호/유니폼)
    target_point: list[float] | None = None
    target_time: float | None = None
    target_meta: dict | None = None
    # 콜백/동기 처리 여부
    run_async: bool = True


@app.get("/")
def root():
    return {"ok": True, "service": "soccermom-yolo-worker"}


@app.get("/healthz")
def healthz():
    return {
        "ok": True,
        "model_loaded": _tracker is not None,
        "soccer_model": _is_soccer_model,
        "device": settings.DEVICE,
        "gcs_bucket": bool(settings.GCS_BUCKET),
    }


def _run_job(req: AnalyzeRequest):
    job_id = req.job_id
    local_in = out_video = None
    try:
        job_status.mark_processing(job_id, progress=0.0)
        tracker = get_tracker()
        local_in = input_source.resolve_input(req.video)

        fd, out_video = tempfile.mkstemp(suffix=".mp4")
        os.close(fd)

        result = analyze_video(
            input_path=local_in,
            output_video_path=out_video,
            tracker=tracker,
            calibrated=bool(req.source_points),
            source_points=req.source_points,
            pitch_length_m=settings.PITCH_LENGTH_M,
            pitch_width_m=settings.PITCH_WIDTH_M,
            target_point=tuple(req.target_point) if req.target_point else None,
            target_meta=req.target_meta,
            target_time_sec=req.target_time,
            progress_cb=lambda p: job_status.mark_processing(job_id, progress=p),
        )

        prefix = req.output_prefix or f"results/{job_id}"
        video_uri = gcs.upload_file(out_video, f"{prefix}/annotated.mp4", "video/mp4")
        json_uri = gcs.upload_json(result, f"{prefix}/result.json")

        summary = {
            "possession": result["possession"],
            "players_count": len(result["players"]),
            "calibrated": result["calibrated"],
            "duration_sec": result.get("duration_sec"),
        }
        job_status.mark_done(job_id, video_uri, json_uri, summary=summary)
        notify.report_done(job_id, summary)  # 회장님 자동보고
    except Exception as e:  # noqa: BLE001
        traceback.print_exc()
        job_status.mark_failed(job_id, f"{type(e).__name__}: {e}")
        notify.report_failed(job_id, f"{type(e).__name__}: {e}")
    finally:
        for f in (local_in, out_video):
            try:
                if f and os.path.exists(f):
                    os.remove(f)
            except OSError:
                pass


@app.post("/analyze")
def analyze(req: AnalyzeRequest, bg: BackgroundTasks):
    if req.run_async:
        bg.add_task(_run_job, req)
        return {"accepted": True, "job_id": req.job_id, "status": "processing"}
    _run_job(req)
    return {"accepted": True, "job_id": req.job_id, "status": "finished"}
