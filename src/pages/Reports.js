import React from 'react';
import { StarIcon } from '../components/Icons.js';
import { ACHIEVEMENTS } from '../utils/achievements.js';
import PrayerCalendar from '../components/PrayerCalendar.js';

function ReportsScreen({ tasks, prayerLog, userData, achievements }) {
    return (
        <div className="space-y-6 animate-fade-in dark:text-dark-text">
        <h1 className="text-2xl font-bold">Laporan & Statistik</h1>

        {/* FIX: Lencana Pencapaian dipindahkan ke atas */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Lencana Pencapaian</h2>
        {achievements && achievements.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {achievements.map(achId => {
                const achievement = ACHIEVEMENTS[achId];
                if (!achievement) return null;
                return (
                    <div key={achievement.id} className="flex flex-col items-center text-center p-4 bg-gray-100 dark:bg-dark-bg rounded-lg">
                    <div className="text-yellow-500 mb-2">{achievement.icon({ width: 32, height: 32 })}</div>
                    <h3 className="font-bold text-sm">{achievement.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-dark-text-secondary">{achievement.description}</p>
                    </div>
                );
            })}
            </div>
        ) : (
            <p className="text-gray-500 dark:text-dark-text-secondary text-center">Teruslah berusaha untuk mendapatkan lencana pertamamu!</p>
        )}
        </div>

        {/* FIX: Kalender Konsistensi dipindahkan ke bawah */}
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Kalender Konsistensi Shalat</h2>
        <PrayerCalendar prayerLog={prayerLog} />
        </div>
        </div>
    );
}

export default ReportsScreen;
