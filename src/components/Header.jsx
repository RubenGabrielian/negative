import React from 'react';

export default function Header({ emoji = '🖤', title = 'Dump It' }) {
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 w-full mb-10">
            <div className="max-w-md mx-auto flex items-center justify-center py-3">
                <span className="text-xl md:text-2xl mr-2 select-none" aria-label="App icon" role="img">{emoji}</span>
                <span className="text-lg md:text-xl font-semibold text-gray-600 tracking-tight select-none">{title}</span>
            </div>
        </header>
    );
} 