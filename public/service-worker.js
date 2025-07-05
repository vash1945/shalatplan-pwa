// Nama cache unik untuk aplikasi Anda
const CACHE_NAME = 'shalatplan-cache-v1.3';

// Daftar URL API yang akan kita cache
const API_URLS_TO_CACHE = [
    '[https://api.myquran.com/v1/sholat/kota/cari/](https://api.myquran.com/v1/sholat/kota/cari/)',
    '[https://api.myquran.com/v1/sholat/jadwal/](https://api.myquran.com/v1/sholat/jadwal/)',
    '[https://api.alquran.cloud/v1/ayah/random/quran-uthmani](https://api.alquran.cloud/v1/ayah/random/quran-uthmani)',
    '[https://api.alquran.cloud/v1/ayah/](https://api.alquran.cloud/v1/ayah/)',
    '[https://dummyjson.com/quotes/random](https://dummyjson.com/quotes/random)'
];

// Event: Install
// Dipanggil saat service worker pertama kali diinstal.
self.addEventListener('install', (event) => {
    // Skip waiting untuk mempercepat aktivasi service worker baru.
    event.waitUntil(self.skipWaiting());
});

// Event: Activate
// Dipanggil setelah instalasi, digunakan untuk membersihkan cache lama.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Ambil alih kontrol halaman
    );
});

// Event: Fetch
// Dipanggil setiap kali aplikasi meminta sumber daya (file, gambar, API).
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Cek apakah permintaan ini adalah untuk API yang ingin kita cache
    const isApiUrl = API_URLS_TO_CACHE.some(url => request.url.startsWith(url));

    if (isApiUrl) {
        // Strategi: Stale-While-Revalidate untuk API
        // 1. Coba ambil dari cache terlebih dahulu.
        // 2. Sambil melakukan itu, coba juga ambil dari jaringan.
        // 3. Jika jaringan berhasil, perbarui cache.
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    const fetchPromise = fetch(request).then((networkResponse) => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });

                    // Kembalikan data dari cache jika ada, sambil menunggu pembaruan dari jaringan.
                    return cachedResponse || fetchPromise;
                });
            })
        );
    } else {
        // Untuk aset lain (HTML, JS, CSS), gunakan strategi Cache-First.
        event.respondWith(
            caches.match(request).then((response) => {
                return response || fetch(request);
            })
        );
    }
});
