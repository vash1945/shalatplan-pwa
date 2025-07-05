import React, { useState, useEffect } from 'react';

/**
 * Komponen untuk menampilkan grafik tren perolehan poin.
 * FIX: Komponen ini sekarang menunggu pustaka Recharts dimuat sebelum merender grafik.
 */
function PointsChart({ tasks, prayerLog }) {
    // State untuk melacak apakah pustaka Recharts sudah siap.
    const [isLibLoaded, setIsLibLoaded] = useState(Boolean(window.Recharts));

    useEffect(() => {
        // Jika pustaka belum dimuat, periksa secara berkala.
        if (!isLibLoaded) {
            const interval = setInterval(() => {
                if (window.Recharts) {
                    setIsLibLoaded(true);
                    clearInterval(interval);
                }
            }, 100); // Periksa setiap 100 milidetik
            return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
        }
    }, [isLibLoaded]);

    // Tampilkan pesan loading jika pustaka belum siap.
    if (!isLibLoaded) {
        return (
            <div style={{ width: '100%', height: 250 }} className="flex items-center justify-center bg-gray-100 dark:bg-dark-card rounded-lg">
            <p className="text-gray-500 dark:text-dark-text-secondary">Memuat grafik...</p>
            </div>
        );
    }

    // Setelah pustaka siap, kita bisa menggunakannya dengan aman.
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = window.Recharts;

    const processData = () => {
        const dataByDate = {};

        // Inisialisasi 7 hari terakhir
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
            dataByDate[dateString] = { name: dateString, poin: 0 };
        }

        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Proses poin dari tugas
        tasks.forEach(task => {
            if (task.status === 'completed' && task.completionDate >= sevenDaysAgo.getTime()) {
                const date = new Date(task.completionDate);
                const dateString = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
                if (dataByDate[dateString]) {
                    dataByDate[dateString].poin += 10; // Asumsi 10 poin per tugas
                }
            }
        });

        // Proses poin dari shalat
        prayerLog.forEach(log => {
            if (log.log_timestamp >= sevenDaysAgo.getTime() && log.status === 'dilaksanakan') {
                const date = new Date(log.log_timestamp);
                const dateString = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
                if (dataByDate[dateString]) {
                    dataByDate[dateString].poin += 15; // Asumsi 15 poin per shalat
                }
            }
        });

        return Object.values(dataByDate);
    };

    const chartData = processData();

    return (
        <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
        <XAxis dataKey="name" stroke="gray" />
        <YAxis stroke="gray" />
        <Tooltip
        contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            borderColor: 'rgba(128, 128, 128, 0.5)',
            color: 'white',
            borderRadius: '0.5rem'
        }}
        />
        <Line type="monotone" dataKey="poin" stroke="#14b8a6" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
        </ResponsiveContainer>
        </div>
    );
}

export default PointsChart;
