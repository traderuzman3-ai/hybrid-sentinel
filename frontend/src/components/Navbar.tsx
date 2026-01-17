'use client';

import Link from 'next/link';
import { useUser } from '../context/UserContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user, balance, logout } = useUser();
    const pathname = usePathname();

    if (!user && !pathname.startsWith('/auth') && pathname !== '/') return null;

    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '64px',
            zIndex: 1000,
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px'
        }}>
            <Link href="/dashboard" style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'var(--primary)',
                textDecoration: 'none',
                marginRight: '40px'
            }}>
                ANTIGRAVITY <span style={{ color: 'var(--text-main)', fontSize: '14px' }}>TRADER</span>
            </Link>

            {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
                    <Link href="/dashboard" className={pathname === '/dashboard' ? 'active-link' : 'nav-link'}>Dashboard</Link>
                    <Link href="/wallet" className={pathname === '/wallet' ? 'active-link' : 'nav-link'}>Cüzdan</Link>
                    <Link href="/kyc" className={pathname === '/kyc' ? 'active-link' : 'nav-link'}>KYC</Link>
                    {user.isAdmin && (
                        <div style={{ display: 'flex', gap: '16px', marginLeft: '16px', paddingLeft: '16px', borderLeft: '1px solid var(--border)' }}>
                            <Link href="/admin/kyc" className={pathname === '/admin/kyc' ? 'active-link' : 'nav-link'} style={{ color: 'var(--warning)' }}>Admin KYC</Link>
                            <Link href="/admin/price-control" className={pathname === '/admin/price-control' ? 'active-link' : 'nav-link'} style={{ color: 'var(--warning)' }}>Fiyat Kontrol</Link>
                            <Link href="/admin/ledger" className={pathname === '/admin/ledger' ? 'active-link' : 'nav-link'} style={{ color: 'var(--warning)' }}>Talepler</Link>
                        </div>
                    )}
                    {/* Live Support Button */}
                    <a
                        href="/support"
                        className="hidden md:flex relative items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-xs shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
                        style={{
                            boxShadow: '0 0 15px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.3)',
                            animation: 'neonPulse 2s ease-in-out infinite',
                            marginLeft: 'auto',
                            textDecoration: 'none'
                        }}
                    >
                        <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-emerald-400 to-green-400 opacity-50 blur-sm animate-pulse"></span>
                        <span className="relative flex items-center gap-1.5">
                            <span className="text-sm">🎧</span>
                            <span>Canlı Destek</span>
                        </span>
                    </a>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {user ? (
                    <>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bakiye</div>
                            <div style={{ fontWeight: 'bold' }}>{balance.toLocaleString()} ₺</div>
                        </div>
                        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '14px', fontWeight: '500' }}>{user.firstName || 'Kullanıcı'}</div>
                                <div style={{ fontSize: '10px', color: user.isAdmin ? 'var(--warning)' : 'var(--success)' }}>
                                    {user.isAdmin ? 'ADMİN' : 'ONAYLI HESAP'}
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--danger)',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Çıkış
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href="/auth/login"><button className="btn btn-secondary">Giriş</button></Link>
                        <Link href="/auth/register"><button className="btn btn-primary">Kayıt Ol</button></Link>
                    </div>
                )}
            </div>

            <style jsx>{`
        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--text-main);
        }
        .active-link {
          color: var(--primary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
        </nav >
    );
}
