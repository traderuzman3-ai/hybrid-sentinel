'use client';

export default function MarketScanner({ scanData }: { scanData: any[] }) {
    if (!scanData) return null;

    return (
        <div className="card">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--primary)' }}>🛰️</span> AI Piyasa Tarayıcı (Fırsatlar)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {scanData.filter(s => s.signal !== "IZLE").slice(0, 5).map(s => (
                    <div key={s.symbol} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        borderLeft: `3px solid ${s.signal.includes('AL') ? 'var(--success)' : 'var(--danger)'}`
                    }}>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.symbol.replace('-USD', '').replace('.IS', '')}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>RSI: {s.rsi}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                color: s.signal.includes('AL') ? 'var(--success)' : 'var(--danger)',
                                fontWeight: 'bold',
                                fontSize: '12px'
                            }}>
                                {s.signal}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Trend: {s.trend}</div>
                        </div>
                    </div>
                ))}
                {scanData.filter(s => s.signal !== "IZLE").length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', padding: '10px' }}>
                        Şu an ekstrem bir alım/satım fırsatı bulunmuyor.
                    </p>
                )}
            </div>
        </div>
    );
}
