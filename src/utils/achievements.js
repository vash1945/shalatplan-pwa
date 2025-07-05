// Di file ini, kita mendefinisikan semua lencana yang bisa didapatkan pengguna.

// Impor ikon yang akan digunakan untuk setiap lencana
import { StarIcon, CheckCircleIcon, ListIcon, CalendarIcon, SunriseIcon, TargetIcon, TrophyIcon, RocketIcon } from '../components/Icons.js';

export const ACHIEVEMENTS = {
    FIRST_STEP: {
        id: 'FIRST_STEP',
        title: 'Langkah Pertama',
        description: 'Selesaikan tugas pertamamu.',
        icon: (props) => <StarIcon {...props} />,
        check: (data) => data.tasks.some(task => task.status === 'completed')
    },
    PLANNER: {
        id: 'PLANNER',
        title: 'Perencana Andal',
        description: 'Selesaikan 10 tugas dari kuadran "Penting, Tak Mendesak".',
        icon: (props) => <ListIcon {...props} />,
        check: (data) => data.tasks.filter(task => task.status === 'completed' && task.quadrant === 2).length >= 10
    },
    TASK_MASTER: {
        id: 'TASK_MASTER',
        title: 'Master Tugas',
        description: 'Selesaikan total 50 tugas.',
        icon: (props) => <CheckCircleIcon {...props} />,
        check: (data) => data.tasks.filter(task => task.status === 'completed').length >= 50
    },
    ISTIQOMAH_7_DAYS: {
        id: 'ISTIQOMAH_7_DAYS',
        title: 'Istiqomah Seminggu',
        description: 'Catat semua 5 shalat wajib selama 7 hari berturut-turut.',
        icon: (props) => <CalendarIcon {...props} />,
        check: (data) => {
            if (data.prayerLog.length < 35) return false;
            const today = new Date();
            for (let i = 0; i < 7; i++) {
                const dateToCheck = new Date();
                dateToCheck.setDate(today.getDate() - i);
                const dateString = dateToCheck.toISOString().split('T')[0];
                const prayersOnDate = data.prayerLog.filter(log => log.date === dateString && log.status === 'dilaksanakan');
                if (prayersOnDate.length < 5) return false;
            }
            return true;
        }
    },
    // --- Lencana Baru ---
    DAWN_WARRIOR: {
        id: 'DAWN_WARRIOR',
        title: 'Pejuang Subuh',
        description: 'Catat shalat Subuh selama 5 hari berturut-turut.',
        icon: (props) => <SunriseIcon {...props} />,
        check: (data) => {
            if (data.prayerLog.length < 5) return false;
            const today = new Date();
            for (let i = 0; i < 5; i++) {
                const dateToCheck = new Date();
                dateToCheck.setDate(today.getDate() - i);
                const dateString = dateToCheck.toISOString().split('T')[0];
                const fajrDone = data.prayerLog.some(log => log.date === dateString && log.prayer_name === 'Subuh' && log.status === 'dilaksanakan');
                if (!fajrDone) return false;
            }
            return true;
        }
    },
    DEEP_WORK: {
        id: 'DEEP_WORK',
        title: 'Fokus Penuh',
        description: 'Selesaikan 5 tugas dari kuadran 1 dalam sehari.',
        icon: (props) => <TargetIcon {...props} />,
        check: (data) => {
            const todayString = new Date().toISOString().split('T')[0];
            const completedToday = data.tasks.filter(task => {
                if (task.status !== 'completed' || !task.completionDate) return false;
                const completionDate = new Date(task.completionDate).toISOString().split('T')[0];
                return completionDate === todayString && task.quadrant === 1;
            });
            return completedToday.length >= 5;
        }
    },
    POINT_COLLECTOR: {
        id: 'POINT_COLLECTOR',
        title: 'Kolektor Poin',
        description: 'Raih total 1000 poin.',
        icon: (props) => <TrophyIcon {...props} />,
        check: (data) => data.userData?.points >= 1000
    },
    GETTING_STARTED: {
        id: 'GETTING_STARTED',
        title: 'Momentum Awal',
        description: 'Gunakan aplikasi selama 3 hari berturut-turut.',
        icon: (props) => <RocketIcon {...props} />,
        check: (data) => {
            if (!data.userData?.createdAt) return false;
            const createdDate = new Date(data.userData.createdAt);
            const today = new Date();
            const diffTime = Math.abs(today - createdDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays >= 3;
        }
    }
};
