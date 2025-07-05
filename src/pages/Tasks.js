import React, { useState } from 'react';
import { QUADRANT_DEFINITIONS } from '../utils/constants.js';
import { TrashIcon } from '../components/Icons.js';

function TasksScreen({ tasks, onCompleteTask, onOpenDeleteModal, quote }) {
    const [activeTab, setActiveTab] = useState(1);
    const pendingTasks = tasks.filter(t => t.status === 'pending');

    return (
        <div className="animate-fade-in dark:text-dark-text">
        {/* --- KARTU KUTIPAN MOTIVASI (FITUR BARU) --- */}
        {quote && (
            <div className="mb-6 p-4 bg-teal-50 dark:bg-teal-900 border-l-4 border-teal-500 rounded-r-lg">
            <p className="italic text-gray-800 dark:text-gray-200">"{quote.content}"</p>
            <p className="text-right font-semibold text-teal-700 dark:text-teal-400 mt-2">- {quote.author}</p>
            </div>
        )}

        <h1 className="text-2xl font-bold mb-4">Manajemen Tugas</h1>
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
        {Object.keys(QUADRANT_DEFINITIONS).map(q => (
            <button
            key={q}
            onClick={() => setActiveTab(parseInt(q))}
            className={`flex-shrink-0 py-2 px-4 text-sm font-medium transition-colors ${activeTab === Number(q) ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-dark-text-secondary hover:text-gray-700'}`}
            >
            Kuadran {q}
            </button>
        ))}
        </div>
        <div className="mb-4 p-4 bg-white dark:bg-dark-card rounded-lg shadow">
        <h3 className={`font-bold text-lg ${QUADRANT_DEFINITIONS[activeTab].color.replace('bg','text')}-600`}>{QUADRANT_DEFINITIONS[activeTab].title}</h3>
        <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{QUADRANT_DEFINITIONS[activeTab].desc}</p>
        </div>
        <div className="space-y-3">
        {pendingTasks.filter(t => t.quadrant === activeTab).length > 0 ? (
            pendingTasks
            .filter(t => t.quadrant === activeTab)
            .sort((a, b) => a.creationDate - b.creationDate)
            .map(task => (
                <div key={task.id} className="flex items-center bg-white dark:bg-dark-card p-3 rounded-lg shadow-sm group">
                <button onClick={() => onCompleteTask(task.id, task.quadrant)} className="mr-3 p-1" aria-label={`Selesaikan tugas: ${task.description}`}>
                <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:border-teal-500 transition-all"></div>
                </button>
                <p className="flex-grow">{task.description}</p>
                <button onClick={() => onOpenDeleteModal(task.id)} className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Hapus tugas: ${task.description}`}>
                <TrashIcon />
                </button>
                </div>
            ))
        ) : (
            <div className="text-center py-10 px-4 bg-white dark:bg-dark-card rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-dark-text-secondary">Alhamdulillah, tidak ada tugas di kuadran ini.</p>
            </div>
        )}
        </div>
        </div>
    );
}

export default TasksScreen;
