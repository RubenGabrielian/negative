import React, { useState, useEffect, useRef } from 'react';

export default function WriteModal({ open, onClose, onSubmit, loading }) {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [text, setText] = useState('');
    const fileInputRef = useRef();

    useEffect(() => {
        if (!open) {
            setImage(null);
            setImagePreview(null);
            setText('');
        }
    }, [open]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() && !image) return;
        onSubmit({ text, image });
    };

    if (!open) return null;
    const maxLength = 280;
    // Placeholder avatar (replace with Telegram user if available via props)
    const avatar = 'https://ui-avatars.com/api/?name=U&background=eee&color=888&size=128';
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-0 relative flex flex-col overflow-hidden">
                {/* Header with avatar */}
                <div className="flex items-center gap-3 px-6 pt-5 pb-2 border-b border-gray-100">
                    <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    <span className="font-semibold text-gray-800 text-base">Share something...</span>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col px-6 pt-3 pb-5 gap-2">
                    {/* Textarea */}
                    <textarea
                        className="w-full border-none outline-none bg-transparent text-lg placeholder-gray-400 min-h-[90px] resize-none font-normal focus:ring-0 focus:border-none focus:shadow-[0_0_0_2px_rgba(0,0,0,0.85)]"
                        rows={4}
                        maxLength={maxLength}
                        placeholder="What's happening?"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        required={!image}
                        style={{ boxShadow: 'none' }}
                    />
                    <div className="flex justify-between items-center mt-1 mb-2">
                        <label htmlFor="image-upload" className="flex items-center gap-2 cursor-pointer">
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-amber-100 border border-gray-200 text-2xl text-gray-400 transition">
                                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-6 h-6'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
                                </svg>
                            </span>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                        </label>
                        <span className={`text-xs ${text.length > maxLength - 20 ? 'text-amber-500' : 'text-gray-400'}`}>{text.length}/{maxLength}</span>
                    </div>
                    {/* Image preview */}
                    {imagePreview && (
                        <div className="relative w-full flex justify-center mb-2">
                            <img src={imagePreview} alt="Preview" className="max-h-56 rounded-2xl object-cover border border-gray-200 shadow" />
                            <button
                                type="button"
                                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-base hover:bg-black/80"
                                onClick={() => { setImage(null); setImagePreview(null); fileInputRef.current.value = null; }}
                                aria-label="Remove image"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    {/* Action bar */}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 font-medium text-base px-2 py-1 rounded-lg transition"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-7 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-base shadow-lg border border-yellow-400 transition disabled:opacity-60"
                            disabled={loading || (!text.trim() && !image)}
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 