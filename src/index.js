import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css'; // Import Tailwind CSS
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
    <App />
    </React.StrictMode>
);

// Jika Anda ingin PWA Anda bekerja offline dan memuat lebih cepat,
// ubah unregister() menjadi register() di bawah ini.
serviceWorkerRegistration.register();
