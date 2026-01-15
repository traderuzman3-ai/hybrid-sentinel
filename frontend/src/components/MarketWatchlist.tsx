'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MarketWatchlist() {
    const [marketData, setMarketData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // WebSocket Connection
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const wsUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
        const ws = new WebSocket(`${wsUrl}/market/ws`);

        ws.onmessage = (event) => {
            const payload = JSON.parse(event.data);
            if (payload.type === 'MARKET_UPDATE') {
                setMarketData(payload.data);
                setLoading(false);
            }
        };

        return () => ws.close();
    }, []);

    if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '40px', textAlign: 'center' }}>Piyasa verileri yükleniyor...</div>;

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Piyasa İzleme Listesi</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(76, 201, 240, 0.1)', color: 'var(--primary)' }}>Canlı</span>
                    <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>BIST / Kripto / ABD</span>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '13px' }}>
                            <th style={{ padding: '16px' }}>Varlık</th>
                            <th style={{ padding: '16px' }}>Fiyat</th>
                            <th style={{ padding: '16px' }}>24s Değişim</th>
                            <th style={{ padding: '16px' }}>Hacim</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marketData.map((item) => (
                            <tr key={item.symbol} className="table-row" style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '12px',
                                            color: 'var(--primary)'
                                        }}>
                                            {item.symbol.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{item.symbol.replace('-USD', '').replace('.IS', '')}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.source}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', fontWeight: 'bold', fontSize: '15px' }}>
                                    {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                    <span style={{ fontSize: '11px', marginLeft: '4px', color: 'var(--text-secondary)' }}>
                                        {item.symbol.includes('.IS') ? '₺' : '$'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        color: item.changePercent >= 0 ? 'var(--success)' : 'var(--danger)',
                                        backgroundColor: item.changePercent >= 0 ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}>
                                        {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                                    </span>
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                    {item.volume.toLocaleString()}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <Link href={`/trade/${item.symbol}`}>
                                        <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>AL/SAT</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .table-row:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
        .badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
      `}</style>
        </div>
    );
}
