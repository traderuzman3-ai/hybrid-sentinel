'use client';

import { useState, useEffect } from 'react';
import { Star, Plus, X } from 'lucide-react';

export default function WatchlistManager() {
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [newSymbol, setNewSymbol] = useState('');

    useEffect(() => {
        // LocalStorage veya API'dan çek
        const saved = localStorage.getItem('user_watchlist');
        if (saved) setWatchlist(JSON.parse(saved));
        else setWatchlist(['BTC-USD', 'ETH-USD', 'THYAO.IS']);
    }, []);

    const addSymbol = () => {
        if (newSymbol && !watchlist.includes(newSymbol)) {
            const updated = [...watchlist, newSymbol.toUpperCase()];
            setWatchlist(updated);
            localStorage.setItem('user_watchlist', JSON.stringify(updated));
            setNewSymbol('');
        }
    };

    const removeSymbol = (s: string) => {
        const updated = watchlist.filter(item => item !== s);
        setWatchlist(updated);
        localStorage.setItem('user_watchlist', JSON.stringify(updated));
    };

    return (
        <div className="card glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={18} color="#f1c40f" fill="#f1c40f" /> İzleme Listelerim
                </h3>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input
                    className="input"
                    placeholder="Örn: AAPL-USD"
                    value={newSymbol}
                    onChange={e => setNewSymbol(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addSymbol()}
                    style={{ fontSize: '13px' }}
                />
                <button className="btn btn-primary" onClick={addSymbol} style={{ padding: '8px 12px' }}>
                    <Plus size={18} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {watchlist.map(s => (
                    <div key={s} className="watchlist-item" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }} onClick={() => window.location.href = `/trade/${s}`}>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{s}</span>
                        <X size={14} color="var(--text-secondary)" onClick={(e) => { e.stopPropagation(); removeSymbol(s); }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
