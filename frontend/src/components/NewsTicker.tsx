'use client';

export default function NewsTicker({ news }: { news: any[] }) {
    return (
        <div className="glass" style={{
            padding: '12px 24px',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            overflow: 'hidden',
            marginBottom: '32px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{
                backgroundColor: 'var(--primary)',
                color: 'black',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
            }}>
                SON DAKİKA
            </div>
            <div style={{ display: 'flex', gap: '40px', animation: 'ticker 30s linear infinite' }}>
                {news.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '13px' }}>{item.content}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.timestamp}</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
}
