import React, { useEffect, useState, useRef } from 'react';
import { createClient } from './utils/supabaseClient';
import WebApp from '@twa-dev/sdk';
import BottomNav from './components/BottomNav';
import WriteModal from './components/WriteModal';
import TelegramUserSync from './components/TelegramUserSync';

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

    const [modalOpen, setModalOpen] = useState(false);
    const [posting, setPosting] = useState(false);

    // Get Telegram user object
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const userId = telegramUser?.id;

    // Supabase setup (reuse from TelegramUserSync)
    const supabaseUrl = 'https://zjlutuncfgciiubrkcfe.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbHV0dW5jZmdjaWl1YnJrY2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjg5ODksImV4cCI6MjA2NzgwNDk4OX0.rsWrY-osNEGdEidr8F7eI_i1mKbXh9Z84xJ_bFBI42w';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle post submit
    const handlePostSubmit = async ({ text, image }) => {
        setPosting(true);
        let image_url = null;
        try {
            if (image) {
                // Upload image to Supabase Storage
                const fileExt = image.name.split('.').pop();
                const fileName = `${userId}_${Date.now()}.${fileExt}`;
                const { data, error } = await supabase.storage.from('posts').upload(fileName, image, { upsert: true });
                if (error) throw error;
                // Get public URL
                const { data: publicUrlData } = supabase.storage.from('posts').getPublicUrl(fileName);
                image_url = publicUrlData?.publicUrl || null;
            }
            // Insert post to Supabase, including Telegram user info
            await supabase.from('posts').insert([
                {
                    user_id: telegramUser?.id,
                    first_name: telegramUser?.first_name || null,
                    last_name: telegramUser?.last_name || null,
                    username: telegramUser?.username || null,
                    photo_url: telegramUser?.photo_url || null,
                    text,
                    image_url,
                },
            ]);
            setModalOpen(false);
        } catch (err) {
            alert('Failed to post. Please try again.');
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className={`min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 via-amber-50 to-gray-100 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`} style={{ minHeight: '100vh' }}>
            {/* Sync Telegram user to Supabase on mount */}
            <TelegramUserSync />
            {/* Write Modal */}
            <WriteModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handlePostSubmit} loading={posting} />
            <div className="pt-10 flex flex-col items-center justify-center w-full max-w-sm px-4 flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-4 tracking-tight leading-tight">
                    Dump your pain
                </h1>
                <p className="text-base sm:text-lg text-center text-gray-500 mb-8 max-w-xs">
                    This is your safe space. Just let it out.
                </p>
                <button
                    className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 hover:from-amber-300 hover:to-amber-200 active:scale-95 text-amber-900 text-lg font-semibold shadow-lg transition-all duration-150 mb-6 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 border border-amber-200"
                    onClick={() => setModalOpen(true)}
                >
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