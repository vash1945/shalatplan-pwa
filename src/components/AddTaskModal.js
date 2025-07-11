import React, { useState } from 'react';
import { QUADRANT_DEFINITIONS } from '../utils/constants.js';

function AddTaskModal({ isOpen, onClose, onAddTask }) {
    const [description, setDescription] = useState('');
    const [quadrant, setQuadrant] = useState(1);
    const [shouldSchedule, setShouldSchedule] = useState(false);
    const [scheduledAt, setScheduledAt] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (description.trim()) {
            const taskData = {
                description,
                quadrant: parseInt(quadrant),
                isScheduled: shouldSchedule,
                scheduledAt: shouldSchedule ? new Date(scheduledAt).toISOString() : null
            };
            onAddTask(taskData);
            // Reset form
            setDescription('');
            setQuadrant(1);
            setShouldSchedule(false);
            setScheduledAt('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Tambah Tugas Baru</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tugas</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500" placeholder="Apa yang perlu Anda kerjakan?" required></textarea>
        </div>
        <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Kuadran</label>
        <div className="grid grid-cols-2 gap-2">
        {Object.entries(QUADRANT_DEFINITIONS).map(([q, { title, color }]) => (
            <button type="button" key={q} onClick={() => setQuadrant(q)} className={`p-3 rounded-lg text-left transition-all ${String(quadrant) === q ? `${color} text-white shadow-md scale-105` : 'bg-gray-100 hover:bg-gray-200'}`}>
            <p className="font-bold">Kuadran {q}</p>
            <p className={`text-xs ${String(quadrant) === q ? 'text-white/80' : 'text-gray-500'}`}>{title}</p>
            </button>
        ))}
        </div>
        </div>

        {/* Opsi Penjadwalan Notifikasi */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center">
        <input
        id="schedule-checkbox"
        type="checkbox"
        checked={shouldSchedule}
        onChange={(e) => setShouldSchedule(e.target.checked)}
        className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
        />
        <label htmlFor="schedule-checkbox" className="ml-3 block text-sm font-medium text-gray-700">
        Jadwalkan notifikasi untuk tugas ini?
        </label>
        </div>
        {shouldSchedule && (
            <div className="mt-4">
            <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-700">Waktu Notifikasi</label>
            <input
            type="datetime-local"
            id="schedule-time"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 sm:text-sm"
            required
            />
            </div>
        )}
        </div>

        <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
        <button type="submit" className="px-4 py-2 bg-teal-500 text-white font-bold rounded-md hover:bg-teal-600">Simpan Tugas</button>
        </div>
        </form>
        </div>
        </div>
    );
}

export default AddTaskModal;
