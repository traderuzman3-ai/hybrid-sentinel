'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Menu, X } from 'lucide-react';
import { useState } from 'react';
import TradeSidebar from './TradeSidebar';

export default function MobileNav() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const NavItem = ({ href, icon: Icon, label, active, onClick }: any) => (
        <Link
            href={href}
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-primary' : 'text-text-secondary'}`}
        >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
        </Link>
    );

    return (
        <>
            {/* Bottom Tab Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border-subtle flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 pb-safe">
                <NavItem href="/dashboard" icon={LayoutDashboard} label="İşlem" active={pathname === '/dashboard'} />
                <NavItem href="/portfolio" icon={Briefcase} label="Portföy" active={pathname === '/portfolio'} />

                {/* Menu Button triggers Drawer */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isMenuOpen ? 'text-primary' : 'text-text-secondary'}`}
                >
                    <Menu size={20} strokeWidth={isMenuOpen ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Menü</span>
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="relative w-[300px] h-full bg-white animate-in slide-in-from-right duration-200 shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="font-bold text-primary-navy">Menü</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        {/* Reuse the Sidebar Content */}
                        <div className="flex-1 overflow-y-auto">
                            <TradeSidebar />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
