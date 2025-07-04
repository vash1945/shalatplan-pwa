import React, { useState } from 'react';
import { QUADRANT_DEFINITIONS } from '../utils/constants';

function TasksScreen({ tasks, onCompleteTask }) {
    const [activeTab, setActiveTab] = useState(1);
    const pendingTasks = tasks.filter(t => t.status === 'pending');

    return (
        <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-4">Manajemen Tugas</h1>
        <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {Object.keys(QUADRANT_DEFINITIONS).map(q => (
            <button
            key={q}
            onClick={() => setActiveTab(parseInt(q))}
            className={`flex-shrink-0 py-2 px-4 text-sm font-medium transition-colors ${activeTab == q ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
            Kuadran {q}
            </button>
        ))}
        </div>

        <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <h3 className={`font-bold text-lg ${QUADRANT_DEFINITIONS[activeTab].color.replace('bg','text')}-600`}>{QUADRANT_DEFINITIONS[activeTab].title}</h3>
        <p className="text-sm text-gray-600">{QUADRANT_DEFINITIONS[activeTab].desc}</p>
        </div>

        <div className="space-y-3">
        {pendingTasks.filter(t => t.quadrant == activeTab).length > 0 ? (
            pendingTasks
            .filter(t => t.quadrant == activeTab)
            .sort((a, b) => a.creationDate - b.creationDate)
            .map(task => (
                <div key={task.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm animate-fade-in">
                <button onClick={() => onCompleteTask(task.id, task.quadrant)} className="mr-3 p-1">
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-teal-500 transition-all"></div>
                </button>
                <p className="flex-grow">{task.description}</p>
                </div>
            ))
        ) : (
            <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Alhamdulillah, tidak ada tugas di kuadran ini.</p>
            </div>
        )}
        </div>
        </div>
    );
}

export default TasksScreen;
