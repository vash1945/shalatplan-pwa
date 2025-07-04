import React from 'react';
import { XCircleIcon } from '../components/Icons';

function ErrorScreen({ message }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Oops! Terjadi Kesalahan</h2>
        <p className="text-gray-600">{message || "Sesuatu yang tidak beres terjadi. Silakan coba lagi nanti."}</p>
        </div>
    );
}

export default ErrorScreen;
