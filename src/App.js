import React, { useState, useEffect } from 'react';
import { ref, onValue, set, update, get } from "firebase/database";

// Mengimpor semua layanan dan utilitas dari file terpisah
import { db } from './services/firebase.js';
import { onAuthChange } from './services/auth.js';
import { fetchPrayerTimes } from './services/prayerTimesAPI.js';
import { POINTS_PER_QUADRANT } from './utils/constants.js';
import { fetchRandomVerse, fetchMotivationalQuote } from './services/apiService.js';
import { ACHIEVEMENTS } from './utils/achievements.js';
import { getStorageItem, setStorageItem } from './utils/storage.js';

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
import ConfirmDeleteModal from './components/ConfirmDeleteModal.js';
import QadhaSetupModal from './components/QadhaSetupModal.js';
import { PlusIcon } from './components/Icons.js';

function App() {
    // State utama aplikasi
    const [screen, setScreen] = useState('loading');
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [prayerLog, setPrayerLog] = useState([]);
    const [qadhaPrayers, setQadhaPrayers] = useState(null);
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [dailyVerse, setDailyVerse] = useState(null);
    const [quote, setQuote] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isQadhaModalOpen, setIsQadhaModalOpen] = useState(false);
    const [theme, setTheme] = useState(getStorageItem('theme') || 'light');
    const [achievements, setAchievements] = useState([]);
    const [notificationOffset, setNotificationOffset] = useState(Number(getStorageItem('notificationOffset')) || 0);

    // --- Logika Tema Gelap ---
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
        setStorageItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // --- Logika Lencana Pencapaian ---
    useEffect(() => {
        if (!userData) return;
        const dataForCheck = { tasks, prayerLog, userData };
        const earnedAchievements = Object.values(ACHIEVEMENTS).filter(ach => ach.check(dataForCheck)).map(ach => ach.id);
        setAchievements(earnedAchievements);
    }, [tasks, prayerLog, userData]);

    // --- Logika Aplikasi Inti ---
    useEffect(() => {
        fetchRandomVerse().then(setDailyVerse);
        fetchMotivationalQuote().then(setQuote);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthChange((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUserId(currentUser.uid);
            } else {
                setUser(null); setUserId(null); setUserData(null); setScreen('onboarding');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userId) return;
        const userProfileRef = ref(db, `users/${userId}/profile`);
        const unsubscribeProfile = onValue(userProfileRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUserData(data);
                if (!data.first_name || !data.city) { setScreen('onboarding'); } else { setScreen('dashboard'); }
            } else { setScreen('onboarding'); }
        });
        const tasksRef = ref(db, `users/${userId}/tasks`);
        const unsubscribeTasks = onValue(tasksRef, (snapshot) => setTasks(Object.keys(snapshot.val() || {}).map(key => ({ id: key, ...snapshot.val()[key] }))));
        const prayerLogRef = ref(db, `users/${userId}/prayer_log`);
        const unsubscribePrayerLog = onValue(prayerLogRef, (snapshot) => setPrayerLog(Object.keys(snapshot.val() || {}).map(key => ({ id: key, ...snapshot.val()[key] }))));
        const qadhaRef = ref(db, `users/${userId}/qadha_prayers`);
        const unsubscribeQadha = onValue(qadhaRef, (snapshot) => setQadhaPrayers(snapshot.val()));
        return () => { unsubscribeProfile(); unsubscribeTasks(); unsubscribePrayerLog(); unsubscribeQadha(); };
    }, [userId]);

    useEffect(() => {
        if (userData?.city) {
            fetchPrayerTimes(userData.city).then(setPrayerTimes).catch(err => setError(`Gagal mengambil jadwal shalat.`));
        }
    }, [userData?.city]);

    const handleSetName = async (name) => {
        if (!userId || !name) return;
        await update(ref(db, `users/${userId}/profile`), { first_name: name.trim() });
    };
    const handleSetCity = async (city) => {
        if (!userId || !city) return;
        await update(ref(db, `users/${userId}/profile`), { city: city.trim() });
    };
    const handleSetNotificationOffset = (offset) => {
        setNotificationOffset(offset);
        setStorageItem('notificationOffset', offset);
    };
    const handleAddTask = async (task) => {
        if (!userId) return;
        const taskId = Date.now();
        await set(ref(db, `users/${userId}/tasks/${taskId}`), { ...task, status: 'pending', creationDate: Date.now() });
        setIsModalOpen(false);
    };
    const handleCompleteTask = async (taskId, quadrant) => {
        if (!userId) return;
        const userProfileRef = ref(db, `users/${userId}/profile`);
        const userSnapshot = await get(userProfileRef);
        const currentPoints = userSnapshot.val()?.points || 0;
        const updates = {};
        updates[`users/${userId}/tasks/${taskId}/status`] = 'completed';
        updates[`users/${userId}/tasks/${taskId}/completionDate`] = Date.now();
        updates[`users/${userId}/profile/points`] = currentPoints + (POINTS_PER_QUADRANT[quadrant] || 0);
        await update(ref(db), updates);
    };
    const handleLogPrayer = async (prayerName, status) => {
        if (!userId) return;
        const today = new Date().toISOString().split('T')[0];
        const logId = `${today}_${prayerName}`;
        const logRef = ref(db, `users/${userId}/prayer_log/${logId}`);
        const userProfileRef = ref(db, `users/${userId}/profile`);
        const logSnapshot = await get(logRef);
        await set(logRef, { prayer_name: prayerName, status: status, log_timestamp: Date.now(), date: today });
        if (!logSnapshot.exists() && status === 'dilaksanakan') {
            const userSnapshot = await get(userProfileRef);
            const currentPoints = userSnapshot.val()?.points || 0;
            await update(userProfileRef, { points: currentPoints + 15 });
        }
    };
    const handleSetQadha = async (counts) => {
        if (!userId) return;
        await set(ref(db, `users/${userId}/qadha_prayers`), counts);
    };
    const handleDecrementQadha = async (prayerName) => {
        if (!userId || !qadhaPrayers || qadhaPrayers[prayerName] <= 0) return;
        const newCount = qadhaPrayers[prayerName] - 1;
        await update(ref(db, `users/${userId}/qadha_prayers`), { [prayerName]: newCount });
    };
    const openDeleteModal = (taskId) => {
        setTaskToDelete(taskId);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setTaskToDelete(null);
        setIsDeleteModalOpen(false);
    };
    const handleDeleteTask = async () => {
        if (!userId || !taskToDelete) return;
        await set(ref(db, `users/${userId}/tasks/${taskToDelete}`), null);
        closeDeleteModal();
    };

    const renderScreen = () => {
        const todayLog = prayerLog.filter(log => log.date === new Date().toISOString().split('T')[0]);
        switch (screen) {
            case 'loading': return <LoadingScreen />;
            case 'onboarding': return <OnboardingScreen onSetName={handleSetName} onSetCity={handleSetCity} user={user} userData={userData} />;
            case 'dashboard': return <DashboardScreen dailyVerse={dailyVerse} prayerTimes={prayerTimes} userData={userData} tasks={tasks} prayerLog={todayLog} onLogPrayer={handleLogPrayer} error={error} qadhaPrayers={qadhaPrayers} onDecrementQadha={handleDecrementQadha} onOpenQadhaSetup={() => setIsQadhaModalOpen(true)} />;
            case 'tasks': return <TasksScreen tasks={tasks} onCompleteTask={handleCompleteTask} onOpenDeleteModal={openDeleteModal} quote={quote} />;
            case 'reports': return <ReportsScreen tasks={tasks} prayerLog={prayerLog} userData={userData} achievements={achievements} />;
            case 'settings': return <SettingsScreen userData={userData} onSetCity={handleSetCity} userId={userId} theme={theme} toggleTheme={toggleTheme} notificationOffset={notificationOffset} onSetNotificationOffset={handleSetNotificationOffset} />;
            case 'error': return <ErrorScreen message={error} />;
            default: return <LoadingScreen />;
        }
    };

    return (
        <div className={`bg-gray-100 dark:bg-dark-bg min-h-screen font-sans text-gray-800 flex flex-col`}>
        <main className="flex-grow p-4 pb-24">{renderScreen()}</main>
        {screen !== 'loading' && screen !== 'onboarding' && screen !== 'error' && (
            <>
            <BottomNav activeScreen={screen} setScreen={setScreen} />
            <button onClick={() => setIsModalOpen(true)} className="fixed bottom-20 right-5 bg-teal-500 text-white rounded-full p-4 shadow-lg hover:bg-teal-600" aria-label="Tambah Tugas Baru">
            <PlusIcon />
            </button>
            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} />
            <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteTask} />
            <QadhaSetupModal isOpen={isQadhaModalOpen} onClose={() => setIsQadhaModalOpen(false)} onSave={handleSetQadha} />
            </>
        )}
        </div>
    );
}

export default App;
