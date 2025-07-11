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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
                </svg>
            ),
            path: '/',
        },
        {
            key: 'write',
            label: 'Write',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213l-4.5 1.318 1.318-4.5 12.544-12.544z" />
                </svg>
            ),
            path: null, // No route, handled by modal in App
        },
        {
            key: 'feed',
            label: 'Feed',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>
            ),
            path: null, // Not implemented
        },
        {
            key: 'profile',
            label: 'Profile',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75A2.25 2.25 0 0117.25 22.5h-10.5A2.25 2.25 0 014.5 20.25v-.75z" />
                </svg>
            ),
            path: '/profile',
        },
    ];

    // Determine active tab by route
    const activeKey = (() => {
        if (location.pathname === '/profile') return 'profile';
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