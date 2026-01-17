'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import {
    Receipt, Clock, CheckCircle, XCircle, AlertCircle, ChevronDown,
    TrendingUp, TrendingDown, X, Filter, RefreshCw
} from 'lucide-react';

interface Order {
    id: string;
    symbol: string;
    type: string;
    side: string;
    quantity: number;
    price: number | null;
    status: string;
    createdAt: string;
    filledAt: string | null;
}

export default function OrdersPage() {
    const { user } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'filled' | 'cancelled'>('all');
    const [cancelling, setCancelling] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/trade/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Orders fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId: string) => {
        setCancelling(orderId);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/trade/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Cancel order error:', error);
        } finally {
            setCancelling(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'PENDING': 'bg-amber-100 text-amber-700',
            'FILLED': 'bg-emerald-100 text-emerald-700',
            'PARTIALLY_FILLED': 'bg-blue-100 text-blue-700',
            'CANCELLED': 'bg-gray-100 text-gray-600',
            'REJECTED': 'bg-red-100 text-red-700'
        };
        const labels: Record<string, string> = {
            'PENDING': 'Beklemede',
            'FILLED': 'Gerçekleşti',
            'PARTIALLY_FILLED': 'Kısmi',
            'CANCELLED': 'İptal',
            'REJECTED': 'Reddedildi'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'open') return order.status === 'PENDING';
        if (filter === 'filled') return order.status === 'FILLED' || order.status === 'PARTIALLY_FILLED';
        if (filter === 'cancelled') return order.status === 'CANCELLED' || order.status === 'REJECTED';
        return true;
    });

    const openOrders = orders.filter(o => o.status === 'PENDING').length;
    const filledOrders = orders.filter(o => o.status === 'FILLED').length;

    return (
        <div className="min-h-screen bg-bg-app p-4 lg:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-primary-navy">Emirlerim</h1>
                        <p className="text-sm text-text-secondary">Tüm alım/satım emirlerinizi takip edin.</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-border-subtle rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                        <RefreshCw size={16} /> Yenile
                    </button>
                </div>

                {/* İstatistik Kartları */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="card-matte p-4">
                        <div className="text-xs text-text-muted mb-1">Toplam Emir</div>
                        <div className="text-2xl font-bold text-primary-navy">{orders.length}</div>
                    </div>
                    <div className="card-matte p-4">
                        <div className="text-xs text-text-muted mb-1">Açık Emirler</div>
                        <div className="text-2xl font-bold text-amber-600">{openOrders}</div>
                    </div>
                    <div className="card-matte p-4">
                        <div className="text-xs text-text-muted mb-1">Gerçekleşen</div>
                        <div className="text-2xl font-bold text-emerald-600">{filledOrders}</div>
                    </div>
                    <div className="card-matte p-4">
                        <div className="text-xs text-text-muted mb-1">İptal/Red</div>
                        <div className="text-2xl font-bold text-gray-500">
                            {orders.filter(o => o.status === 'CANCELLED' || o.status === 'REJECTED').length}
                        </div>
                    </div>
                </div>

                {/* Filtreler */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {[
                        { key: 'all', label: 'Tümü' },
                        { key: 'open', label: 'Açık Emirler' },
                        { key: 'filled', label: 'Gerçekleşenler' },
                        { key: 'cancelled', label: 'İptaller' }
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === f.key
                                    ? 'bg-primary text-white'
                                    : 'bg-white border border-border-subtle text-text-secondary hover:bg-gray-50'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Emir Tablosu */}
                <div className="card-matte overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <RefreshCw size={32} className="mx-auto text-primary animate-spin mb-4" />
                            <p className="text-text-secondary">Emirler yükleniyor...</p>
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-border-subtle">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase">Tarih</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase">Sembol</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase">Yön</th>
                                        <th className="text-left px-4 py-3 text-xs font-bold text-text-muted uppercase">Tip</th>
                                        <th className="text-right px-4 py-3 text-xs font-bold text-text-muted uppercase">Miktar</th>
                                        <th className="text-right px-4 py-3 text-xs font-bold text-text-muted uppercase">Fiyat</th>
                                        <th className="text-center px-4 py-3 text-xs font-bold text-text-muted uppercase">Durum</th>
                                        <th className="text-center px-4 py-3 text-xs font-bold text-text-muted uppercase">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order.id} className="border-b border-border-subtle hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                                </div>
                                                <div className="text-xs text-text-muted">
                                                    {new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-bold text-primary-navy">{order.symbol.replace('.IS', '')}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`flex items-center gap-1 font-medium ${order.side === 'BUY' ? 'text-emerald-600' : 'text-danger'}`}>
                                                    {order.side === 'BUY' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                    {order.side === 'BUY' ? 'AL' : 'SAT'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-text-secondary">{order.type}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-mono-data font-medium">{order.quantity}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-mono-data">
                                                    {order.price ? `${order.price.toLocaleString('tr-TR')} ₺` : 'PİYASA'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {order.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => cancelOrder(order.id)}
                                                        disabled={cancelling === order.id}
                                                        className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="İptal Et"
                                                    >
                                                        {cancelling === order.id ? (
                                                            <RefreshCw size={16} className="animate-spin" />
                                                        ) : (
                                                            <X size={16} />
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Receipt size={48} className="mx-auto text-text-muted opacity-30 mb-4" />
                            <p className="text-text-secondary">
                                {filter === 'all' ? 'Henüz emir bulunmuyor.' : 'Bu filtreye uygun emir yok.'}
                            </p>
                            <a href="/dashboard" className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                                İşlem Yap
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
