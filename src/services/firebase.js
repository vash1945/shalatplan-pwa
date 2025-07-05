import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,

    // FIX: Mengubah databaseURL agar sesuai dengan region database Anda
    // seperti yang disarankan oleh pesan error.
    databaseURL: "https://shalatplan-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Pengecekan untuk memastikan kunci API ada di file .env
if (!firebaseConfig.apiKey) {
    throw new Error("Kunci API Firebase tidak ditemukan. Pastikan Anda sudah membuat file .env di root proyek dan mengisinya dengan benar. Jangan lupa restart server setelah membuat file .env.");
}

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
