# ShalatPlan PWA

*ShalatPlan — Mengatur Waktu, Meraih Berkah.*

**ShalatPlan** adalah Progressive Web App (PWA) yang dirancang untuk menjadi asisten ibadah dan produktivitas harian Anda. Aplikasi ini membantu Anda melacak waktu shalat dan mengelola tugas menggunakan metode Kuadran Eisenhower.

## Fitur Utama

-   **Jadwal Shalat Akurat**: Menampilkan waktu shalat berdasarkan lokasi kota Anda di Indonesia.
-   **Manajemen Tugas Kuadran**: Kelola tugas berdasarkan prioritas (Penting, Mendesak).
-   **Sistem Poin**: Dapatkan poin dengan menyelesaikan tugas dan mencatat shalat tepat waktu.
-   **Laporan Produktivitas**: Lacak kemajuan ibadah dan penyelesaian tugas Anda.
-   **Kemampuan Offline**: Dapat diakses bahkan tanpa koneksi internet berkat teknologi PWA.
-   **Dapat Diinstal**: Tambahkan aplikasi ke layar utama perangkat Anda untuk akses cepat.

## Instalasi dan Menjalankan Proyek

1.  **Clone repositori ini:**
    ```bash
    git clone <url-repositori>
    cd shalatplan-pwa
    ```

2.  **Install dependensi:**
    ```bash
    npm install
    ```

3.  **Buat file `.env`:**
    Buat file bernama `.env` di root proyek dan isi dengan konfigurasi Firebase Anda.

    ```
    REACT_APP_FIREBASE_API_KEY=YourApiKey
    REACT_APP_FIREBASE_AUTH_DOMAIN=YourAuthDomain
    REACT_APP_FIREBASE_PROJECT_ID=YourProjectId
    REACT_APP_FIREBASE_STORAGE_BUCKET=YourStorageBucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YourMessagingSenderId
    REACT_APP_FIREBASE_APP_ID=YourAppId
    ```

4.  **Jalankan aplikasi di mode development:**
    ```bash
    npm start
    ```

    Buka [http://localhost:3000](http://localhost:3000) untuk melihatnya di browser.

## Lisensi dan Atribusi

#### Lisensi
-   Kode sumber aplikasi ini dilisensikan di bawah **[GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)**.
-   Konten dan desain visual menggunakan lisensi **[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)**.

#### Atribusi dan Semangat Berbagi
💚 Copyleft oleh Habibie. Karya ini bebas digunakan, dimodifikasi, dan disebarluaskan untuk kebaikan bersama. Mohon tetap mencantumkan nama pembuat dan menjaga semangat berbagi.

#### Ucapan Terima Kasih
Terima kasih yang tulus untuk Ustadz, para guru, kedua orang tuaku, dan semua yang telah mendoakan serta mendukungku. Semoga Allah SWT membalas setiap kebaikan dengan pahala yang berlipat.

---
[![Firebase Hosting](https://github.com/<vash1945>/<shalatplan-pwa>/actions/workflows/firebase-hosting-pull-request.yml/badge.svg)](https://github.com/<vash1945>/<shalatplan-pwa>/actions)


