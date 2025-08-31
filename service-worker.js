// Назва кешу (змінюйте версію, коли оновлюєте файли)
const CACHE_NAME = 'fuel-calculator-cache-v1';

// Файли, які потрібно зберегти для офлайн-роботи
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
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
        // Інакше, робимо звичайний запит до мережі
        return fetch(event.request);
      })
  );
});

// Активація Service Worker: видаляємо старий кеш
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
