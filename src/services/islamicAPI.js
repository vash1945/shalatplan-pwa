/**
 * Mengambil satu ayat Al-Qur'an secara acak dari API yang berbeda untuk stabilitas.
 * @returns {Promise<object|null>} Objek berisi teks arab, terjemahan, dan nama surat, atau null jika gagal.
 */
export const fetchRandomVerse = async () => {
    try {
        // Menggunakan API dari SantriKoding yang lebih sederhana
        const response = await fetch(`https://quran-api.santrikoding.com/api/random`);
        if (!response.ok) {
            throw new Error('Gagal mengambil data ayat dari API SantriKoding');
        }
        const data = await response.json();

        // Memformat data agar sesuai dengan yang dibutuhkan komponen Dashboard
        return {
            arabic: data.ar,
            translation: data.id,
            surah: `${data.surah}:${data.ayat}`
        };

    } catch (error) {
        console.error("Error fetching random verse:", error);
        // Fallback jika API gagal: kembalikan ayat yang memotivasi secara manual
        return {
            arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
            translation: "Maka sesungguhnya beserta kesulitan ada kemudahan.",
            surah: "Ash-Sharh:5"
        };
    }
};
