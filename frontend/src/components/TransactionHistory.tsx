'use client';

import { useEffect, useState } from 'react';

export default function TransactionHistory() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trade/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setOrders(data);
                }
            } catch (error) {
                console.error('History fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="p-4 text-text-secondary text-sm">Yükleniyor...</div>;

    if (orders.length === 0) return (
        <div className="p-8 text-center border border-dashed border-border rounded-lg text-text-muted">
            Henüz işlem geçmişi yok.
        </div>
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-text-secondary font-medium">
                    <tr>
                        <th className="p-3">Zaman</th>
                        <th className="p-3">Sembol</th>
                        <th className="p-3">İşlem</th>
                        <th className="p-3">Tip</th>
                        <th className="p-3 text-right">Adet</th>
                        <th className="p-3 text-right">Fiyat</th>
                        <th className="p-3 text-right">Durum</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-3 text-text-secondary font-mono-data text-xs">
                                {new Date(order.createdAt).toLocaleString('tr-TR')}
                            </td>
                            <td className="p-3 font-bold text-primary-navy">
                                {order.symbol}
                            </td>
                            <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.side === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {order.side === 'BUY' ? 'ALIŞ' : 'SATIŞ'}
                                </span>
                            </td>
                            <td className="p-3 text-xs text-text-secondary">
                                {order.type}
                            </td>
                            <td className="p-3 text-right font-mono-data">
                                {order.quantity}
                            </td>
                            <td className="p-3 text-right font-mono-data font-semibold">
                                {order.price ? order.price.toLocaleString('tr-TR') + ' ₺' : '-'}
                            </td>
                            <td className="p-3 text-right">
                                <span className={`text-[10px] font-bold ${order.status === 'FILLED' ? 'text-green-600' :
                                        order.status === 'PENDING' ? 'text-yellow-600' : 'text-gray-400'
                                    }`}>
                                    {order.status === 'FILLED' ? 'GERÇEKLEŞTİ' :
                                        order.status === 'PENDING' ? 'BEKLİYOR' : order.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
