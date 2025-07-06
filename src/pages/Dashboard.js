import React, { useState, useEffect } from 'react';
import { PRAYER_NAMES } from '../utils/constants.js';
import { getTodayDate } from '../utils/helpers.js';
import { CheckCircleIcon, XCircleIcon, MinusCircleIcon, PlusCircleIcon } from '../components/Icons.js';

// Menerima prop baru: onAttemptDecrementQadha
function DashboardScreen({ prayerTimes, userData, tasks, prayerLog, onLogPrayer, error, dailyVerse, qadhaPrayers, onAttemptDecrementQadha, onIncrementQadha, onOpenQadhaSetup }) {
    const [nextPrayer, setNextPrayer] = useState({ name: '', time: '', countdown: '' });

    useEffect(() => {
        if (!prayerTimes) return;
        const getNextPrayer = () => {
            const now = new Date();
            const nowTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const sortedPrayers = Object.entries(prayerTimes)
            .filter(([apiKey, time]) => PRAYER_NAMES[apiKey] && typeof time === 'string')
            .map(([apiKey, time]) => ({ name: PRAYER_NAMES[apiKey], time }))
            .sort((a, b) => a.time.localeCompare(b.time));
            if (sortedPrayers.length === 0) return;
            let next = sortedPrayers.find(p => p.time > nowTime);
            if (!next) { next = sortedPrayers[0]; }
            if (!next) return;
            const [h, m] = next.time.split(':');
            const prayerDate = new Date();
            prayerDate.setHours(h, m, 0, 0);
            if (next.time < nowTime) { prayerDate.setDate(prayerDate.getDate() + 1); }
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
    const mainPrayers = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];

    return (
        <div className="space-y-6 animate-fade-in dark:text-dark-text">
        <div>
        <h1 className="text-2xl font-bold">Assalamu'alaikum, {userData?.first_name || 'Pengguna'}!</h1>
        <p className="text-gray-500 dark:text-dark-text-secondary">{getTodayDate()}</p>
        </div>

        {dailyVerse && (
            <div className="bg-teal-800 text-white p-6 rounded-2xl shadow-lg">
            <p className="text-2xl text-right font-mono leading-relaxed mb-4" dir="rtl">{dailyVerse.arabic}</p>
            <p className="text-gray-300 mb-2">"{dailyVerse.translation}"</p>
            <p className="text-teal-300 font-semibold text-right">(QS. {dailyVerse.surah})</p>
            </div>
        )}

        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-2xl shadow-lg">
        <p className="text-lg">Waktu Shalat Berikutnya</p>
        <h2 className="text-4xl font-bold">{nextPrayer.name}</h2>
        <div className="flex justify-between items-end mt-2">
        <p className="text-2xl">{nextPrayer.time}</p>
        <p className="text-lg">dalam {nextPrayer.countdown}</p>
        </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow"><h3 className="font-bold text-gray-700 dark:text-dark-text">Tugas Selesai Hari Ini</h3><p className="text-3xl font-bold text-teal-600">{tasksCompletedToday}</p></div>
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow"><h3 className="font-bold text-gray-700 dark:text-dark-text">Poin Anda</h3><p className="text-3xl font-bold text-teal-600">{userData?.points || 0}</p></div>
        </div>

        <div>
        <h3 className="text-xl font-bold mb-3">Jadwal Shalat Hari Ini ({userData?.city})</h3>
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow space-y-3">
        {prayerTimes ? Object.entries(prayerTimes).filter(([apiKey]) => PRAYER_NAMES[apiKey]).map(([apiKey, time]) => {
            const displayName = PRAYER_NAMES[apiKey];
            const log = prayerLog.find(l => l.prayer_name === displayName);
            return (
                <div key={apiKey} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div><p className="font-semibold">{displayName}</p><p className="text-gray-500 dark:text-dark-text-secondary">{time}</p></div>
                {mainPrayers.includes(displayName) && (
                    log ? (<div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${log.status === 'dilaksanakan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.status === 'dilaksanakan' ? <CheckCircleIcon /> : <XCircleIcon />}<span>{log.status === 'dilaksanakan' ? 'Sudah' : 'Terlewat'}</span></div>) : (<div className="flex gap-2"><button onClick={() => onLogPrayer(displayName, 'dilaksanakan')} className="bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600"><CheckCircleIcon /></button><button onClick={() => onLogPrayer(displayName, 'terlewat')} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"><XCircleIcon /></button></div>)
                )}
                </div>
            )
        }) : <p className="text-gray-500 dark:text-dark-text-secondary text-center py-4">Memuat jadwal shalat...</p>}
        </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Pelacak Shalat Qadha'</h2>
        {qadhaPrayers ? (
            <div className="space-y-3">
            {Object.entries(qadhaPrayers).map(([prayer, count]) => (
                <div key={prayer} className="flex items-center justify-between">
                <span className="font-semibold text-gray-700 dark:text-dark-text">{prayer}</span>
                <div className="flex items-center gap-3">
                <button onClick={() => onIncrementQadha(prayer)} className="text-green-500">
                <PlusCircleIcon />
                </button>
                <span className="font-bold text-xl text-teal-600 w-8 text-center">{count}</span>
                {/* FIX: Tombol minus sekarang membuka modal konfirmasi */}
                <button onClick={() => onAttemptDecrementQadha(prayer)} disabled={count === 0} className="text-red-500 disabled:text-gray-300 disabled:cursor-not-allowed">
                <MinusCircleIcon />
                </button>
                </div>
                </div>
            ))}
            <button onClick={onOpenQadhaSetup} className="text-sm text-teal-600 hover:underline pt-2">Atur Ulang Jumlah</button>
            </div>
        ) : (
            <div className="text-center">
            <p className="text-gray-500 dark:text-dark-text-secondary mb-4">Anda belum mengatur hutang shalat qadha'.</p>
            <button onClick={onOpenQadhaSetup} className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600">Atur Sekarang</button>
            </div>
        )}
        </div>
        </div>
    );
}

export default DashboardScreen;
