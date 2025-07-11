import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import WebApp from '@twa-dev/sdk';

export default function TelegramUserSync() {
    useEffect(() => {
        WebApp.ready();
        const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!user) return;
        const userData = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            photo_url: user.photo_url,
        };
        supabase
            .from('users')
            .upsert([userData], { onConflict: ['id'] })
            .then(() => { });
    }, []);
    return null;
} 