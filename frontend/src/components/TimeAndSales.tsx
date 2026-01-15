'use client';

export default function TimeAndSales({ trades }: { trades: any[] }) {
    if (!trades) return null;

    return (
        <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>Canlı İşlem Akışı (Tape)</h3>
            <div style={{ maxHeight: '250px', overflowY: 'auto', fontSize: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '8px 4px' }}>Saat</th>
                            <th style={{ padding: '8px 4px' }}>Fiyat</th>
                            <th style={{ padding: '8px 4px', textAlign: 'right' }}>Miktar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((trade) => (
                            <tr key={trade.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '6px 4px', color: 'var(--text-secondary)' }}>{trade.time}</td>
                                <td style={{ padding: '6px 4px', fontWeight: 'bold', color: trade.side === 'BUY' ? 'var(--success)' : 'var(--danger)' }}>
                                    {trade.price.toLocaleString()}
                                </td>
                                <td style={{ padding: '6px 4px', textAlign: 'right' }}>{trade.amount.toFixed(4)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
