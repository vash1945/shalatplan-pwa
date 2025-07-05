import React, { useState } from 'react';
// Mengimpor definisi kuadran untuk menampilkan tab dan deskripsi secara dinamis.
import { QUADRANT_DEFINITIONS } from '../utils/constants.js';

/**
 * Komponen untuk menampilkan halaman manajemen tugas.
 * @param {object} props - Properti komponen.
 * @param {Array} props.tasks - Daftar semua tugas dari state utama.
 * @param {function} props.onCompleteTask - Fungsi untuk menandai tugas sebagai selesai.
 */
// Nama fungsi komponen adalah TasksScreen
function TasksScreen({ tasks, onCompleteTask }) {
    // State untuk melacak tab kuadran mana yang sedang aktif.
    const [activeTab, setActiveTab] = useState(1);
    // Menyaring daftar tugas untuk hanya menampilkan yang statusnya 'pending'.
    const pendingTasks = tasks.filter(t => t.status === 'pending');

    return (
        <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-4">Manajemen Tugas</h1>

        {/* Navigasi Tab Kuadran */}
        <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {Object.keys(QUADRANT_DEFINITIONS).map(q => (
            <button
            key={q}
            onClick={() => setActiveTab(parseInt(q))}
            // Memberikan style aktif berdasarkan perbandingan ketat (===)
            className={`flex-shrink-0 py-2 px-4 text-sm font-medium transition-colors ${activeTab === Number(q) ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
            Kuadran {q}
            </button>
        ))}
        </div>

        {/* Deskripsi Kuadran Aktif */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <h3 className={`font-bold text-lg ${QUADRANT_DEFINITIONS[activeTab].color.replace('bg','text')}-600`}>{QUADRANT_DEFINITIONS[activeTab].title}</h3>
        <p className="text-sm text-gray-600">{QUADRANT_DEFINITIONS[activeTab].desc}</p>
        </div>

        {/* Daftar Tugas */}
        <div className="space-y-3">
        {/* Memeriksa apakah ada tugas di kuadran aktif */}
        {pendingTasks.filter(t => t.quadrant === activeTab).length > 0 ? (
            // Jika ada, tampilkan daftar tugas
            pendingTasks
            .filter(t => t.quadrant === activeTab)
            .sort((a, b) => a.creationDate - b.creationDate) // Urutkan dari yang paling lama
            .map(task => (
                <div key={task.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm animate-fade-in">
                <button onClick={() => onCompleteTask(task.id, task.quadrant)} className="mr-3 p-1" aria-label={`Selesaikan tugas: ${task.description}`}>
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-teal-500 transition-all"></div>
                </button>
                <p className="flex-grow">{task.description}</p>
                </div>
            ))
        ) : (
            // Jika tidak ada tugas, tampilkan pesan
            <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Alhamdulillah, tidak ada tugas di kuadran ini.</p>
            </div>
        )}
        </div>
        </div>
    );
}

// Mengekspor komponen sebagai default
export default TasksScreen;
