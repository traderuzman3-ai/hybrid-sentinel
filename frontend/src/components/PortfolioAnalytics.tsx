'use client';
import { useUser } from '../context/UserContext';

export default function PortfolioAnalytics() {
    const { balance, user } = useUser();

    // Simüle edilmiş portföy verileri (Emir motoru gelince gerçek olacak)
    const stats = [
        { label: 'Hesap Değeri', value: `${balance.toLocaleString()} ₺`, color: 'var(--primary)' },
        { label: 'Kullanılabilir', value: `${balance.toLocaleString()} ₺`, color: 'var(--text-main)' },
        { label: 'Açık Pozisyonlar', value: '0.00 ₺', color: 'var(--text-secondary)' },
        { label: 'Sağlık Skoru', value: '100%', color: 'var(--success)' }
    ];

    return (
        <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>Portföy Analitiği</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {stats.map((s, i) => (
                    <div key={i} style={{
                        padding: '16px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.03)'
                    }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{s.label}</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '24px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(76, 201, 240, 0.05)', fontSize: '12px', color: 'var(--primary)', textAlign: 'center' }}>
                📈 Portföyünüzün %100'ü nakitte. Fırsatları değerlendirmek için tarayıcıyı kullanın.
            </div>
        </div>
    );
}
