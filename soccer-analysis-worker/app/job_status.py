"""Firestore 작업 상태 관리 (분석중 → 완료/실패).

SoccerMom 웹앱은 이 컬렉션 문서를 구독/폴링해서 "분석중→완료"를 표시하고
결과(GCS 경로)를 읽어 그래프/영상을 렌더링합니다.
"""
from __future__ import annotations

import datetime as _dt

from google.cloud import firestore

from .config import settings

_db: firestore.Client | None = None


def _client() -> firestore.Client:
    global _db
    if _db is None:
        _db = firestore.Client(project=settings.GCP_PROJECT or None)
    return _db


def _doc(job_id: str):
    return _client().collection(settings.FIRESTORE_COLLECTION).document(job_id)


def set_status(job_id: str, status: str, **fields):
    """status: queued | processing | done | failed"""
    payload = {"status": status, "updatedAt": _dt.datetime.utcnow().isoformat() + "Z"}
    payload.update(fields)
    _doc(job_id).set(payload, merge=True)


def mark_processing(job_id: str, progress: float | None = None):
    fields = {} if progress is None else {"progress": round(progress, 3)}
    set_status(job_id, "processing", **fields)


def mark_done(job_id: str, result_video_uri: str, result_json_uri: str, summary: dict):
    set_status(job_id, "done",
               resultVideoUri=result_video_uri,
               resultJsonUri=result_json_uri,
               summary=summary)


def mark_failed(job_id: str, error: str):
    set_status(job_id, "failed", error=str(error)[:1000])
