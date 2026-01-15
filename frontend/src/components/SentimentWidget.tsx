'use client';

export default function SentimentWidget({ sentiment }: { sentiment: any }) {
    return (
        <div className="card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Korku ve Açgözlülük İndeksi</h3>
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke={sentiment.color}
                        strokeWidth="8"
                        strokeDasharray={`${sentiment.value * 2.8} 283`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.5s ease' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{sentiment.value}</div>
                    <div style={{ fontSize: '10px', color: sentiment.color, fontWeight: 'bold' }}>{sentiment.label}</div>
                </div>
            </div>
        </div>
    );
}
