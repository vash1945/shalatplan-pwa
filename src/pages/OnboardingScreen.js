import React, { useState } from 'react';
import { signInWithGoogle } from '../services/auth.js';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

function OnboardingScreen({ onSetCity, user }) {
    const [city, setCity] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city) {
            onSetCity(city);
        }
    };

    // Tampilan 1: Pengguna belum login
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
            <h1 className="text-3xl font-bold text-teal-600 mb-2">Selamat Datang di ShalatPlan</h1>
            <p className="text-gray-600 mb-8">Asisten produktivitas dan ibadah harian Anda.</p>
            <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center justify-center w-full max-w-xs bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
            <GoogleIcon />
            {isLoading ? 'Memproses...' : 'Masuk dengan Google'}
            </button>
            </div>
        );
    }

    // Tampilan 2: Pengguna sudah login, lanjutkan ke input kota
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
        <h1 className="text-2xl font-bold text-teal-600 mb-2">Satu Langkah Lagi, {user.displayName}!</h1>
        <p className="text-gray-600 mb-8">Kami perlu tahu lokasimu untuk jadwal shalat yang akurat.</p>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <label htmlFor="city-input" className="block text-lg font-medium mb-2">Masukkan kota Anda</label>
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
