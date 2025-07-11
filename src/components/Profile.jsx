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
    const [deletingId, setDeletingId] = useState(null);

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

    async function handleDelete(postId) {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        setDeletingId(postId);
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (!error) setPosts(posts => posts.filter(p => p.id !== postId));
        setDeletingId(null);
    }

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
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    disabled={deletingId === post.id}
                                    className="ml-2 p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition disabled:opacity-60"
                                    title="Delete post"
                                >
                                    {deletingId === post.id ? (
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <button className="w-full py-3 rounded-lg bg-gray-100 text-gray-500 font-semibold text-base shadow-sm hover:bg-gray-200 transition mt-8">Log Out</button>
            </div>
        </div>
    );
} 