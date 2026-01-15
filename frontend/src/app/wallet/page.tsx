'use client';

import { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Download, CreditCard, Bitcoin } from 'lucide-react';

export default function WalletPage() {
    const [wallets, setWallets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        const res = await fetch('http://localhost:3001/ledger/wallets', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const data = await res.json();
        setWallets(data.wallets || []);
        setLoading(false);
    };

    const handleExport = () => {
        window.open('http://localhost:3001/ledger/export?accessToken=' + localStorage.getItem('accessToken'), '_blank');
    };

    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Cüzdanlarım</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Varlıklarınızı yönetin ve işlem dökümü alın.</p>
                </div>
                <button className="btn btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={18} /> Hesap Özeti (CSV)
                </button>
            </div>

            <div className="grid">
                {wallets.length > 0 ? wallets.map(w => (
                    <div key={w.id} className="card glass-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {w.currency === 'BTC' || w.currency === 'ETH' ? <Bitcoin color="#f1c40f" /> : <CreditCard color="#3498db" />}
                                <span style={{ fontWeight: '700', fontSize: '18px' }}>{w.currency}</span>
                            </div>
                            <span className="badge badge-success">Aktif</span>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>TOPLAM BAKİYE</p>
                            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{w.balance.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{w.currency}</span></h2>
                        </div>

                        {w.frozen > 0 && (
                            <div style={{ marginBottom: '24px', padding: '12px', backgroundColor: 'rgba(231, 76, 60, 0.05)', borderRadius: '12px', border: '1px solid rgba(231, 76, 60, 0.2)' }}>
                                <p style={{ fontSize: '11px', color: 'var(--danger)', marginBottom: '2px' }}>DONDURULMUŞ (EMİRDE)</p>
                                <p style={{ fontWeight: '600', fontSize: '14px' }}>{w.frozen.toLocaleString()} {w.currency}</p>
                            </div>
                        )}

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <button className="btn btn-primary" style={{ fontSize: '13px' }}>Yatır</button>
                            <button className="btn btn-secondary" style={{ fontSize: '13px' }}>Çek</button>
                        </div>
                    </div>
                )) : (
                    <div className="card" style={{ gridColumn: '1/4', textAlign: 'center', padding: '60px' }}>
                        <Wallet size={48} color="var(--text-secondary)" style={{ marginBottom: '16px', opacity: 0.3 }} />
                        <p style={{ color: 'var(--text-secondary)' }}>Henüz bir varlığınız bulunmuyor. İlk yatırımınızı yaparak ticarete başlayın.</p>
                        <button className="btn btn-primary" style={{ marginTop: '20px' }}>Para Yatır</button>
                    </div>
                )}
            </div>
        </div>
    );
}
