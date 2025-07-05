import React from 'react';

function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-500"></div>
        <p className="mt-4 text-lg text-gray-600">Memuat Aplikasi...</p>
        </div>
    );
}

export default LoadingScreen;
