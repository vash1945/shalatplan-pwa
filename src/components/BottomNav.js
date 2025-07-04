import React from 'react';
import { HomeIcon, ListIcon, BarChartIcon, SettingsIcon } from './Icons';

function BottomNav({ activeScreen, setScreen }) {
    const navItems = [
        { name: 'dashboard', icon: <HomeIcon />, label: 'Beranda' },
        { name: 'tasks', icon: <ListIcon />, label: 'Tugas' },
        { name: 'reports', icon: <BarChartIcon />, label: 'Laporan' },
        { name: 'settings', icon: <SettingsIcon />, label: 'Pengaturan' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around max-w-lg mx-auto">
        {navItems.map(item => (
            <button
            key={item.name}
            onClick={() => setScreen(item.name)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${activeScreen === item.name ? 'text-teal-500' : 'text-gray-400 hover:text-teal-400'}`}
            >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
            </button>
        ))}
        </div>
        </div>
    );
}

export default BottomNav;
