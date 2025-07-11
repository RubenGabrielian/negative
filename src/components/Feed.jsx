import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Feed({ user }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [supporting, setSupporting] = useState({}); // {postId: true}
    const userId = user?.id;

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            // Use Supabase RPC or SQL to fetch posts with author info and support count
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    id,
                    image_url,
                    text,
                    created_at,
                    user:users (
                        first_name,
                        username,
                        photo_url
                    ),
                    supports:supports (
                        id,
                        user_id
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(30);

            if (!error && data) {
                setPosts(data.map(post => ({
                    ...post,
                    first_name: post.user?.first_name,
                    username: post.user?.username,
                    photo_url: post.user?.photo_url,
                    supportCount: post.supports?.length || 0,
                    supported: post.supports?.some(s => s.user_id === userId) || false
                })));
            } else {
                setPosts([]);
            }
            setLoading(false);
        }
        fetchPosts();
    }, [userId]);

    async function handleSupport(postId) {
        if (!userId) return;
        setSupporting(s => ({ ...s, [postId]: true }));
        // Check if already supported
        const { data: existing } = await supabase
            .from('supports')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();
        if (!existing) {
            await supabase.from('supports').insert([{ post_id: postId, user_id: userId }]);
            setPosts(posts => posts.map(p => p.id === postId ? { ...p, supportCount: (p.supportCount || 0) + 1, supported: true } : p));
        }
        setSupporting(s => ({ ...s, [postId]: false }));
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-10">
            <div className="flex-1 w-full max-w-md mx-auto px-4  mb-32 flex flex-col gap-4">
                {loading ? (
                    <div className="text-gray-400 text-center py-12">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="text-gray-400 text-center py-12">No posts yet. Be the first to share!</div>
                ) : (
                    posts.map(post => {
                        const avatar = post.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.first_name || 'U')}&background=eee&color=888&size=128`;
                        const name = post.first_name || 'Anonymous';
                        const username = post.username ? `@${post.username}` : '';
                        return (
                            <div
                                key={post.id}
                                className="bg-white rounded-xl shadow-sm p-3 flex flex-col gap-2 hover:scale-[1.01] transition cursor-pointer border border-gray-100"
                            >
                                {/* Author row */}
                                <div className="flex items-center gap-2 mb-1">
                                    <img src={avatar} alt="Avatar" className="rounded-full w-8 h-8 object-cover border border-gray-200" />
                                    <span className="font-medium text-gray-800 text-sm truncate max-w-[8rem]">{name}</span>
                                    {username && <span className="text-xs text-gray-400 truncate">{username}</span>}
                                </div>
                                {/* Image */}
                                {post.image_url && (
                                    <img
                                        src={post.image_url}
                                        alt="Anonymous post"
                                        className="w-full aspect-[4/3] object-cover rounded-lg bg-gray-100"
                                    />
                                )}
                                {/* Text */}
                                <div className="text-gray-700 text-sm line-clamp-3 pt-1 px-1">
                                    {post.text}
                                </div>
                                {/* Support icon */}
                                <div className="flex items-center pt-2 pl-1">
                                    <button
                                        type="button"
                                        className={`inline-flex items-center justify-center w-9 h-9 rounded-full border text-xl transition shadow-sm focus:outline-none ${post.supported ? 'bg-amber-100 text-amber-500 border-amber-200' : 'bg-gray-50 hover:bg-amber-100 border-gray-200 text-gray-400 hover:text-amber-500'}`}
                                        aria-label="Support this post"
                                        onClick={() => handleSupport(post.id)}
                                        disabled={supporting[post.id] || post.supported || !userId}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={post.supported ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </button>
                                    <span className="ml-2 text-sm text-gray-500 select-none">{post.supportCount || 0}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
} 