import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            // Fetch posts with author info (users table)
            let { data, error } = await supabase
                .from('posts')
                .select('*, user:users(id, first_name, last_name, username, photo_url)')
                .order('created_at', { ascending: false });
            if (!error && data) {
                // Shuffle posts randomly
                data = data.sort(() => Math.random() - 0.5);
                setPosts(data);
            } else {
                setPosts([]);
            }
            setLoading(false);
        }
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-amber-50 to-gray-100 flex flex-col items-center px-4 pb-24 pt-6">
            <div className="w-full max-w-md mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Feed</h1>
                {loading ? (
                    <div className="text-gray-400 text-center py-12">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="text-gray-400 text-center py-12">No posts yet. Be the first to share!</div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {posts.map(post => {
                            const author = post.user || {};
                            const avatar = author.photo_url || 'https://ui-avatars.com/api/?name=' + (author.first_name || 'U') + '&background=eee&color=888&size=128';
                            const name = (author.first_name || '') + (author.last_name ? ' ' + author.last_name : '');
                            const username = author.username ? '@' + author.username : '';
                            return (
                                <div key={post.id} className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 flex flex-col gap-3">
                                    {/* Author row */}
                                    <div className="flex items-center gap-3 mb-1">
                                        <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="font-semibold text-gray-800 text-sm truncate">{name || 'Anonymous'}</span>
                                            <span className="text-xs text-gray-400 truncate">{username}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">{new Date(post.created_at).toLocaleString()}</span>
                                    </div>
                                    {/* Image */}
                                    {post.image_url && (
                                        <img src={post.image_url} alt="Post" className="w-full rounded-xl object-cover max-h-72 border border-gray-200" />
                                    )}
                                    {/* Text */}
                                    <div className="text-gray-900 text-base whitespace-pre-line break-words px-1">{post.text}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
} 