import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            // Fetch posts with user info (author)
            let { data, error } = await supabase
                .from('posts')
                .select('id, image_url, text, created_at, user:users(id, first_name, last_name, username, photo_url)')
                .order('created_at', { ascending: false })
                .limit(30);
            if (!error && data) {
                setPosts(data);
            } else {
                setPosts([]);
            }
            setLoading(false);
        }
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 w-full max-w-md mx-auto px-4  mb-32 flex flex-col gap-4">
                {loading ? (
                    <div className="text-gray-400 text-center py-12">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="text-gray-400 text-center py-12">No posts yet. Be the first to share!</div>
                ) : (
                    posts.map(post => {
                        const author = post.user || {};
                        const avatar = author.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent((author.first_name || 'U') + (author.last_name ? ' ' + author.last_name : ''))}&background=eee&color=888&size=128`;
                        const name = [author.first_name, author.last_name].filter(Boolean).join(' ') || 'Anonymous';
                        const username = author.username ? `@${author.username}` : '';
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
                                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 hover:bg-amber-100 border border-gray-200 text-xl text-gray-400 hover:text-amber-500 transition shadow-sm focus:outline-none"
                                        aria-label="Support this post"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
} 