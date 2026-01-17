'use client';

import { useState, useEffect } from 'react';
import { Users, Edit, Trash2, CheckCircle, XCircle, Search, ShieldAlert, DollarSign } from 'lucide-react';

interface User {
    id: string;
    email: string;
    fullName: string;
    kycStatus: string;
    lastLogin: string;
    wallets: MockWallet[];
}

interface MockWallet {
    currency: string;
    balance: number;
}

export default function UserMonitor() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editBalance, setEditBalance] = useState({ currency: 'TRY', amount: 0 });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            // Mocking the fetch for now as I build the UI first
            // In real scenario: const res = await fetch('/api/admin/users', ...);

            // Mock Data for "God Mode" Preview
            setUsers([
                {
                    id: '1', email: 'test@user.com', fullName: 'Demo Trader',
                    kycStatus: 'APPROVED', lastLogin: new Date().toISOString(),
                    wallets: [{ currency: 'TRY', balance: 150000 }, { currency: 'USD', balance: 10000 }]
                },
                {
                    id: '2', email: 'whale@bist.com', fullName: 'Big Whale',
                    kycStatus: 'PENDING', lastLogin: new Date(Date.now() - 3600000).toISOString(),
                    wallets: [{ currency: 'TRY', balance: 5000000 }, { currency: 'USD', balance: 250000 }]
                }
            ]);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApproveKYC = async (userId: string) => {
        // Logic to force approve KYC
        alert(`User ${userId} KYC Forces Approved!`);
    };

    const handleUpdateBalance = async () => {
        if (!selectedUser) return;
        // Logic to update balance
        alert(`${selectedUser.fullName} balance updated: +${editBalance.amount} ${editBalance.currency}`);
        setSelectedUser(null);
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Kullanıcı Monitörü</h2>
                        <p className="text-sm text-gray-500">Aktif Yatırımcılar ve Bakiyeler</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Kullanıcı Ara..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
                            <th className="p-4">Kullanıcı</th>
                            <th className="p-4">Durum (KYC)</th>
                            <th className="p-4">Son Görülme</th>
                            <th className="p-4 text-right">TRY Bakiye</th>
                            <th className="p-4 text-right">USD Bakiye</th>
                            <th className="p-4 text-center">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-gray-900">{user.fullName}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.kycStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            user.kycStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {user.kycStatus}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 font-mono text-xs">
                                    {new Date(user.lastLogin).toLocaleString('tr-TR')}
                                </td>
                                <td className="p-4 text-right font-mono font-bold text-gray-800">
                                    {user.wallets.find(w => w.currency === 'TRY')?.balance.toLocaleString()} ₺
                                </td>
                                <td className="p-4 text-right font-mono font-bold text-green-600">
                                    {user.wallets.find(w => w.currency === 'USD')?.balance.toLocaleString()} $
                                </td>
                                <td className="p-4 flex justify-center gap-2">
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 tooltip"
                                        title="Bakiye Düzenle"
                                    >
                                        <DollarSign size={16} />
                                    </button>
                                    {user.kycStatus !== 'APPROVED' && (
                                        <button
                                            onClick={() => handleApproveKYC(user.id)}
                                            className="p-2 hover:bg-green-100 rounded-lg text-green-600 tooltip"
                                            title="KYC Onayla"
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                    )}
                                    <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 tooltip" title="Banla">
                                        <ShieldAlert size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* BALANCE EDIT MODAL */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-[400px]">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Edit size={20} className="text-primary" />
                            Bakiye Düzenle: {selectedUser.fullName}
                        </h3>

                        <div className="bg-amber-50 p-3 rounded-lg text-xs text-amber-800 mb-4 border border-amber-200">
                            Dikkat: Buradan yapılan bakiye değişimleri anında cüzdana yansır.
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Para Birimi</label>
                                <select
                                    className="w-full border rounded p-2"
                                    value={editBalance.currency}
                                    onChange={e => setEditBalance({ ...editBalance, currency: e.target.value })}
                                >
                                    <option value="TRY">TRY (Türk Lirası)</option>
                                    <option value="USD">USD (Dolar)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tutar (+/-)</label>
                                <input
                                    type="number"
                                    className="w-full border rounded p-2"
                                    placeholder="Örn: 50000 veya -1000"
                                    onChange={e => setEditBalance({ ...editBalance, amount: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="flex-1 py-2 border rounded-lg hover:bg-gray-50 font-medium"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleUpdateBalance}
                                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-bold shadow-lg shadow-primary/30"
                            >
                                Onayla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
