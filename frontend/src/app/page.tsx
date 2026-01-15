'use client';

import Link from 'next/link';
import { AreaChart, ShieldCheck, User, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
            {/* Header */}
            <header className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    {/* Logo */}
                    <div className="text-2xl font-bold tracking-tighter text-slate-900">
                        //r
                    </div>
                </div>

                <nav className="hidden md:flex gap-8 text-[15px] font-medium text-slate-600">
                    <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[8px]">●</span> Piyasalar
                    </a>
                    <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-2">
                        <span className="text-slate-400">📈</span> Analizler
                    </a>
                    <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-2">
                        <User size={18} /> Danışman
                    </a>
                </nav>

                <div className="hidden md:block w-8"></div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 max-w-7xl mx-auto w-full gap-12 -mt-10">
                {/* Left Side: Text */}
                <div className="flex-1 text-left">
                    <h1 className="text-6xl md:text-[5.5rem] font-bold text-slate-900 tracking-tight leading-[1] mb-8">
                        Kontrol sende.<br />
                        Piyasa senin<br />
                        hızında.
                    </h1>

                    <div className="flex flex-wrap gap-8 text-slate-500 font-medium text-base">
                        <span className="flex items-center gap-2">
                            <ActivityIcon /> Canlı Borsa
                        </span>
                        <span className="flex items-center gap-2">
                            <ShieldCheck size={18} /> Güvenli Al-Sat
                        </span>
                        <span className="flex items-center gap-2">
                            <SettingsIcon /> Profesyonel Araçlar
                        </span>
                    </div>
                </div>

                {/* Right Side: Action Card */}
                <div className="flex-1 flex justify-end w-full max-w-md">
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 w-full max-w-[400px]">
                        <div className="flex flex-col gap-4">
                            <Link href="/auth/register?type=real" className="w-full">
                                <button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-medium text-lg py-4 px-6 rounded-full transition-all shadow-lg shadow-emerald-200/50 active:scale-[0.98]">
                                    Gerçek Hesap
                                </button>
                            </Link>

                            <Link href="/auth/register?type=demo" className="w-full">
                                <button className="w-full bg-white border border-[#10b981] text-[#10b981] hover:bg-emerald-50 font-medium text-lg py-4 px-6 rounded-full transition-colors active:scale-[0.98]">
                                    Demo Hesap
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ActivityIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
    )
}

function SettingsIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.73l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
    )
}
