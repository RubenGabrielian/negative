import React from 'react';

export default function Profile({ user }) {
    // Fallbacks if user is not available
    const photo = user?.photo_url || 'https://ui-avatars.com/api/?name=User&background=eee&color=888&size=128';
    const name = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Anonymous';
    const username = user?.username ? `@${user.username}` : '@username';
    const id = user?.id || '000000000';

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
                {/* Future: Add more profile actions here */}
                <button className="w-full py-3 rounded-lg bg-amber-100 text-amber-800 font-semibold text-base shadow-sm mb-2 hover:bg-amber-200 transition">My Posts</button>
                <button className="w-full py-3 rounded-lg bg-gray-100 text-gray-500 font-semibold text-base shadow-sm hover:bg-gray-200 transition">Log Out</button>
            </div>
        </div>
    );
} 