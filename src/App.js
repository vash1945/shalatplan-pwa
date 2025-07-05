import React, { useState, useEffect } from 'react';
// FIX: Menghapus 'child' dari impor karena tidak digunakan.
import { ref, onValue, set, update, get } from "firebase/database";

// Mengimpor semua layanan dan utilitas dari file terpisah
import { db } from './services/firebase.js'; // Menggunakan db dari Realtime DB
import { onAuthChange } from './services/auth.js';
import { fetchPrayerTimes } from './services/prayerTimesAPI.js';
import { POINTS_PER_QUADRANT } from './utils/constants.js';

// Mengimpor semua halaman (layar)
import LoadingScreen from './pages/LoadingScreen.js';
import OnboardingScreen from './pages/OnboardingScreen.js';
import DashboardScreen from './pages/Dashboard.js';
import TasksScreen from './pages/Tasks.js';
import ReportsScreen from './pages/Reports.js';
import SettingsScreen from './pages/Settings.js';
import ErrorScreen from './pages/ErrorScreen.js';

// Mengimpor semua komponen
import BottomNav from './components/BottomNav.js';
import AddTaskModal from './components/AddTaskModal.js';
import { PlusIcon } from './components/Icons.js';

function App() {
    // State utama aplikasi
    const [screen, setScreen] = useState('loading');
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [prayerLog, setPrayerLog] = useState([]);
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Effect untuk memantau status autentikasi
    useEffect(() => {
        const unsubscribe = onAuthChange((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUserId(currentUser.uid);
            } else {
                setUser(null);
                setUserId(null);
                setUserData(null);
                setScreen('onboarding');
            }
        });
        return () => unsubscribe();
    }, []);

    // Effect untuk memuat data pengguna dari Realtime Database
    useEffect(() => {
        if (!userId) return;

        const userProfileRef = ref(db, `users/${userId}/profile`);
        const unsubscribeProfile = onValue(userProfileRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUserData(data);
                if (!data.city) {
                    setScreen('onboarding');
                } else {
                    setScreen('dashboard');
                }
            } else {
                setScreen('onboarding');
            }
        }, (err) => {
            console.error("Error fetching user data:", err);
            setError("Gagal memuat data pengguna. Pastikan aturan keamanan Realtime DB Anda benar.");
            setScreen('error');
        });

        const tasksRef = ref(db, `users/${userId}/tasks`);
        const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
            const tasksData = snapshot.val() || {};
            const tasksList = Object.keys(tasksData).map(key => ({ id: key, ...tasksData[key] }));
            setTasks(tasksList);
        });

        const prayerLogRef = ref(db, `users/${userId}/prayer_log`);
        const unsubscribePrayerLog = onValue(prayerLogRef, (snapshot) => {
            const logData = snapshot.val() || {};
            const logList = Object.keys(logData).map(key => ({ id: key, ...logData[key] }));
            setPrayerLog(logList);
        });

        return () => {
            unsubscribeProfile();
            unsubscribeTasks();
            unsubscribePrayerLog();
        };
    }, [userId]);

    // Effect untuk memuat jadwal shalat saat kota berubah
    useEffect(() => {
        if (userData?.city) {
            fetchPrayerTimes(userData.city).then(setPrayerTimes).catch(err => {
                setError(`Gagal mengambil jadwal shalat untuk ${userData.city}.`);
                setPrayerTimes(null);
            });
        }
    }, [userData?.city]);

    // Kumpulan fungsi handler untuk interaksi pengguna
    const handleSetCity = async (city) => {
        if (!userId || !city) return;
        const userProfileRef = ref(db, `users/${userId}/profile`);
        try {
            await update(userProfileRef, { city: city.trim() });
        } catch (err) {
            console.error("Gagal menyimpan kota:", err);
            setError("Gagal menyimpan kota.");
        }
    };

    const handleAddTask = async (task) => {
        if (!userId) return;
        const taskId = Date.now(); // Simple unique ID
        const newTaskRef = ref(db, `users/${userId}/tasks/${taskId}`);
        try {
            await set(newTaskRef, { ...task, status: 'pending', creationDate: Date.now() });
            setIsModalOpen(false);
        } catch (err) {
            console.error("Gagal menambah tugas:", err);
            setError("Gagal menyimpan tugas baru.");
        }
    };

    const handleCompleteTask = async (taskId, quadrant) => {
        if (!userId) return;
        const userProfileRef = ref(db, `users/${userId}/profile`);
        try {
            const pointsToAdd = POINTS_PER_QUADRANT[quadrant] || 0;
            const userSnapshot = await get(userProfileRef);
            const currentPoints = userSnapshot.val()?.points || 0;

            const updates = {};
            updates[`users/${userId}/tasks/${taskId}/status`] = 'completed';
            updates[`users/${userId}/tasks/${taskId}/completionDate`] = Date.now();
            updates[`users/${userId}/profile/points`] = currentPoints + pointsToAdd;

            await update(ref(db), updates);
        } catch (err) {
            console.error("Gagal menyelesaikan tugas:", err);
            setError("Gagal memperbarui status tugas.");
        }
    };

    const handleLogPrayer = async (prayerName, status) => {
        if (!userId) return;
        const today = new Date().toISOString().split('T')[0];
        const logId = `${today}_${prayerName}`;
        const logRef = ref(db, `users/${userId}/prayer_log/${logId}`);
        const userProfileRef = ref(db, `users/${userId}/profile`);
        try {
            const logSnapshot = await get(logRef);
            const logExists = logSnapshot.exists();

            await set(logRef, { prayer_name: prayerName, status: status, log_timestamp: Date.now(), date: today });

            if (!logExists && status === 'dilaksanakan') {
                const userSnapshot = await get(userProfileRef);
                const currentPoints = userSnapshot.val()?.points || 0;
                await update(userProfileRef, { points: currentPoints + 15 });
            }
        } catch (err) {
            console.error("Gagal mencatat shalat:", err);
            setError("Gagal menyimpan data shalat.");
        }
    };

    // Fungsi untuk merender halaman yang sesuai berdasarkan state 'screen'
    const renderScreen = () => {
        const todayLog = prayerLog.filter(log => log.date === new Date().toISOString().split('T')[0]);
        switch (screen) {
            case 'loading': return <LoadingScreen />;
            case 'onboarding': return <OnboardingScreen onSetCity={handleSetCity} user={user} />;
            case 'dashboard': return <DashboardScreen prayerTimes={prayerTimes} userData={userData} tasks={tasks} prayerLog={todayLog} onLogPrayer={handleLogPrayer} error={error} />;
            case 'tasks': return <TasksScreen tasks={tasks} onCompleteTask={handleCompleteTask} />;
            case 'reports': return <ReportsScreen tasks={tasks} prayerLog={prayerLog} userData={userData} />;
            case 'settings': return <SettingsScreen userData={userData} onSetCity={handleSetCity} userId={userId} />;
            case 'error': return <ErrorScreen message={error} />;
            default: return <LoadingScreen />;
        }
    };

    // Render utama komponen App
    return (
        <div className="bg-gray-100 min-h-screen font-sans text-gray-800 flex flex-col">
        <main className="flex-grow p-4 pb-24">{renderScreen()}</main>
        {screen !== 'loading' && screen !== 'onboarding' && screen !== 'error' && (
            <>
            <BottomNav activeScreen={screen} setScreen={setScreen} />
            <button onClick={() => setIsModalOpen(true)} className="fixed bottom-20 right-5 bg-teal-500 text-white rounded-full p-4 shadow-lg hover:bg-teal-600 transition-transform transform hover:scale-110 z-40" aria-label="Tambah Tugas Baru">
            <PlusIcon />
            </button>
            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} />
            </>
        )}
        </div>
    );
}

export default App;
