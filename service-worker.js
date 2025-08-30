// Назва кешу та файли, які потрібно зберегти
const CACHE_NAME = 'fuel-calculator-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './images/icon-192.png',
  './images/icon-512.png'
];

// 1. Встановлення Service Worker: кешуємо основні файли
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кеш відкрито, додаємо файли...');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Перехоплення запитів: віддаємо файли з кешу, якщо вони там є
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Якщо запит є в кеші, повертаємо його
        if (response) {
          return response;
        }
        // Інакше, робимо звичайний запит до мережі
        return fetch(event.request);
      })
  );
});
