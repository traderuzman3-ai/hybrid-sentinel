'use client';

import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Lock, Unlock } from 'lucide-react';

export default function AccountSwitch() {
    const { user } = useUser();
    const [isDemo, setIsDemo] = useState(user?.accountType === 'DEMO');
    const [switching, setSwitching] = useState(false);

    const handleSwitch = async (demo: boolean) => {
        if (switching) return;
        if ((demo && isDemo) || (!demo && !isDemo)) return;

        setSwitching(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/switch-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ accountType: demo ? 'DEMO' : 'REAL' })
            });

            if (res.ok) {
                setIsDemo(demo);
                // Sayfayı yenile
                window.location.reload();
            }
        } catch (error) {
            console.error('Account switch failed:', error);
        } finally {
            setSwitching(false);
        }
    };

    return (
        <div className="flex">
            <div className="bg-gray-100 p-0.5 rounded-lg inline-flex relative shadow-inner">
                <button
                    onClick={() => handleSwitch(false)}
                    disabled={switching}
                    className={`
                        relative z-10 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5
                        ${!isDemo
                            ? 'bg-white text-primary-navy shadow-sm'
                            : 'text-text-secondary hover:text-primary-navy'}
                        ${switching ? 'opacity-50 cursor-wait' : ''}
                    `}
                >
                    <Unlock size={12} className={!isDemo ? 'text-success' : ''} />
                    Gerçek Hesap
                </button>

                <button
                    onClick={() => handleSwitch(true)}
                    disabled={switching}
                    className={`
                        relative z-10 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5
                        ${isDemo
                            ? 'bg-white text-primary-navy shadow-sm'
                            : 'text-text-secondary hover:text-primary-navy'}
                        ${switching ? 'opacity-50 cursor-wait' : ''}
                    `}
                >
                    <Lock size={12} className={isDemo ? 'text-blue-500' : ''} />
                    Demo Hesap
                </button>
            </div>
        </div>
    );
}
