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
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs mx-4 p-5 relative flex flex-col">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={onClose}
                    aria-label="Close"
                    type="button"
                >
                    ×
                </button>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <label htmlFor="image-upload" className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden border border-gray-200">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-gray-400 text-3xl">+</span>
                            )}
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                        </label>
                        <span className="text-xs text-gray-400">Upload a photo (optional)</span>
                    </div>
                    <textarea
                        className="w-full rounded-lg border border-gray-200 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-200"
                        rows={3}
                        maxLength={200}
                        placeholder="Type your message..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                        required={!image}
                    />
                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-white font-semibold text-base transition disabled:opacity-60"
                        disabled={loading || (!text.trim() && !image)}
                    >
                        {loading ? 'Posting...' : 'Share'}
                    </button>
                </form>
            </div>
        </div>
    );
} 