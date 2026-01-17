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

    const [activeTab, setActiveTab] = useState('BIST_30'); // Default to BIST 30 for cleaner start
    const [searchQuery, setSearchQuery] = useState('');

    const BIST_30_SYMBOLS = [
        'AKBNK.IS', 'ALARK.IS', 'ARCLK.IS', 'ASELS.IS', 'ASTOR.IS', 'BIMAS.IS', 'BRSAN.IS', 'DOHOL.IS', 'EKGYO.IS', 'ENKAI.IS',
        'EREGL.IS', 'FROTO.IS', 'GARAN.IS', 'GUBRF.IS', 'HEKTS.IS', 'ISCTR.IS', 'KCHOL.IS', 'KONTR.IS', 'KOZAL.IS', 'KRDMD.IS',
        'ODAS.IS', 'OYAKC.IS', 'PETKM.IS', 'PGSUS.IS', 'SAHOL.IS', 'SASA.IS', 'SISE.IS', 'TAVHL.IS', 'TCELL.IS', 'THYAO.IS',
        'TOASO.IS', 'TSKB.IS', 'TTKOM.IS', 'TUPRS.IS', 'VAKBN.IS', 'VESTL.IS', 'YKBNK.IS'
    ];

    const tabs = [
        { id: 'ALL', label: 'Tümü' },
        { id: 'BIST_30', label: 'BIST 30' },
        { id: 'BIST', label: 'BIST 100' }, // Mapping 'BIST' type to BIST 100 label for simplicity
        { id: 'US_STOCK', label: 'ABD Borsaları' },
        { id: 'CRYPTO', label: 'Kripto' },
        { id: 'COMMODITY', label: 'Emtia' },
        { id: 'FOREX', label: 'Döviz' },
    ];

    const filteredData = marketData.filter(item => {
        let matchesTab = true;

        if (activeTab === 'ALL') {
            matchesTab = true;
        } else if (activeTab === 'BIST_30') {
            matchesTab = item.type === 'BIST' && BIST_30_SYMBOLS.includes(item.symbol);
        } else if (activeTab === 'BIST') {
            matchesTab = item.type === 'BIST';
        } else {
            matchesTab = item.type === activeTab;
        }

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = item.symbol.toLowerCase().includes(searchLower) ||
            (item.description && item.description.toLowerCase().includes(searchLower));
        return matchesTab && matchesSearch;
    });

    if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '40px', textAlign: 'center' }}>Piyasa verileri yükleniyor...</div>;

    return (
        <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Piyasa İzleme Listesi</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="badge" style={{ backgroundColor: 'rgba(76, 201, 240, 0.1)', color: 'var(--primary)' }}>Canlı</span>
                    </div>
                </div>

                {/* Arama Çubuğu */}
                <input
                    type="text"
                    placeholder="Hisse veya şirket ara... (Örn: THYAO, Apple)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        color: 'var(--text)',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: activeTab === tab.id ? '#000' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
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
                            <th style={{ padding: '16px' }}>PD</th>
                            <th style={{ padding: '16px' }}>F/K</th>
                            <th style={{ padding: '16px' }}>RSI</th>
                            <th style={{ padding: '16px' }}>Sinyal</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
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
                                            {item.symbol.substring(0, 1)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{item.symbol.replace('-USD', '').replace('.IS', '')}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.description || item.source}
                                            </div>
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
                                    {(item.volume / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                    {item.marketCap ? (item.marketCap / 1000000000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'Mr' : '-'}
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                    {item.pe ? item.pe.toFixed(1) : '-'}
                                </td>
                                <td style={{ padding: '16px', fontSize: '13px', fontWeight: '600' }}>
                                    <span style={{ color: (item.rsi || 50) > 70 ? 'var(--danger)' : (item.rsi || 50) < 30 ? 'var(--success)' : 'var(--text-secondary)' }}>
                                        {item.rsi ? item.rsi.toFixed(1) : '-'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    {item.signal && (
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: item.signal === 'BUY' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                                            color: item.signal === 'BUY' ? 'var(--success)' : 'var(--danger)'
                                        }}>
                                            {item.signal === 'BUY' ? 'AL' : 'SAT'}
                                        </span>
                                    )}
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
