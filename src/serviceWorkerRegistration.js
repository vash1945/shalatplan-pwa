// Kode ini bersifat opsional dan digunakan untuk mendaftarkan service worker.
// Secara default, register() tidak dipanggil.

// Ini memungkinkan aplikasi memuat lebih cepat pada kunjungan berikutnya di lingkungan produksi,
// dan memberikan kemampuan offline. Namun, ini juga berarti pengembang (dan pengguna)
// hanya akan melihat pembaruan yang di-deploy pada kunjungan berikutnya ke halaman,
// setelah semua tab yang ada untuk halaman tersebut ditutup, karena sumber daya
// yang sebelumnya di-cache diperbarui di latar belakang.

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] adalah alamat localhost IPv6.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 dianggap localhost untuk IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        // Konstruktor URL tersedia di semua browser yang mendukung SW.
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            // Service worker kita tidak akan berfungsi jika PUBLIC_URL berada di origin yang berbeda
            // dari tempat halaman kita disajikan. Ini bisa terjadi jika CDN digunakan untuk
            // menyajikan aset; lihat https://github.com/facebook/create-react-app/issues/2374
            return;
        }

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (isLocalhost) {
                // Ini berjalan di localhost. Mari kita periksa apakah service worker masih ada atau tidak.
                checkValidServiceWorker(swUrl, config);

                // Tambahkan beberapa log tambahan ke localhost, yang mengarahkan pengembang ke
                // dokumentasi service worker/PWA.
                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        'This web app is being served cache-first by a service ' +
                        'worker. To learn more, visit https://cra.link/PWA'
                    );
                });
            } else {
                // Bukan localhost. Langsung daftarkan service worker.
                registerValidSW(swUrl, config);
            }
        });
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
        registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
                return;
            }
            installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // Pada titik ini, konten precached yang diperbarui telah diambil,
                        // tetapi service worker sebelumnya akan tetap menyajikan konten yang lebih lama
                        // sampai semua tab klien ditutup.
                        console.log(
                            'New content is available and will be used when all ' +
                            'tabs for this page are closed. See https://cra.link/PWA.'
                        );

                        // Jalankan callback
                        if (config && config.onUpdate) {
                            config.onUpdate(registration);
                        }
                    } else {
                        // Pada titik ini, semuanya telah di-precache.
                        // Ini adalah waktu yang tepat untuk menampilkan pesan
                        // "Konten di-cache untuk penggunaan offline."
                        console.log('Content is cached for offline use.');

                        // Jalankan callback
                        if (config && config.onSuccess) {
                            config.onSuccess(registration);
                        }
                    }
                }
            };
        };
    })
    .catch((error) => {
        console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
    // Periksa apakah service worker dapat ditemukan. Jika tidak, muat ulang halaman.
    fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
    })
    .then((response) => {
        // Pastikan service worker ada, dan kita benar-benar mendapatkan file JS.
        const contentType = response.headers.get('content-type');
        if (
            response.status === 404 ||
            (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
            // Tidak ada service worker yang ditemukan. Mungkin aplikasi yang berbeda. Muat ulang halaman.
            navigator.serviceWorker.ready.then((registration) => {
                registration.unregister().then(() => {
                    window.location.reload();
                });
            });
        } else {
            // Service worker ditemukan. Lanjutkan seperti biasa.
            registerValidSW(swUrl, config);
        }
    })
    .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
        .then((registration) => {
            registration.unregister();
        })
        .catch((error) => {
            console.error(error.message);
        });
    }
}
