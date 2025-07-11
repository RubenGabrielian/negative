import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import WebApp from '@twa-dev/sdk';
import BottomNav from './components/BottomNav';
import WriteModal from './components/WriteModal';
import TelegramUserSync from './components/TelegramUserSync';
import Home from './components/Home';
import Profile from './components/Profile';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

export default function App() {
    const [fadeIn, setFadeIn] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [posting, setPosting] = useState(false);

    // Fade-in for cards
    const [cardsVisible, setCardsVisible] = useState(false);
    useEffect(() => {
        setFadeIn(true);
        // Delay cards fade-in slightly after main fade
        const timeout = setTimeout(() => setCardsVisible(true), 350);
        return () => clearTimeout(timeout);
    }, []);

    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    const handlePostSubmit = async ({ text, image }) => {
        setPosting(true);
        let image_url = null;
        try {
            // Example: get userId from Telegram user
            const userId = telegramUser?.id;
            // Supabase setup
            const supabaseUrl = 'https://zjlutuncfgciiubrkcfe.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbHV0dW5jZmdjaWl1YnJrY2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjg5ODksImV4cCI6MjA2NzgwNDk4OX0.rsWrY-osNEGdEidr8F7eI_i1mKbXh9Z84xJ_bFBI42w';
            const supabase = createClient(supabaseUrl, supabaseKey);

            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${userId}_${Date.now()}.${fileExt}`;
                const { data, error } = await supabase.storage.from('posts').upload(fileName, image, { upsert: true });
                if (error) {
                    console.error('Supabase Storage upload error:', error);
                    throw error;
                }
                const { data: publicUrlData } = supabase.storage.from('posts').getPublicUrl(fileName);
                image_url = publicUrlData?.publicUrl || null;
            }
            await supabase.from('posts').insert([
                {
                    user_id: userId,
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
        <Router>
            {/* Sync Telegram user to Supabase on mount */}
            <TelegramUserSync />
            {/* Write Modal */}
            <WriteModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handlePostSubmit} loading={posting} />
            <Routes>
                <Route path="/" element={<Home
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    posting={posting}
                    handlePostSubmit={handlePostSubmit}
                    fadeIn={fadeIn}
                    cardsVisible={cardsVisible}
                />} />
                <Route path="/profile" element={<Profile user={telegramUser} />} />
            </Routes>
            <BottomNav />
        </Router>
    );
} 