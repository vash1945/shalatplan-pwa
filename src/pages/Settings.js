import React, { useState, useEffect } from 'react';
import { APP_COPYRIGHT, APP_ACKNOWLEDGMENTS, APP_MOTTO } from '../utils/constants.js';
// Impor fungsi logout dari layanan auth
import { handleSignOut } from '../services/auth.js';

function SettingsScreen({ userData, onSetCity, userId }) {
    const [city, setCity] = useState(userData?.city || '');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if(userData?.city) {
            setCity(userData.city);
        }
    }, [userData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSetCity(city);
    };

    const copyUserId = () => {
        navigator.clipboard.writeText(userId).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Pengaturan</h1>

        <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Lokasi</h2>
        <form onSubmit={handleSubmit}>
        <label htmlFor="city-setting" className="block text-sm font-medium text-gray-700 mb-1">Kota Anda</label>
        <input
        id="city-setting"
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
        />
        <button type="submit" className="mt-4 w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-600 transition duration-300">
        Perbarui Kota
        </button>
        </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-2">Informasi Akun</h2>
        <p className="text-sm text-gray-600 mb-2">User ID Anda unik untuk perangkat ini.</p>
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
        <p className="text-xs text-gray-700 truncate flex-grow">{userId || '...'}</p>
        <button onClick={copyUserId} className="bg-gray-200 text-gray-700 text-xs font-bold py-1 px-2 rounded hover:bg-gray-300" disabled={!userId}>
        {isCopied ? 'Disalin!' : 'Salin'}
        </button>
        </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-2">Tentang Aplikasi</h2>
        <p className="text-center italic text-gray-600 mb-4">"{APP_MOTTO}"</p>
        <div className="text-sm text-gray-500 space-y-3">
        <p>{APP_COPYRIGHT}</p>
        <p>{APP_ACKNOWLEDGMENTS}</p>
        </div>
        </div>

        <div className="mt-6">
        <button
        onClick={handleSignOut}
        className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
        >
        Keluar (Logout)
        </button>
        </div>
        </div>
    );
}

export default SettingsScreen;
