import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import WebApp from '@twa-dev/sdk';

function BottomNav() {
    // For demo, Home is active
    const [active, setActive] = useState('home');
    const navItems = [
        {
            key: 'home',
            label: 'Home',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
                </svg>
            ),
        },
        {
            key: 'write',
            label: 'Write',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213l-4.5 1.318 1.318-4.5 12.544-12.544z" />
                </svg>
            ),
        },
        {
            key: 'feed',
            label: 'Feed',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>
            ),
        },
        {
            key: 'profile',
            label: 'Profile',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75A2.25 2.25 0 0117.25 22.5h-10.5A2.25 2.25 0 014.5 20.25v-.75z" />
                </svg>
            ),
        },
    ];
    return (
        <nav className="fixed bottom-0 left-0 w-full z-50">
            <div className="mx-auto max-w-sm">
                <ul className="flex justify-between items-center bg-white rounded-t-xl shadow-[0_-2px_12px_0_rgba(0,0,0,0.06)] border-t border-gray-200 px-2 py-1">
                    {navItems.map((item) => (
                        <li key={item.key} className="flex-1">
                            <button
                                className={`flex flex-col items-center justify-center w-full py-2 px-1 focus:outline-none transition group ${active === item.key ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}
                                style={{ minHeight: 44 }}
                                onClick={() => setActive(item.key)}
                            >
                                <span className={`mb-0.5 ${active === item.key ? 'scale-110' : ''}`}>{item.icon}</span>
                                <span className={`text-xs ${active === item.key ? 'font-bold' : ''}`}>{item.label}</span>
                                {active === item.key && (
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

// TelegramUserSync: No UI, just syncs user on mount
function TelegramUserSync() {
    useEffect(() => {
        // Initialize Telegram WebApp SDK
        WebApp.ready();
        const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!user) return;

        // Supabase setup
        const supabaseUrl = 'https://zjlutuncfgciiubrkcfe.supabase.co';
        const supabaseKey = 'sb_publishable_k-9JpTT_6iFV1-DEv-vxwg_-RHebGDr';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Prepare user data
        const userData = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            photo_url: user.photo_url,
        };

        // Upsert to Supabase
        supabase
            .from('users')
            .upsert([userData], { onConflict: ['id'] })
            .then(() => {/* no UI, ignore result */ });
    }, []);
    return null;
}

export default function App() {
    const [fadeIn, setFadeIn] = useState(false);
    // Fade-in for cards
    const [cardsVisible, setCardsVisible] = useState(false);
    useEffect(() => {
        setFadeIn(true);
        // Delay cards fade-in slightly after main fade
        const timeout = setTimeout(() => setCardsVisible(true), 350);
        return () => clearTimeout(timeout);
    }, []);

    // Sample anonymous quotes
    const previewQuotes = [
        "I feel invisible.",
        "Nobody checks on me.",
        "I just want to feel peace.",
        "I’m tired of pretending I’m okay.",
        "It’s hard to get out of bed.",
        "I wish someone understood."
    ];

    return (
        <div className={`min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 via-amber-50 to-gray-100 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`} style={{ minHeight: '100vh' }}>
            {/* Sync Telegram user to Supabase on mount */}
            <TelegramUserSync />
            <div className="flex flex-col items-center justify-center w-full max-w-sm px-4 flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-4 tracking-tight leading-tight">
                    Dump your pain
                </h1>
                <p className="text-base sm:text-lg text-center text-gray-500 mb-8 max-w-xs">
                    This is your safe space. Just let it out.
                </p>
                <button className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 hover:from-amber-300 hover:to-amber-200 active:scale-95 text-amber-900 text-lg font-semibold shadow-lg transition-all duration-150 mb-16 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 border border-amber-200">
                    ✍️ Write now
                </button>
                {/* Preview section: What others are sharing */}
                <div className="w-full max-w-sm px-4">
                    <h2 className="text-base font-semibold text-gray-500 mb-4 mt-8 flex items-center gap-2">
                        <span className="text-amber-400 text-lg">➤</span> What others are sharing…
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Fake image posts with overlayed quotes */}
                        <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm group transition-transform hover:scale-105">
                            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Anonymous post 1" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 flex items-end rounded-b-lg">
                                <span className="text-white text-xs drop-shadow-sm">“I feel invisible.”</span>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm group transition-transform hover:scale-105">
                            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Anonymous post 2" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 flex items-end rounded-b-lg">
                                <span className="text-white text-xs drop-shadow-sm">“Nobody checks on me.”</span>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm group transition-transform hover:scale-105">
                            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Anonymous post 3" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 flex items-end rounded-b-lg">
                                <span className="text-white text-xs drop-shadow-sm">“I just want to feel peace.”</span>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm group transition-transform hover:scale-105">
                            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Anonymous post 4" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 flex items-end rounded-b-lg">
                                <span className="text-white text-xs drop-shadow-sm">“I’m tired of pretending I’m okay.”</span>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm group transition-transform hover:scale-105">
                            <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80" alt="Anonymous post 5" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 flex items-end rounded-b-lg">
                                <span className="text-white text-xs drop-shadow-sm">“It’s hard to get out of bed.”</span>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm group transition-transform hover:scale-105">
                            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Anonymous post 6" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 flex items-end rounded-b-lg">
                                <span className="text-white text-xs drop-shadow-sm">“I wish someone understood.”</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-sm px-4 pb-8 flex flex-col gap-2">
                <div className="bg-gray-100 rounded-xl text-gray-400 text-sm px-4 py-3 shadow-sm">
                    “I feel completely stuck.”
                </div>
                <div className="bg-gray-100 rounded-xl text-gray-400 text-sm px-4 py-3 shadow-sm">
                    “Nobody knows how much I’m hurting.”
                </div>
            </div>
            <BottomNav />
        </div>
    );
} 