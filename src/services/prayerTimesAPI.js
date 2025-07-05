/**
 * Mengambil data jadwal shalat dari API Al-Adhan berdasarkan kota.
 * @param {string} city - Nama kota di Indonesia.
 * @returns {Promise<object>} Objek yang berisi waktu shalat (Fajr, Dhuhr, Asr, dll.).
 * @throws {Error} Akan melempar error jika gagal mengambil data atau jika kota tidak ditemukan.
 */
export const fetchPrayerTimes = async (city) => {
    // URL endpoint API dengan parameter yang diperlukan.
    // method=11 adalah metode Kemenag RI.
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=11`;

    try {
        // Melakukan permintaan ke API menggunakan fetch.
        const response = await fetch(apiUrl);

        // Memeriksa apakah respons dari server tidak berhasil (misalnya, status 404 atau 500).
        if (!response.ok) {
            throw new Error('Respons jaringan tidak baik. Status: ' + response.status);
        }

        // Mengubah respons menjadi format JSON.
        const data = await response.json();

        // Memeriksa apakah kode status dari API adalah 200 (OK).
        if (data.code === 200) {
            // Jika berhasil, kembalikan objek 'timings' yang berisi jadwal shalat.
            return data.data.timings;
        } else {
            // Jika API mengembalikan error (misalnya, kota tidak valid), lemparkan error.
            throw new Error(data.data || 'Kota tidak dapat ditemukan di API.');
        }
    } catch (error) {
        // Menangkap semua error yang mungkin terjadi (jaringan, parsing, dll.).
        console.error("Terjadi kesalahan saat mengambil jadwal shalat:", error);
        // Melemparkan kembali error agar bisa ditangani oleh komponen yang memanggil fungsi ini.
        throw error;
    }
};
