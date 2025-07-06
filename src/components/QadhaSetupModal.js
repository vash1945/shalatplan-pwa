import React from 'react';

/**
 * Komponen modal untuk konfirmasi sebelum mengurangi hitungan qadha.
 * @param {object} props - Properti komponen.
 * @param {boolean} props.isOpen - Menentukan apakah modal sedang terbuka.
 * @param {function} props.onClose - Fungsi untuk menutup modal (misalnya, saat klik "Batal").
 * @param {function} props.onConfirm - Fungsi yang akan dijalankan saat klik "Ya, Sudah".
 */
function ConfirmQadhaModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-2 dark:text-dark-text">Konfirmasi Qadha'</h2>
        <p className="text-gray-600 dark:text-dark-text-secondary mb-6">Apakah Anda yakin sudah melaksanakan shalat qadha' ini?</p>
        <div className="flex justify-center gap-4">
        <button onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-dark-text rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
        Batal
        </button>
        <button onClick={onConfirm} className="px-6 py-2 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700">
        Ya, Sudah
        </button>
        </div>
        </div>
        </div>
    );
}

export default ConfirmQadhaModal;
