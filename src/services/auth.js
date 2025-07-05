import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';

const provider = new GoogleAuthProvider();

/**
 * Menangani proses sign-in dengan Google.
 * Jika pengguna baru, data mereka akan dibuat di Firestore.
 */
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const appId = process.env.REACT_APP_FIREBASE_APP_ID || 'shalat-plan-app';
        const userDocRef = doc(db, `/artifacts/${appId}/users/${user.uid}/profile`, 'data');
        const docSnap = await getDoc(userDocRef);

        // Jika pengguna baru, buat dokumen profil untuk mereka.
        if (!docSnap.exists()) {
            await setDoc(userDocRef, {
                first_name: user.displayName || "Pengguna Baru",
                email: user.email,
                points: 0,
                city: null, // Kota akan diatur saat onboarding
                createdAt: new Date().toISOString(),
                         // FIX: Menghapus bidang 'isVerified'
            });
        }

        return user;
    } catch (error) {
        console.error("Gagal melakukan autentikasi dengan Google:", error);
        throw new Error("Gagal login dengan Google.");
    }
};

/**
 * Menangani proses sign-out.
 */
export const handleSignOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Gagal melakukan sign out:", error);
    }
};

/**
 * Membuat listener untuk memantau perubahan status autentikasi pengguna.
 */
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};
