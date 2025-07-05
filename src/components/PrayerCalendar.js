import React from 'react';

/**
 * Komponen untuk menampilkan kalender heatmap konsistensi shalat.
 */
function PrayerCalendar({ prayerLog }) {
    const processCalendarData = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const dates = [];
        // Tambahkan sel kosong untuk hari sebelum tanggal 1
        for (let i = 0; i < firstDay.getDay(); i++) {
            dates.push({ key: `empty-${i}`, type: 'empty' });
        }

        // Tambahkan semua tanggal dalam bulan ini
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(year, month, i);
            const dateString = date.toISOString().split('T')[0];
            const prayerCount = prayerLog.filter(log => log.date === dateString && log.status === 'dilaksanakan').length;
            dates.push({ key: dateString, type: 'day', day: i, count: prayerCount });
        }
        return dates;
    };

    const getDayColor = (count) => {
        if (count === 0) return 'bg-gray-200 dark:bg-gray-700';
        if (count <= 2) return 'bg-teal-200';
        if (count <= 4) return 'bg-teal-400';
        return 'bg-teal-600'; // 5 shalat
    };

    const calendarDays = processCalendarData();
    const monthName = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    return (
        <div>
        <h3 className="font-bold text-center mb-4">{monthName}</h3>
        <div className="grid grid-cols-7 gap-1.5">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div key={day} className="text-xs font-bold text-center text-gray-500 dark:text-dark-text-secondary">{day}</div>
        ))}
        {calendarDays.map(day => (
            day.type === 'empty' ?
            <div key={day.key} className="w-full h-8"></div> :
            <div key={day.key} title={`${day.count} shalat pada ${day.day}`} className={`w-full h-8 rounded ${getDayColor(day.count)}`}></div>
        ))}
        </div>
        </div>
    );
}

export default PrayerCalendar;
