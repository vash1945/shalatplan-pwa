import { getStorageItem, setStorageItem } from '../utils/storage.js';

/**
 * Mengambil data jadwal shalat dengan cepat menggunakan endpoint harian dari aladhan.com.
 * Sistem caching tetap dipertahankan untuk penggunaan offline.
 * @param {string} city - Nama kota di Indonesia.
 * @returns {Promise<object|null>} Objek yang berisi data jadwal shalat.
 */
export const fetchPrayerTimes = async (city) => {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `prayerTimes_aladhan_${city}_${today}`;

    const cachedData = getStorageItem(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    // Kembali menggunakan endpoint `timingsByCity` yang cepat dan andal.
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=11`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Respons jaringan tidak baik.');

        const result = await response.json();

        if (result.code === 200) {
            // Kita hanya mengambil dan menyimpan objek 'timings'.
            const timings = result.data.timings;
            setStorageItem(cacheKey, timings);
            return timings;
        } else {
            throw new Error(result.data || 'Kota tidak dapat ditemukan di API.');
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat mengambil jadwal shalat:", error);
        throw error;
    }
};
