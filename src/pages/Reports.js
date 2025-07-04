import React from 'react';
import { QUADRANT_DEFINITIONS } from '../utils/constants';
import { StarIcon } from '../components/Icons';

function ReportsScreen({ tasks, prayerLog, userData }) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    const quadrantCounts = tasks.reduce((acc, task) => {
        acc[task.quadrant] = (acc[task.quadrant] || 0) + 1;
        return acc;
    }, {});

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const recentPrayerLogs = prayerLog.filter(log => log.log_timestamp >= sevenDaysAgo.getTime());
    const prayersDone = recentPrayerLogs.filter(l => l.status === 'dilaksanakan').length;
    const uniqueDays = [...new Set(recentPrayerLogs.map(l => l.date))].length;
    const possiblePrayers = uniqueDays * 5;
    const prayerConsistency = possiblePrayers > 0 ? ((prayersDone / possiblePrayers) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Laporan Produktivitas</h1>
        <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center"><StarIcon className="mr-2 text-yellow-500"/> Poin & Pencapaian</h2>
        <p className="text-4xl font-bold text-teal-600">{userData?.points || 0} <span className="text-xl font-medium text-gray-500">Poin</span></p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Analisis Tugas</h2>
        <div className="flex justify-around text-center">
        <div><p className="text-3xl font-bold">{totalTasks}</p><p className="text-gray-500">Total Tugas</p></div>
        <div><p className="text-3xl font-bold text-green-600">{completedTasks}</p><p className="text-gray-500">Selesai</p></div>
        <div><p className="text-3xl font-bold text-blue-600">{completionRate}%</p><p className="text-gray-500">Penyelesaian</p></div>
        </div>
        <h3 className="font-semibold mt-6 mb-2">Distribusi Tugas per Kuadran</h3>
        <div className="space-y-2">
        {Object.entries(QUADRANT_DEFINITIONS).map(([q, {title, color}]) => {
            const count = quadrantCounts[q] || 0;
            const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
            return (
                <div key={q}>
                <div className="flex justify-between text-sm font-medium mb-1">
                <span>Kuadran {q}</span>
                <span>{count} Tugas</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                </div>
                </div>
            )
        })}
        </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Analisis Shalat (7 Hari Terakhir)</h2>
        <div className="flex justify-around text-center">
        <div><p className="text-3xl font-bold text-green-600">{prayersDone}</p><p className="text-gray-500">Dilaksanakan</p></div>
        <div><p className="text-3xl font-bold text-blue-600">{prayerConsistency}%</p><p className="text-gray-500">Konsistensi</p></div>
        </div>
        </div>
        </div>
    );
}

export default ReportsScreen;
