import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const navItems = [
        {
            key: 'home',
            label: 'Home',
            icon: (
                // Modern filled grid icon for Home (same style as Feed)
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                    <rect x="3" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="14" width="7" height="7" rx="2" />
                    <rect x="3" y="14" width="7" height="7" rx="2" />
                </svg>
            ),
            path: '/',
        },
        {
            key: 'write',
            label: 'Write',
            icon: (
                // Filled square with plus for Write (same style as Feed)
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            path: null, // No route, handled by modal in App
        },
        {
            key: 'feed',
            label: 'Feed',
            icon: (
                // Modern filled grid/feed icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                    <rect x="3" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="14" width="7" height="7" rx="2" />
                    <rect x="3" y="14" width="7" height="7" rx="2" />
                </svg>
            ),
            path: '/feed',
        },
        {
            key: 'profile',
            label: 'Profile',
            icon: (
                // Modern filled user/avatar icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1z" />
                </svg>
            ),
            path: '/profile',
        },
    ];

    // Determine active tab by route
    const activeKey = (() => {
        if (location.pathname === '/profile') return 'profile';
        if (location.pathname === '/feed') return 'feed';
        return 'home';
    })();

    return (
        <nav className="fixed bottom-0 left-0 w-full z-50">
            <div className="mx-auto max-w-sm">
                <ul className="flex justify-between items-center bg-white rounded-t-xl shadow-[0_-2px_12px_0_rgba(0,0,0,0.06)] border-t border-gray-200 px-2 py-1">
                    {navItems.map((item) => (
                        <li key={item.key} className="flex-1">
                            <button
                                className={`flex flex-col items-center justify-center w-full py-2 px-1 focus:outline-none transition group ${activeKey === item.key ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}
                                style={{ minHeight: 44 }}
                                onClick={() => {
                                    if (item.path) navigate(item.path);
                                }}
                                disabled={!item.path}
                            >
                                <span className={`mb-0.5 ${activeKey === item.key ? 'scale-110' : ''}`}>{item.icon}</span>
                                <span className={`text-xs ${activeKey === item.key ? 'font-bold' : ''}`}>{item.label}</span>
                                {activeKey === item.key && (
                                    <span className="block w-5 h-1 mt-1 rounded-full bg-amber-200 transition-all duration-200"></span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
} 