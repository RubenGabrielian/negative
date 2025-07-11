import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjlutuncfgciiubrkcfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbHV0dW5jZmdjaWl1YnJrY2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjg5ODksImV4cCI6MjA2NzgwNDk4OX0.rsWrY-osNEGdEidr8F7eI_i1mKbXh9Z84xJ_bFBI42w';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Profile({ user }) {
    // Fallbacks if user is not available
    const photo = user?.photo_url || 'https://ui-avatars.com/api/?name=User&background=eee&color=888&size=128';
    const name = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Anonymous';
    const username = user?.username ? `@${user.username}` : '@username';
    const id = user?.id || '000000000';

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            if (!user?.id) {
                setPosts([]);
                setLoading(false);
                return;
            }
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (!error) setPosts(data || []);
            setLoading(false);
        }
        fetchPosts();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
            <div className="w-full max-w-xs mx-auto flex flex-col items-center space-y-2 pt-8 pb-6">
                <img
                    src={photo}
                    alt="Profile"
                    className="w-24 h-24 rounded-full shadow mb-2 object-cover bg-white border border-gray-200"
                />
                <div className="text-xl font-bold text-gray-800 text-center">{name}</div>
                <div className="text-gray-500 text-center">{username}</div>
                <div className="text-xs text-gray-400 text-center">Telegram ID: {id}</div>
            </div>
            <div className="w-full max-w-xs mx-auto">
                <div className="border-t border-gray-200 my-6" />
                <div className="mb-2 text-lg font-semibold text-gray-700">My Posts</div>
                {loading ? (
                    <div className="text-gray-400 text-center py-8">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">No posts yet.</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {posts.map(post => (
                            <div key={post.id} className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                                {post.image_url && (
                                    <img src={post.image_url} alt="Post" className="w-16 h-16 rounded-md object-cover bg-gray-100 border border-gray-200" />
                                )}
                                <div className="flex-1 text-gray-700 text-sm break-words">{post.text}</div>
                            </div>
                        ))}
                    </div>
                )}
                <button className="w-full py-3 rounded-lg bg-gray-100 text-gray-500 font-semibold text-base shadow-sm hover:bg-gray-200 transition mt-8">Log Out</button>
            </div>
        </div>
    );
} 