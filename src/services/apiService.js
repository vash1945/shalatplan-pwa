/**
 * Mengambil satu ayat Al-Qur'an secara acak dari API yang stabil.
 * @returns {Promise<object>} Objek berisi teks arab, terjemahan, dan nama surat.
 */
export const fetchRandomVerse = async () => {
    try {
        // FIX: Menggunakan API yang dirancang khusus untuk ayat acak dan lebih stabil.
        const response = await fetch(`https://api.alquran.cloud/v1/ayah/random/quran-uthmani`);
        if (!response.ok) throw new Error('Gagal mengambil data ayat dari alquran.cloud.');
        const data = await response.json();

        const verseData = data.data;

        // Mengambil terjemahan bahasa Indonesia secara terpisah
        const translationResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${verseData.number}/id.indonesian`);
        if (!translationResponse.ok) throw new Error('Gagal mengambil terjemahan.');
        const translationData = await translationResponse.json();

        return {
            arabic: verseData.text,
            translation: translationData.data.text,
            surah: `${verseData.surah.englishName} : ${verseData.numberInSurah}`
        };
    } catch (error) {
        console.error("Error fetching random verse:", error);
        // Fallback jika API gagal
        return {
            arabic: "فَإِنَّ مَعَ ٱلْعُsسْرِ يُسْرًا",
            translation: "Maka sesungguhnya beserta kesulitan ada kemudahan.",
            surah: "Ash-Sharh:5"
        };
    }
};

/**
 * Mengambil kutipan motivasi acak dari API yang mendukung CORS.
 * @returns {Promise<object|null>} Objek berisi konten dan penulis kutipan.
 */
export const fetchMotivationalQuote = async () => {
    try {
        // FIX: Menggunakan API yang berbeda dan lebih andal untuk kutipan.
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) throw new Error('Gagal mengambil kutipan motivasi.');
        const data = await response.json();

        return {
            content: data.quote,
            author: data.author
        };
    } catch (error) {
        console.error("Error fetching motivational quote:", error);
        // Fallback jika API gagal
        return {
            content: "Setiap langkah kecil menuju tujuanmu adalah kemajuan besar.",
            author: "ShalatPlan"
        };
    }
};
