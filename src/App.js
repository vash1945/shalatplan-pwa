import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, addDoc, collection, query, writeBatch, getDoc } from 'firebase/firestore';

import { auth, db } from './services/firebase';
import { fetchPrayerTimes } from './services/prayerTimesAPI';
import { PRAYER_NAMES, POINTS_PER_QUADRANT } from './utils/constants';

// Import Pages (Screens)
import LoadingScreen from './pages/LoadingScreen';
import OnboardingScreen from './pages/OnboardingScreen';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ErrorScreen from './pages/ErrorScreen';

// Import Components
import BottomNav from './components/BottomNav';
import AddTaskModal from './components/AddTaskModal';
import { PlusIcon } from './components/Icons';

function App() {
    const [screen, setScreen] = useState('loading');
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [prayerLog, setPrayerLog] = useState([]);
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const appId = process.env.REACT_APP_FIREBASE_APP_ID || 'shalat-plan-app';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUserId(currentUser.uid);
            } else {
                try {
                    await signInAnonymously(auth);
                } catch (err) {
                    console.error("Authentication error:", err);
                    setError("Gagal melakukan autentikasi.");
                    setScreen('error');
                }
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userId) return;
        const userDocRef = doc(db, `/artifacts/${appId}/users/${userId}/profile`, 'data');
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData(data);
                setScreen(data.city ? 'dashboard' : 'onboarding');
            } else {
                setDoc(userDocRef, {
                    first_name: user?.displayName || "Pengguna Baru",
                    points: 0,
                    city: null,
                }).then(() => setScreen('onboarding'));
            }
        }, (err) => {
            console.error("Error fetching user data:", err);
            setError("Gagal memuat data pengguna.");
            setScreen('error');
        });
        return () => unsubscribe();
    }, [userId, user, appId]);

    useEffect(() => {
        if (!userId) return;
        const tasksQuery = query(collection(db, `/artifacts/${appId}/users/${userId}/tasks`));
        const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
            setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const prayerLogQuery = query(collection(db, `/artifacts/${appId}/users/${userId}/prayer_log`));
        const unsubscribePrayerLog = onSnapshot(prayerLogQuery, (snapshot) => {
            setPrayerLog(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => {
            unsubscribeTasks();
            unsubscribePrayerLog();
        };
    }, [userId, appId]);

    useEffect(() => {
        if (userData?.city) {
            fetchPrayerTimes(userData.city)
            .then(setPrayerTimes)
            .catch(err => {
                setError(`Gagal mengambil jadwal shalat untuk ${userData.city}.`);
                setPrayerTimes(null);
            });
        }
    }, [userData?.city]);

    const handleSetCity = async (city) => {
        if (!userId || !city) return;
        const userDocRef = doc(db, `/artifacts/${appId}/users/${userId}/profile`, 'data');
        await updateDoc(userDocRef, { city: city.trim() });
    };

    const handleAddTask = async (task) => {
        if (!userId) return;
        await addDoc(collection(db, `/artifacts/${appId}/users/${userId}/tasks`), {
            ...task,
            status: 'pending',
            creationDate: Date.now(),
        });
        setIsModalOpen(false);
    };

    const handleCompleteTask = async (taskId, quadrant) => {
        if (!userId) return;
        const taskDocRef = doc(db, `/artifacts/${appId}/users/${userId}/tasks/${taskId}`);
        const userDocRef = doc(db, `/artifacts/${appId}/users/${userId}/profile`, 'data');
        const pointsToAdd = POINTS_PER_QUADRANT[quadrant] || 0;
        const userDocSnap = await getDoc(userDocRef);
        const currentPoints = userDocSnap.data()?.points || 0;

        const batch = writeBatch(db);
        batch.update(taskDocRef, { status: 'completed', completionDate: Date.now() });
        batch.update(userDocRef, { points: currentPoints + pointsToAdd });
        await batch.commit();
    };

    const handleLogPrayer = async (prayerName, status) => {
        if (!userId) return;
        const today = new Date().toISOString().split('T')[0];
        const logId = `${today}_${prayerName}`;
        const logDocRef = doc(db, `/artifacts/${appId}/users/${userId}/prayer_log/${logId}`);
        const userDocRef = doc(db, `/artifacts/${appId}/users/${userId}/profile`, 'data');
        const logExists = (await getDoc(logDocRef)).exists();

        await setDoc(logDocRef, {
            prayer_name: prayerName,
            status: status,
            log_timestamp: Date.now(),
                     date: today,
        });

        if (!logExists && status === 'dilaksanakan') {
            const userDocSnap = await getDoc(userDocRef);
            const currentPoints = userDocSnap.data()?.points || 0;
            await updateDoc(userDocRef, { points: currentPoints + 15 });
        }
    };

    const renderScreen = () => {
        const todayLog = prayerLog.filter(log => log.date === new Date().toISOString().split('T')[0]);
        switch (screen) {
            case 'loading': return <LoadingScreen />;
            case 'onboarding': return <OnboardingScreen onSetCity={handleSetCity} />;
            case 'dashboard': return <Dashboard prayerTimes={prayerTimes} userData={userData} tasks={tasks} prayerLog={todayLog} onLogPrayer={handleLogPrayer} error={error} />;
            case 'tasks': return <Tasks tasks={tasks} onCompleteTask={handleCompleteTask} />;
            case 'reports': return <Reports tasks={tasks} prayerLog={prayerLog} userData={userData} />;
            case 'settings': return <Settings userData={userData} onSetCity={handleSetCity} userId={userId} />;
            case 'error': return <ErrorScreen message={error} />;
            default: return <LoadingScreen />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans text-gray-800 flex flex-col">
        <main className="flex-grow p-4 pb-24">
        {renderScreen()}
        </main>
        {screen !== 'loading' && screen !== 'onboarding' && screen !== 'error' && (
            <>
            <BottomNav activeScreen={screen} setScreen={setScreen} />
            <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-20 right-5 bg-teal-500 text-white rounded-full p-4 shadow-lg hover:bg-teal-600 transition-transform transform hover:scale-110 z-40"
            aria-label="Tambah Tugas Baru"
            >
            <PlusIcon />
            </button>
            <AddTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddTask={handleAddTask}
            />
            </>
        )}
        </div>
    );
}

export default App;
