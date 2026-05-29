"""입력 영상 확보 — GCS 객체 또는 YouTube 링크 → 로컬 파일 경로."""
from __future__ import annotations

import os
import re
import subprocess
import tempfile

from . import gcs


def _clean_youtube_url(url: str) -> str:
    """공유 꼬리표(&t=, &list= 등) 제거 — 잘못된 형식 방지."""
    m = re.search(r"(?:v=|youtu\.be/|/shorts/)([A-Za-z0-9_-]{11})", url)
    if m:
        return f"https://www.youtube.com/watch?v={m.group(1)}"
    return url.split("&")[0]


def resolve_input(video: str) -> str:
    """video: 'gs://...' 또는 'http(s)://youtube...' 또는 로컬경로 → 로컬 mp4 경로."""
    if video.startswith("gs://"):
        return gcs.download_to_tmp(video, suffix=".mp4")
    if "youtube.com" in video or "youtu.be" in video:
        url = _clean_youtube_url(video)
        out = os.path.join(tempfile.gettempdir(), "yt_input.mp4")
        # 720p 이하로 받아 처리속도 확보
        subprocess.run(
            ["yt-dlp", "-f", "best[height<=720][ext=mp4]/best[ext=mp4]/best",
             "-o", out, url],
            check=True,
        )
        return out
    if os.path.exists(video):
        return video
    raise ValueError(f"지원하지 않는 입력: {video}")
