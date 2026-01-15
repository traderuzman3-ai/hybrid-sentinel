'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, Wallet, UserCircle, Bell } from 'lucide-react';

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="mobile-nav" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '65px',
            backgroundColor: 'rgba(10, 14, 23, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--border)',
            display: 'none', // Sadece mobilde medya sorgusuyla açılacak
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 1000,
            paddingBottom: 'env(safe-area-inset-bottom)'
        }}>
            <Link href="/dashboard" style={{ color: pathname === '/dashboard' ? 'var(--primary)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <LayoutDashboard size={22} />
                <span style={{ fontSize: '10px' }}>Panel</span>
            </Link>
            <Link href="/trade/BTC-USD" style={{ color: pathname?.includes('/trade') ? 'var(--primary)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={22} />
                <span style={{ fontSize: '10px' }}>Piyasa</span>
            </Link>
            <Link href="/wallet" style={{ color: pathname === '/wallet' ? 'var(--primary)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Wallet size={22} />
                <span style={{ fontSize: '10px' }}>Cüzdan</span>
            </Link>
            <Link href="/kyc/status" style={{ color: pathname?.includes('/kyc') ? 'var(--primary)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <UserCircle size={22} />
                <span style={{ fontSize: '10px' }}>Profil</span>
            </Link>
        </div>
    );
}
