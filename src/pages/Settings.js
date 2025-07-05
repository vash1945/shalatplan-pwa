import React, { useState } from 'react';
// FIX: Menghapus 'useEffect' karena tidak digunakan.
import { APP_COPYRIGHT, APP_ACKNOWLEDGMENTS, APP_MOTTO } from '../utils/constants.js';
import { handleSignOut } from '../services/auth.js';

function SettingsScreen({ userData, onSetCity, userId, theme, toggleTheme, notificationOffset, onSetNotificationOffset }) {
    const [city, setCity] = useState(userData?.city || '');
    const [isCopied, setIsCopied] = useState(false);

    const handleOffsetChange = (e) => {
        onSetNotificationOffset(Number(e.target.value));
    };

    const copyUserId = () => {
        navigator.clipboard.writeText(userId).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-6 animate-fade-in dark:text-dark-text">
        <h1 className="text-2xl font-bold">Pengaturan</h1>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Tampilan</h2>
        <div className="flex items-center justify-between">
        <span className="font-medium">Tema Gelap</span>
        <button onClick={toggleTheme} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${theme === 'dark' ? 'bg-teal-600' : 'bg-gray-200'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Notifikasi Shalat</h2>
        <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Waktu Pengingat</label>
        <select
        value={notificationOffset}
        onChange={handleOffsetChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-bg focus:outline-none focus:ring-teal-500"
        >
        <option value={0}>Tepat Waktu</option>
        <option value={5}>5 Menit Sebelumnya</option>
        <option value={10}>10 Menit Sebelumnya</option>
        <option value={15}>15 Menit Sebelumnya</option>
        </select>
        </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Lokasi</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSetCity(city); }}>
        <label htmlFor="city-setting" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Kota Anda</label>
        <input id="city-setting" type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-bg focus:outline-none focus:ring-teal-500" />
        <button type="submit" className="mt-4 w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-600 transition duration-300">Perbarui Kota</button>
        </form>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-2">Tentang Aplikasi</h2>
        <p className="text-center italic text-gray-600 dark:text-dark-text-secondary mb-4">"{APP_MOTTO}"</p>
        <div className="text-sm text-gray-500 dark:text-dark-text-secondary space-y-3">
        <p>{APP_COPYRIGHT}</p>
        <p>{APP_ACKNOWLEDGMENTS}</p>
        </div>
        </div>

        <div className="mt-6">
        <button onClick={handleSignOut} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300">
        Keluar (Logout)
        </button>
        </div>
        </div>
    );
}

export default SettingsScreen;
