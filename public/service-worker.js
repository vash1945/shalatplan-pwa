const CACHE_NAME = 'shalatplan-cache-v1';
const urlsToCache = [
    '/',
'/index.html',
'/manifest.json',
'/favicon.ico',
'/icons/icon-192x192.png',
'/icons/icon-512x512.png',
'https://cdn.tailwindcss.com',
'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap',
// Tambahkan aset lain yang penting di sini
];

// Event: Install
// Dipanggil saat service worker pertama kali diinstal.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Cache dibuka');
            return cache.addAll(urlsToCache);
        })
    );
});

// Event: Activate
// Dipanggil setelah instalasi, digunakan untuk membersihkan cache lama.
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

// Event: Fetch
// Dipanggil setiap kali aplikasi meminta sumber daya (misalnya, file, gambar, API).
// Strategi: Cache-First
self.addEventListener('fetch', event => {
    // Abaikan permintaan non-GET
    if (event.request.method !== 'GET') {
        return;
    }

    // Untuk API Al-Adhan, selalu coba ambil dari jaringan terlebih dahulu
    if (event.request.url.includes('api.aladhan.com')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                // Jika offline, Anda bisa memberikan respons default dari cache jika ada
                return caches.match(event.request);
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Jika ada di cache, kembalikan dari cache
            if (response) {
                return response;
            }

            // Jika tidak ada di cache, coba ambil dari jaringan
            return fetch(event.request).then(
                networkResponse => {
                    // Jika berhasil, simpan ke cache dan kembalikan
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                }
            );
        })
        .catch(error => {
            // Jika gagal total (misalnya, offline dan tidak ada di cache),
            // Anda bisa mengembalikan halaman fallback offline.
            console.error('Fetching failed:', error);
            // return caches.match('/offline.html'); // Anda perlu membuat file ini
        })
    );
});
