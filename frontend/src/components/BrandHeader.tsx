'use client';

import Link from 'next/link';

export default function BrandHeader() {
    return (
        <header className="bg-bg-header border-b border-border-subtle sticky top-0 z-50 h-14 flex items-center shadow-sm">
            <div className="container-custom mx-auto flex items-center justify-between px-4">
                {/* Left: Brand & Status */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 no-underline group">
                        <div className="bg-primary-navy text-white px-2.5 py-1 rounded-sm font-bold text-lg tracking-tight font-serif group-hover:bg-primary-blue transition-colors rounded">
                            HS
                        </div>
                        <div className="flex flex-col">
                            <span className="text-primary-navy font-bold text-sm tracking-tight leading-none">HYBRID SENTINEL</span>
                            <span className="text-[10px] text-text-secondary font-medium tracking-wide uppercase">Institutional Terminal</span>
                        </div>
                    </Link>

                    <div className="h-6 w-px bg-border-subtle mx-2 hidden md:block"></div>

                    {/* Market Status Indicator */}
                    <div className="hidden md:flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Piyasa Açık</span>
                    </div>
                </div>

                {/* Center: Quick Indices (Ticker Style) */}
                <div className="hidden lg:flex items-center gap-6 text-xs font-mono-data">
                    <div className="flex items-center gap-2">
                        <span className="text-text-muted">BIST 100</span>
                        <span className="text-success font-semibold">10,559.00</span>
                        <span className="text-success bg-emerald-50 px-1 rounded text-[10px]">%1.20</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-text-muted">USD/TRY</span>
                        <span className="text-text-primary font-semibold">36.85</span>
                        <span className="text-success bg-emerald-50 px-1 rounded text-[10px]">%0.05</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-text-muted">ALTIN.GR</span>
                        <span className="text-text-primary font-semibold">3,150</span>
                        <span className="text-success bg-emerald-50 px-1 rounded text-[10px]">%0.34</span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <button className="text-text-secondary hover:text-primary-navy transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                    </button>
                    <div className="h-4 w-px bg-border-subtle"></div>
                    <Link href="/auth/login" className="text-xs font-semibold text-text-secondary hover:text-primary-navy px-2 py-1 transition-colors">
                        Oturum Aç
                    </Link>
                    <Link href="/auth/register" className="btn-tactile primary text-xs">
                        Hesap Oluştur
                    </Link>
                </div>
            </div>
        </header>
    );
}
