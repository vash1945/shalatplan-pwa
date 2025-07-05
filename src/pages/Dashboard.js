import React, { useState, useEffect } from 'react';
import { PRAYER_NAMES } from '../utils/constants.js';
import { getTodayDate } from '../utils/helpers.js';
import { CheckCircleIcon, XCircleIcon } from '../components/Icons.js';

function DashboardScreen({ prayerTimes, userData, tasks, prayerLog, onLogPrayer, error }) {
    const [nextPrayer, setNextPrayer] = useState({ name: '', time: '', countdown: '' });

    useEffect(() => {
        if (!prayerTimes) return;
        const getNextPrayer = () => {
            const now = new Date();
            const nowTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const sortedPrayers = Object.entries(prayerTimes).filter(([name]) => Object.keys(PRAYER_NAMES).includes(name)).map(([name, time]) => ({ name: PRAYER_NAMES[name], time })).sort((a, b) => a.time.localeCompare(b.time));
            let next = sortedPrayers.find(p => p.time > nowTime);
            let isTomorrow = false;
            if (!next) { next = sortedPrayers[0]; isTomorrow = true; }
            if (!next) return;
            const [h, m] = next.time.split(':');
            const prayerDate = new Date();
            prayerDate.setHours(h, m, 0, 0);
            if (isTomorrow) { prayerDate.setDate(prayerDate.getDate() + 1); }
            const diff = prayerDate.getTime() - now.getTime();
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            setNextPrayer({ name: next.name, time: next.time, countdown: `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}` });
        };
        getNextPrayer();
        const interval = setInterval(getNextPrayer, 60000);
        return () => clearInterval(interval);
    }, [prayerTimes]);

    const tasksCompletedToday = tasks.filter(t => t.status === 'completed' && new Date(t.completionDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length;

    return (
        <div className="space-y-6 animate-fade-in">
        <div>
        <h1 className="text-2xl font-bold">Assalamu'alaikum, {userData?.first_name || 'Pengguna'}!</h1>
        <p className="text-gray-500">{getTodayDate()}</p>
        </div>
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-2xl shadow-lg">
        <p className="text-lg">Waktu Shalat Berikutnya</p>
        <h2 className="text-4xl font-bold">{nextPrayer.name}</h2>
        <div className="flex justify-between items-end mt-2">
        <p className="text-2xl">{nextPrayer.time}</p>
        <p className="text-lg">dalam {nextPrayer.countdown}</p>
        </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow"><h3 className="font-bold text-gray-700">Tugas Selesai Hari Ini</h3><p className="text-3xl font-bold text-teal-600">{tasksCompletedToday}</p></div>
        <div className="bg-white p-4 rounded-xl shadow"><h3 className="font-bold text-gray-700">Poin Anda</h3><p className="text-3xl font-bold text-teal-600">{userData?.points || 0}</p></div>
        </div>
        <div>
        <h3 className="text-xl font-bold mb-3">Jadwal Shalat Hari Ini ({userData?.city})</h3>
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
        {prayerTimes ? Object.entries(prayerTimes).filter(([name]) => Object.keys(PRAYER_NAMES).includes(name)).map(([apiName, time]) => {
            const displayName = PRAYER_NAMES[apiName];
            const log = prayerLog.find(l => l.prayer_name === displayName);
            return (
                <div key={apiName} className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-gray-50">
                <div><p className="font-semibold">{displayName}</p><p className="text-gray-500">{time}</p></div>
                {log ? (<div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${log.status === 'dilaksanakan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.status === 'dilaksanakan' ? <CheckCircleIcon /> : <XCircleIcon />}<span>{log.status === 'dilaksanakan' ? 'Sudah' : 'Terlewat'}</span></div>) : (<div className="flex gap-2"><button onClick={() => onLogPrayer(displayName, 'dilaksanakan')} className="bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600"><CheckCircleIcon /></button><button onClick={() => onLogPrayer(displayName, 'terlewat')} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"><XCircleIcon /></button></div>)}
                </div>
            )
        }) : <p className="text-gray-500">Memuat jadwal shalat...</p>}
        </div>
        </div>
        </div>
    );
}

export default DashboardScreen;
