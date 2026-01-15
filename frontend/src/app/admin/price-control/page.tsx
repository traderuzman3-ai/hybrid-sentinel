'use client';

import { useState, useEffect } from 'react';

export default function PriceControlPage() {
    const [prices, setPrices] = useState<any[]>([]);
    const [symbol, setSymbol] = useState('BTCUSDT');
    const [price, setPrice] = useState('');
    const [spread, setSpread] = useState('0.001');
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchPrices(); }, []);

    const fetchPrices = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/prices`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPrices(data);
        } catch (err) { }
    };

    const handleOverride = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/prices/override`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    symbol,
                    overridePrice: parseFloat(price),
                    spread: parseFloat(spread)
                })
            });
            fetchPrices();
            setPrice('');
        } catch (err) { } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <h1 style={{ marginBottom: '24px' }}>Admin - Fiyat Kontrol Paneli</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <div className="card">
                    <h2 style={{ marginBottom: '16px' }}>Fiyat Manipülasyonu</h2>
                    <form onSubmit={handleOverride}>
                        <div style={{ marginBottom: '16px' }}>
                            <label className="label">Sembol</label>
                            <input className="input" value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="BTCUSDT" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label className="label">Yeni Fiyat</label>
                            <input className="input" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" step="any" />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label className="label">Spread (%)</label>
                            <input className="input" type="number" value={spread} onChange={e => setSpread(e.target.value)} step="0.0001" />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Güncelleniyor...' : 'Fiyatı Sabitle'}
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h2 style={{ marginBottom: '16px' }}>Aktif Override Listesi</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '12px' }}>Sembol</th>
                                <th style={{ padding: '12px' }}>Override Fiyat</th>
                                <th style={{ padding: '12px' }}>Spread</th>
                                <th style={{ padding: '12px' }}>Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prices.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '12px' }}>{p.symbol}</td>
                                    <td style={{ padding: '12px' }}>{p.overridePrice.toLocaleString()}</td>
                                    <td style={{ padding: '12px' }}>{p.spread}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ color: p.isActive ? 'var(--success)' : 'var(--danger)' }}>
                                            {p.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
