import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import WebApp from '@twa-dev/sdk';

const supabaseUrl = 'https://zjlutuncfgciiubrkcfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbHV0dW5jZmdjaWl1YnJrY2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjg5ODksImV4cCI6MjA2NzgwNDk4OX0.rsWrY-osNEGdEidr8F7eI_i1mKbXh9Z84xJ_bFBI42w';
const supabase = createClient(supabaseUrl, supabaseKey);

const fakePosts = [
    {
        image: 'https://bereal.com/wp-content/uploads/2024/02/4-Primary.png.webp',
        text: 'I feel invisible.'
    },
    {
        image: 'https://bereal.com/wp-content/uploads/2024/02/2-Primary.png.webp',
        text: 'Nobody checks on me.'
    },
    {
        image: 'https://bereal.com/wp-content/uploads/2024/02/Primary-6.png.webp',
        text: 'I just want to feel peace.'
    },
    {
        image: 'https://bereal.com/wp-content/uploads/2024/02/5-Primary.png.webp',
        text: 'Nobody checks on me.'
    },
];

export default function Home({ setModalOpen }) {
    const [user, setUser] = useState(null);

    // On mount: fetch Telegram user and upsert to Supabase
    useEffect(() => {
        WebApp.ready && WebApp.ready();
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        setUser(tgUser);
        if (tgUser) {
            const userRow = {
                id: tgUser.id,
                first_name: tgUser.first_name,
                last_name: tgUser.last_name,
                username: tgUser.username,
                photo_url: tgUser.photo_url,
            };
            supabase.from('users').upsert([userRow], { onConflict: ['id'] });
        }
    }, []);

    // Modal handlers
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };
    const handleModalClose = () => {
        setModalOpen(false);
        setText('');
        setImage(null);
        setImagePreview(null);
    };
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!user || (!text.trim() && !image)) return;
        setPosting(true);
        let image_url = null;
        try {
            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${user.id}_${Date.now()}.${fileExt}`;
                const { error } = await supabase.storage.from('posts').upload(fileName, image, { upsert: true });
                if (error) throw error;
                const { data: publicUrlData } = supabase.storage.from('posts').getPublicUrl(fileName);
                image_url = publicUrlData?.publicUrl || null;
            }
            await supabase.from('posts').insert([
                {
                    user_id: user.id,
                    text,
                    image_url,
                },
            ]);
            handleModalClose();
        } catch (err) {
            alert('Failed to post. Please try again.');
        } finally {
            setPosting(false);
        }
    };

    // UI
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-amber-50 to-gray-100 flex flex-col items-center justify-start px-4 pb-8">
            {/* Profile photo top right */}
            <div className="w-full flex justify-end pt-6 pr-2">
                {user?.photo_url && (
                    <img src={user.photo_url} alt="Profile" className="w-12 h-12 rounded-full border border-gray-200 shadow object-cover" />
                )}
            </div>
            {/* Welcome header */}
            <div className="w-full max-w-sm flex flex-col items-center mt-2 mb-6">
                <div className="text-lg text-gray-700 font-semibold mb-1 text-center">
                    Hi {user?.first_name || user?.username || 'there'}, ready to let something out?
                </div>
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-2 tracking-tight leading-tight">
                    Show how bad your day really was
                </h1>
                <p className="text-base text-center text-gray-500 mb-6 max-w-xs">
                    Dump the poison out. No likes. No judgment. Just honesty.
                </p>
                <button
                    className="w-full py-4 px-8 rounded-2xl bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-black text-lg font-bold shadow-lg transition-all duration-150 mb-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 border border-yellow-400"
                    onClick={() => setModalOpen(true)}
                >
                    ✍️ Write Now
                </button>
            </div>
            {/* Fake posts grid */}
            <div className="w-full max-w-sm">
                <div className="mb-3 text-sm text-gray-400 font-medium">What others are sharing…</div>
                <div className="grid grid-cols-2 gap-4">
                    {fakePosts.map((post, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm bg-white flex flex-col">
                            <img src={post.image} alt="Fake post" className="object-cover w-full h-full" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/40 to-transparent p-2 flex items-end rounded-b-xl">
                                <span className="text-white text-xs drop-shadow-sm">{post.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 