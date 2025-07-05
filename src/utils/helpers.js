/**
 * Mengembalikan tanggal hari ini dalam format string yang mudah dibaca (Bahasa Indonesia).
 * Contoh: "Sabtu, 6 Juli 2024"
 * @returns {string} Tanggal yang diformat.
 */
export const getTodayDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('id-ID', options);
};
