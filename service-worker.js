// Назва кешу (змінюйте версію v1, v2, v3..., коли оновлюєте файли)
const CACHE_NAME = 'fuel-calculator-cache-v5';

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
        console.log('Кеш відкрито, додаємо файли...');
        return cache.addAll(urlsToCache);
      })
  );
  // Примушуємо нового SW активуватися швидше
  self.skipWaiting(); 
});

// Активація Service Worker: видаляємо старий кеш
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Якщо ім'я кешу не збігається з поточним, видаляємо його
          if (cacheName !== CACHE_NAME) {
            console.log('Видалення старого кешу:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Беремо контроль над сторінкою одразу
      return self.clients.claim();
    })
  );
});

// Перехоплення запитів: оновлена стратегія "Cache first, then network"
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
     event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((response) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                })
                return response || fetchPromise;
            })
        })
     );
  }
});

// Отримання повідомлення від клієнта для активації оновлення
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});// Назва кешу (змінюйте версію v1, v2, v3..., коли оновлюєте файли)
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
        console.log('Кеш відкрито, додаємо файли...');
        return cache.addAll(urlsToCache);
      })
  );
  // Додано: Примушуємо нового SW активуватися швидше
  self.skipWaiting(); 
});

// Активація Service Worker: видаляємо старий кеш
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Якщо ім'я кешу не збігається з поточним, видаляємо його
          if (cacheName !== CACHE_NAME) {
            console.log('Видалення старого кешу:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Додано: Беремо контроль над сторінкою одразу
      return self.clients.claim();
    })
  );
});

// Перехоплення запитів: оновлена стратегія "Cache first, then network"
self.addEventListener('fetch', event => {
  // Ми відповідаємо лише на навігаційні запити (завантаження сторінки)
  if (event.request.mode === 'navigate') {
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
  }
});

// Додано: Новий слухач для отримання повідомлень від програми
self.addEventListener('message', (event) => {
  // Якщо програма надіслала команду 'skipWaiting', виконуємо її
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
