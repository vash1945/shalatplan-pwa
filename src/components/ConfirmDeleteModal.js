import React from 'react';

/**
 * Komponen modal untuk konfirmasi sebelum menghapus.
 * @param {object} props - Properti komponen.
 * @param {boolean} props.isOpen - Menentukan apakah modal sedang terbuka.
 * @param {function} props.onClose - Fungsi untuk menutup modal (misalnya, saat klik "Batal").
 * @param {function} props.onConfirm - Fungsi yang akan dijalankan saat klik "Hapus".
 */
function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-2">Konfirmasi Hapus</h2>
        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus tugas ini secara permanen?</p>
        <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
        Batal
        </button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700">
        Hapus
        </button>
        </div>
        </div>
        </div>
    );
}

export default ConfirmDeleteModal;
