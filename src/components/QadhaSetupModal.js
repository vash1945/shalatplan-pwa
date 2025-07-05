import React, { useState } from 'react';

const PRAYER_INPUTS = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];

function QadhaSetupModal({ isOpen, onClose, onSave }) {
    // State untuk menyimpan nilai dari setiap input
    const [counts, setCounts] = useState({
        Subuh: 0, Dzuhur: 0, Ashar: 0, Maghrib: 0, Isya: 0
    });

    const handleInputChange = (prayer, value) => {
        const newCounts = { ...counts, [prayer]: Number(value) };
        setCounts(newCounts);
    };

    const handleSave = () => {
        onSave(counts);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-2">Atur Hutang Shalat Qadha'</h2>
        <p className="text-gray-600 mb-6">Masukkan jumlah shalat yang terlewat untuk setiap waktu. Anda bisa mengisinya dengan 0 jika tidak ada.</p>
        <div className="space-y-4">
        {PRAYER_INPUTS.map(prayer => (
            <div key={prayer} className="flex items-center justify-between">
            <label htmlFor={`qadha-${prayer}`} className="text-lg font-medium text-gray-700">{prayer}</label>
            <input
            type="number"
            id={`qadha-${prayer}`}
            value={counts[prayer]}
            onChange={(e) => handleInputChange(prayer, e.target.value)}
            min="0"
            className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500"
            />
            </div>
        ))}
        </div>
        <div className="flex justify-end gap-3 mt-8">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
        <button onClick={handleSave} className="px-4 py-2 bg-teal-500 text-white font-bold rounded-md hover:bg-teal-600">Simpan</button>
        </div>
        </div>
        </div>
    );
}

export default QadhaSetupModal;
