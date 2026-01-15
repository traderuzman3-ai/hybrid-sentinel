'use client';

export default function MarketHeatmap({ data }: { data: any[] }) {
    if (!data) return null;

    return (
        <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>Piyasa Isı Haritası (Heatmap)</h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '8px',
                maxHeight: '400px',
                overflowY: 'auto'
            }}>
                {data.sort((a, b) => b.weight - a.weight).map((item) => (
                    <div key={item.symbol} style={{
                        backgroundColor: item.color,
                        borderRadius: '6px',
                        padding: '12px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: `${60 * item.weight}px`,
                        transition: 'transform 0.2s',
                        cursor: 'default',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}
                        className="heatmap-item"
                    >
                        <span style={{ fontWeight: 'bold', fontSize: '13px', color: 'white' }}>{item.symbol}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
                            {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
            <style jsx>{`
        .heatmap-item:hover {
          transform: scale(1.05);
          z-index: 10;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
      `}</style>
        </div>
    );
}
