"""회장님 자동보고 (메신저 알림).

정책:
 - 인프라는 전부 Google. 단 '회장님께 자동보고'는 메신저로 보냅니다(자동화 목적).
 - 자동화에 가장 적합한 **텔레그램**을 기본 제공(봇 토큰만 있으면 즉시 동작, 추가 의존성 없음).
 - 메신저는 교체 가능: NOTIFY_PROVIDER 로 선택. (카카오 등은 추후 확장 지점 표시)

이것은 '학부모용 완료 알림(앱 푸시=FCM)'과 별개인 '운영자 보고 채널'입니다.
"""
from __future__ import annotations

import json
import urllib.parse
import urllib.request

from .config import settings


def _send_telegram(text: str) -> bool:
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID
    if not token or not chat_id:
        print("[notify] 텔레그램 미설정 — 보고 생략")
        return False
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({
        "chat_id": chat_id, "text": text, "parse_mode": "HTML",
    }).encode()
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=data), timeout=10) as r:
            return r.status == 200
    except Exception as e:  # noqa: BLE001
        print(f"[notify] 텔레그램 전송 실패: {e}")
        return False


def report(text: str) -> bool:
    """회장님께 자동보고. 설정된 provider로 발송."""
    provider = (settings.NOTIFY_PROVIDER or "telegram").lower()
    if provider == "none":
        return False
    if provider == "telegram":
        return _send_telegram(text)
    # 확장 지점: provider == "kakao" 등 추가 가능(카카오는 토큰 발급 흐름이 별도라 추후 구현)
    print(f"[notify] 지원하지 않는 provider: {provider} — 보고 생략")
    return False


def report_done(job_id: str, summary: dict) -> bool:
    poss = summary.get("possession", {})
    msg = (
        "✅ <b>정밀분석 완료</b>\n"
        f"작업: {job_id}\n"
        f"선수 수: {summary.get('players_count', '-')}\n"
        f"점유율: A {poss.get('team1', '-')}% / B {poss.get('team2', '-')}%\n"
        f"길이: {summary.get('duration_sec', '-')}초 "
        f"(보정 {'O' if summary.get('calibrated') else 'X·상대값'})"
    )
    return report(msg)


def report_failed(job_id: str, error: str) -> bool:
    return report(f"⚠️ <b>정밀분석 실패</b>\n작업: {job_id}\n사유: {error[:300]}")
