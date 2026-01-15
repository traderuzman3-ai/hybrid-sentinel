'use client';
import { useUser } from '../context/UserContext';

export default function PortfolioAnalytics() {
    const { balance, user } = useUser();

    // Simüle edilmiş portföy verileri (Emir motoru gelince gerçek olacak)
    const stats = [
        { label: 'Hesap Değeri', value: `${balance.toLocaleString()} ₺`, color: 'var(--primary-navy)' },
        { label: 'Kullanılabilir', value: `${balance.toLocaleString()} ₺`, color: 'var(--success)' },
        { label: 'Açık Pozisyonlar', value: '0.00 ₺', color: 'var(--text-secondary)' },
        { label: 'Sağlık Skoru', value: '100%', color: 'var(--success)' }
    ];

    return (
        <div className="card-matte">
            <h3 className="card-header border-none p-0 mb-4 text-base">Portföy Analitiği</h3>
            <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-xs text-text-secondary mb-1">{s.label}</div>
                        <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>
            <div className="mt-6 p-3 rounded-md bg-blue-50 text-xs text-primary-blue text-center font-medium border border-blue-100">
                📈 Portföyünüzün %100'ü nakitte. Fırsatları değerlendirmek için tarayıcıyı kullanın.
            </div>
        </div>
    );
}
