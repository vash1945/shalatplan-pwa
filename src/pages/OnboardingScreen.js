import React, { useState } from 'react';

function OnboardingScreen({ onSetCity }) {
    const [city, setCity] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city) {
            onSetCity(city);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
        <h1 className="text-3xl font-bold text-teal-600 mb-2">Selamat Datang di ShalatPlan</h1>
        <p className="text-gray-600 mb-8">Asisten produktivitas dan ibadah harian Anda.</p>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <label htmlFor="city-input" className="block text-lg font-medium mb-2">Masukkan kota Anda</label>
        <p className="text-sm text-gray-500 mb-4">Ini digunakan untuk menampilkan jadwal shalat yang akurat.</p>
        <input
        id="city-input"
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Contoh: Jakarta"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button type="submit" className="w-full mt-6 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition duration-300 shadow-md">
        Simpan & Mulai
        </button>
        </form>
        </div>
    );
}

export default OnboardingScreen;
