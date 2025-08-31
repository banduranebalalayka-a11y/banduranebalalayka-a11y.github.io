// Назва кешу
const CACHE_NAME = 'fuel-calculator-cache-v1';

// Файли, які потрібно зберегти для офлайн-роботи
const urlsToCache = [
  './',
  './V2Інтерактивний розрахунок пального.html',
  './images/icon-192.png',
  './images/icon-512.png'
];

// Встановлення Service Worker: кешуємо файли
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кеш відкрито');
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехоплення запитів: віддаємо файли з кешу
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Якщо є збіг у кеші, повертаємо його
        if (response) {
          return response;
        }
        // Інакше, робимо звичайний запит
        return fetch(event.request);
      })
  );
});
