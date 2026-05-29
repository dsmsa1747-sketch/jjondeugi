"""Google Cloud Storage 입출력 — 입력 영상 다운로드 / 결과 영상·JSON 업로드.

인증: Cloud Run 서비스 계정 권한(ADC)을 자동 사용하므로 키 파일이 필요 없습니다.
"""
from __future__ import annotations

import json
import os
import tempfile

from google.cloud import storage

from .config import settings

_client: storage.Client | None = None


def _bucket(name: str | None = None):
    global _client
    if _client is None:
        _client = storage.Client(project=settings.GCP_PROJECT or None)
    return _client.bucket(name or settings.GCS_BUCKET)


def parse_gs_uri(uri: str) -> tuple[str, str]:
    """'gs://bucket/path/to/obj' → ('bucket', 'path/to/obj')"""
    assert uri.startswith("gs://"), f"gs:// URI 가 아닙니다: {uri}"
    rest = uri[len("gs://"):]
    bucket, _, blob = rest.partition("/")
    return bucket, blob


def download_to_tmp(gs_uri: str, suffix: str = "") -> str:
    bucket_name, blob_name = parse_gs_uri(gs_uri)
    blob = _bucket(bucket_name).blob(blob_name)
    fd, path = tempfile.mkstemp(suffix=suffix or os.path.splitext(blob_name)[1])
    os.close(fd)
    blob.download_to_filename(path)
    return path


def upload_file(local_path: str, dest_blob: str, content_type: str | None = None) -> str:
    blob = _bucket().blob(dest_blob)
    blob.upload_from_filename(local_path, content_type=content_type)
    return f"gs://{settings.GCS_BUCKET}/{dest_blob}"


def upload_json(obj: dict, dest_blob: str) -> str:
    blob = _bucket().blob(dest_blob)
    blob.upload_from_string(
        json.dumps(obj, ensure_ascii=False, indent=2),
        content_type="application/json; charset=utf-8",
    )
    return f"gs://{settings.GCS_BUCKET}/{dest_blob}"
