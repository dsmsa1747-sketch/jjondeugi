// 사커맘 서비스 워커 — PWA 기본 캐싱
const CACHE_NAME = "soccermom-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
];

// 설치: 정적 자산 캐싱
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 활성화: 이전 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: 네트워크 우선, 실패 시 캐시 반환 (API 요청은 캐시 안 함)
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API 요청은 항상 네트워크
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // GET 요청만 캐시 전략 적용
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 성공 응답을 캐시에도 저장
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // 오프라인: 캐시에서 반환
        return caches.match(event.request).then((cached) => cached || caches.match("/"));
      })
  );
});
