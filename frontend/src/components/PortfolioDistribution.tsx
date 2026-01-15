'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function PortfolioDistribution() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        fetchDistribution();
    }, []);

    const fetchDistribution = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${baseUrl}/ledger/wallets`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const { wallets } = await res.json();

        // Değerleri TRY karşılığına çevir (Basit simülasyon)
        const chartData = wallets.map((w: any) => ({
            name: w.currency,
            value: w.balance * (w.currency === 'BTC' ? 3000000 : (w.currency === 'USD' ? 35 : 1))
        })).filter((w: any) => w.value > 0);

        setData(chartData);
    };

    const COLORS = ['#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e74c3c'];

    return (
        <div className="card glass-card" style={{ height: '400px', padding: '24px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '16px' }}>Varlık Dağılımı (Sektörel)</h3>
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
