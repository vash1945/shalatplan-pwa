import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css';
import App from './App.js';
// FIX: Menambahkan ekstensi .js untuk memastikan file ditemukan.
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
    <App />
    </React.StrictMode>
);

// Jika Anda ingin PWA Anda bekerja offline dan memuat lebih cepat,
// ubah unregister() menjadi register() di bawah ini.
serviceWorkerRegistration.register();
