// FIX: Kunci diubah menjadi huruf kapital (Fajr, Dhuhr, dll.)
// agar cocok dengan respons dari API aladhan.com.
export const PRAYER_NAMES = {
    Fajr: "Subuh",
    Sunrise: "Syuruk",
    Dhuhr: "Dzuhur",
    Asr: "Ashar",
    Maghrib: "Maghrib",
    Isha: "Isya"
};

export const QUADRANT_DEFINITIONS = {
    1: { title: "Penting & Mendesak", color: "bg-red-500", desc: "Krisis, masalah mendesak. Lakukan segera." },
    2: { title: "Penting, Tak Mendesak", color: "bg-blue-500", desc: "Perencanaan, tujuan. Jadwalkan." },
    3: { title: "Mendesak, Tak Penting", color: "bg-yellow-500", desc: "Interupsi, beberapa rapat. Delegasikan." },
    4: { title: "Tak Penting, Tak Mendesak", color: "bg-gray-500", desc: "Hal sepele, buang waktu. Tunda/Hapus." },
};

export const POINTS_PER_QUADRANT = { 1: 10, 2: 20, 3: 5, 4: 1 };

export const APP_COPYRIGHT = "💚 Copyleft oleh Habibie. Karya ini bebas digunakan, dimodifikasi, dan disebarluaskan untuk kebaikan bersama. Mohon tetap mencantumkan nama pembuat dan menjaga semangat berbagi.";
export const APP_ACKNOWLEDGMENTS = "Terima kasih yang tulus untuk para guru, kedua orang tuaku, dan semua yang telah mendoakan serta mendukungku. Semoga Allah SWT membalas setiap kebaikan dengan pahala yang berlipat.";
export const APP_MOTTO = "ShalatPlan — Mengatur Waktu, Meraih Berkah.";
