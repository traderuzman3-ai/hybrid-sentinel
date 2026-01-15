'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, FileCheck, Landmark, ShieldCheck } from 'lucide-react';

export default function KycTiers() {
    const [userTier, setUserTier] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Profil bilgisinden mevcut tier seviyesini çek
        const fetchTier = async () => {
            const res = await fetch('http://localhost:3001/auth/profile', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            const data = await res.json();
            setUserTier(data.kycTier || 0);
            setLoading(false);
        };
        fetchTier();
    }, []);

    const tiers = [
        {
            level: 1,
            name: "Starter (Gümüş)",
            icon: <TrendingUp size={24} color="#bdc3c7" />,
            requirements: "Kimlik Fotoğrafı + E-Posta",
            limits: "Günlük $10.000 Çekim",
            status: userTier >= 1 ? "active" : "available"
        },
        {
            level: 2,
            name: "Verified (Altın)",
            icon: <CheckCircle size={24} color="#f1c40f" />,
            requirements: "Biyometrik Canlılık + Adres Onayı",
            limits: "Günlük $50.000 Çekim + Kaldıraçlı İşlem",
            status: userTier >= 2 ? "active" : (userTier === 1 ? "available" : "locked")
        },
        {
            level: 3,
            name: "Institutional (VIP)",
            icon: <Landmark size={24} color="#9b59b6" />,
            requirements: "Varlık Beyanı + Manuel İnceleme",
            limits: "Günlük $500.000 Çekim + Özel OTC Masası",
            status: userTier >= 3 ? "active" : (userTier === 2 ? "available" : "locked")
        }
    ];

    return (
        <div className="container" style={{ paddingTop: '50px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Hesap Seviyeleri ve Limitler</h2>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {tiers.map((t) => (
                    <div key={t.level} className={`card ${t.status === 'active' ? 'border-primary' : ''}`} style={{
                        opacity: t.status === 'locked' ? 0.6 : 1,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {t.status === 'active' && (
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                right: '-30px',
                                backgroundColor: 'var(--success)',
                                color: 'white',
                                padding: '4px 30px',
                                transform: 'rotate(45deg)',
                                fontSize: '10px',
                                fontWeight: 'bold'
                            }}>AKTİF</div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                {t.icon}
                            </div>
                            <h3 style={{ fontSize: '18px' }}>{t.name}</h3>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>İŞLEM LİMİTLERİ</p>
                            <p style={{ fontWeight: '600', color: 'var(--primary)' }}>{t.limits}</p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>GEREKSİNİMLER</p>
                            <p style={{ fontSize: '14px' }}>{t.requirements}</p>
                        </div>

                        <button
                            className={`btn ${t.status === 'active' ? 'btn-success' : (t.status === 'locked' ? 'btn-secondary' : 'btn-primary')}`}
                            style={{ width: '100%' }}
                            disabled={t.status !== 'available'}
                            onClick={() => t.status === 'available' && (window.location.href = '/kyc/advanced')}
                        >
                            {t.status === 'active' ? 'Aktif Seviye' : (t.status === 'locked' ? 'Sırayla İlerle' : 'Seviye Atla')}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Simple Helper for CheckCircle which was missing in imports
function CheckCircle({ size, color }: { size: number, color: string }) {
    return <div style={{ color }}><ShieldCheck size={size} /></div>;
}
