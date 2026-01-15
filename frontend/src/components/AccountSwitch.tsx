'use client';

import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

export default function AccountSwitch() {
    const [isDemo, setIsDemo] = useState(false);

    return (
        <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-full inline-flex relative shadow-inner">
                {/* Background Slider Animation can be added here */}

                <button
                    onClick={() => setIsDemo(false)}
                    className={`
                        relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2
                        ${!isDemo
                            ? 'bg-white text-primary-navy shadow-md'
                            : 'text-text-secondary hover:text-primary-navy'}
                    `}
                >
                    <Unlock size={14} className={!isDemo ? 'text-success' : ''} />
                    Gerçek Hesap
                </button>

                <button
                    onClick={() => setIsDemo(true)}
                    className={`
                        relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2
                        ${isDemo
                            ? 'bg-white text-primary-navy shadow-md'
                            : 'text-text-secondary hover:text-primary-navy'}
                    `}
                >
                    <Lock size={14} className={isDemo ? 'text-text-accent' : ''} />
                    Demo Hesap
                </button>
            </div>
        </div>
    );
}
