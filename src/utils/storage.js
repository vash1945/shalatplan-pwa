// Wrapper sederhana untuk berinteraksi dengan localStorage browser.

/**
 * Menyimpan item ke localStorage.
 * Secara otomatis mengubah objek/array menjadi string JSON.
 * @param {string} key - Kunci untuk item yang akan disimpan.
 * @param {*} value - Nilai yang akan disimpan.
 */
export const setStorageItem = (key, value) => {
    try {
        const valueToStore = JSON.stringify(value);
        localStorage.setItem(key, valueToStore);
    } catch (error) {
        console.error(`Gagal menyimpan item ke localStorage (key: ${key}):`, error);
    }
};

/**
 * Mengambil item dari localStorage.
 * Secara otomatis mengubah string JSON kembali menjadi objek/array.
 * @param {string} key - Kunci item yang akan diambil.
 * @returns {*} Nilai yang tersimpan, atau null jika tidak ditemukan atau terjadi error.
 */
export const getStorageItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Gagal mengambil item dari localStorage (key: ${key}):`, error);
        return null;
    }
};

/**
 * Menghapus item dari localStorage.
 * @param {string} key - Kunci item yang akan dihapus.
 */
export const removeStorageItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Gagal menghapus item dari localStorage (key: ${key}):`, error);
    }
};
