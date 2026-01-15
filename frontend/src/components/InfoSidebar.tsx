'use client';

import Link from 'next/link';
import { Info, HelpCircle, Users, Headphones } from 'lucide-react';

export default function InfoSidebar() {
    return (
        <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white min-h-[calc(100vh-80px)] p-6 hidden lg:block">
            <nav className="flex flex-col gap-2">
                <Link href="/about" className="sidebar-nav-item">
                    <Info size={20} />
                    <span>Hakkımızda</span>
                </Link>
                <Link href="/why-us" className="sidebar-nav-item">
                    <HelpCircle size={20} />
                    <span>Neden Biz?</span>
                </Link>
                <Link href="/consultants" className="sidebar-nav-item">
                    <Users size={20} />
                    <span>Danışmanlar</span>
                </Link>
                <Link href="/support" className="sidebar-nav-item">
                    <Headphones size={20} />
                    <span>Canlı Destek</span>
                </Link>
            </nav>

            <div className="mt-auto pt-8 border-t border-gray-100">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-primary-blue font-semibold mb-1 text-sm">Yardım mı lazım?</h4>
                    <p className="text-xs text-text-secondary mb-3">Uzmanlarımız 7/24 yanınızda.</p>
                    <button className="btn-tactile primary w-full text-xs">Destek Başlat</button>
                </div>
            </div>
        </aside>
    );
}
