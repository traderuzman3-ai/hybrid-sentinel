'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import {
    Wallet, ArrowDownCircle, ArrowUpCircle, Download, CreditCard, Bitcoin,
    History, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight,
    Building2, Copy, ExternalLink
} from 'lucide-react';
import MobileNav from '../../components/MobileNav';
import TransactionHistory from '../../components/TransactionHistory';

interface Transaction {
    id: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    createdAt: string;
}

export default function WalletPage() {
    const { user } = useUser();
    const [wallets, setWallets] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
    const [selectedCurrency, setSelectedCurrency] = useState('TRY');
    const [amount, setAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/ledger/wallets`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setWallets(data.wallets || []);

            // İşlem geçmişi
            const txRes = await fetch(`${API_URL}/ledger/transactions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (txRes.ok) {
                const txData = await txRes.json();
                setTransactions(txData.transactions || []);
            }
        } catch (error) {
            console.error('Wallet data fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setMessage({ type: 'error', text: 'Geçerli bir tutar giriniz.' });
            return;
        }
        setProcessing(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/ledger/deposit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    currency: selectedCurrency
                })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Para yatırma talebi oluşturuldu! Onay bekleniyor.' });
                setAmount('');
                fetchWalletData();
            } else {
                setMessage({ type: 'error', text: data.error || 'İşlem başarısız.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Bağlantı hatası.' });
        } finally {
            setProcessing(false);
        }
    };

    const handleWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setMessage({ type: 'error', text: 'Geçerli bir tutar giriniz.' });
            return;
        }
        setProcessing(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/ledger/withdraw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    currency: selectedCurrency
                })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Para çekme talebi oluşturuldu!' });
                setAmount('');
                fetchWalletData();
            } else {
                setMessage({ type: 'error', text: data.error || 'İşlem başarısız.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Bağlantı hatası.' });
        } finally {
            setProcessing(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle size={16} className="text-success" />;
            case 'PENDING': return <Clock size={16} className="text-amber-500" />;
            case 'REJECTED': return <XCircle size={16} className="text-danger" />;
            default: return <AlertCircle size={16} className="text-text-muted" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'Tamamlandı';
            case 'PENDING': return 'Beklemede';
            case 'REJECTED': return 'Reddedildi';
            case 'APPROVED': return 'Onaylandı';
            default: return status;
        }
    };

    const totalBalance = wallets.reduce((sum, w) => sum + (w.currency === 'TRY' ? w.balance : 0), 0);
    const tryWallet = wallets.find(w => w.currency === 'TRY');

    return (
        <div className="min-h-screen bg-bg-app p-4 lg:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-primary-navy">Cüzdanım</h1>
                        <p className="text-sm text-text-secondary">Varlıklarınızı yönetin, para yatırın veya çekin.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.open(`${API_URL}/ledger/export?token=${localStorage.getItem('token')}`, '_blank')}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-border-subtle rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                            <Download size={16} /> CSV İndir
                        </button>
                    </div>
                </div>

                {/* Bakiye Kartları */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {wallets.map(w => (
                        <div key={w.id} className="card-matte p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {w.currency === 'BTC' || w.currency === 'ETH' ?
                                        <Bitcoin size={20} className="text-amber-500" /> :
                                        <CreditCard size={20} className="text-primary" />
                                    }
                                    <span className="font-bold text-primary-navy">{w.currency}</span>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">Aktif</span>
                            </div>
                            <div className="text-2xl font-bold text-primary-navy font-mono-data">
                                {w.balance?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </div>
                            {(w.balance_t1 > 0 || w.balance_t2 > 0) && (
                                <div className="mt-2 text-xs text-text-muted">
                                    <span className="text-amber-600">T+1: {w.balance_t1?.toLocaleString()}</span>
                                    <span className="mx-2">|</span>
                                    <span className="text-orange-600">T+2: {w.balance_t2?.toLocaleString()}</span>
                                </div>
                            )}
                            {w.frozen > 0 && (
                                <div className="mt-2 text-xs text-danger">
                                    🔒 Dondurulmuş: {w.frozen.toLocaleString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Ana İçerik */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sol Panel - İşlem Formu */}
                    <div className="lg:col-span-2 card-matte p-0 overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-border-subtle">
                            <button
                                onClick={() => setActiveTab('deposit')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${activeTab === 'deposit'
                                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500'
                                    : 'text-text-secondary hover:bg-gray-50'
                                    }`}
                            >
                                <ArrowDownCircle size={18} /> Para Yatır
                            </button>
                            <button
                                onClick={() => setActiveTab('withdraw')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${activeTab === 'withdraw'
                                    ? 'bg-red-50 text-danger border-b-2 border-red-500'
                                    : 'text-text-secondary hover:bg-gray-50'
                                    }`}
                            >
                                <ArrowUpCircle size={18} /> Para Çek
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${activeTab === 'history'
                                    ? 'bg-blue-50 text-primary border-b-2 border-primary'
                                    : 'text-text-secondary hover:bg-gray-50'
                                    }`}
                            >
                                <History size={18} /> Geçmiş
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'deposit' && (
                                <div className="space-y-6">
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                        <h3 className="font-bold text-emerald-800 mb-2">💰 Banka Havalesi ile Yatırım</h3>
                                        <p className="text-sm text-emerald-700">Aşağıdaki hesaba havale/EFT yaparak bakiye yükleyebilirsiniz.</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-text-secondary">Banka</span>
                                            <span className="font-medium flex items-center gap-2">
                                                <Building2 size={16} /> Ziraat Bankası
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-text-secondary">IBAN</span>
                                            <span className="font-mono text-sm flex items-center gap-2">
                                                TR12 0001 0012 3456 7890 1234 56
                                                <button className="p-1 hover:bg-gray-200 rounded"><Copy size={14} /></button>
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-text-secondary">Alıcı</span>
                                            <span className="font-medium">Hybrid Sentinel A.Ş.</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-text-secondary">Açıklama</span>
                                            <span className="font-mono text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                                                HST-{user?.id?.slice(0, 8).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-text-secondary block mb-2">Yatırılacak Tutar</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="flex-1 px-4 py-3 border border-border-subtle rounded-lg text-lg font-mono-data focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <select
                                                value={selectedCurrency}
                                                onChange={(e) => setSelectedCurrency(e.target.value)}
                                                className="px-4 py-3 border border-border-subtle rounded-lg font-medium"
                                            >
                                                <option value="TRY">TRY</option>
                                                <option value="USD">USD</option>
                                            </select>
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-danger'}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleDeposit}
                                        disabled={processing}
                                        className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {processing ? 'İşleniyor...' : <><ArrowDownCircle size={20} /> Yatırım Talebini Gönder</>}
                                    </button>
                                </div>
                            )}

                            {activeTab === 'withdraw' && (
                                <div className="space-y-6">
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <h3 className="font-bold text-amber-800 mb-2">⚠️ Para Çekme Kuralları</h3>
                                        <ul className="text-sm text-amber-700 space-y-1">
                                            <li>• Minimum çekim: 100 TL</li>
                                            <li>• Çekim işlemleri 1-3 iş günü içinde tamamlanır</li>
                                            <li>• Sadece adınıza kayıtlı hesaplara çekim yapılabilir</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-text-secondary block mb-2">Kullanılabilir Bakiye</label>
                                        <div className="text-2xl font-bold text-primary-navy font-mono-data">
                                            {tryWallet?.balance?.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) || '0.00'} TRY
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-text-secondary block mb-2">Çekilecek Tutar</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="flex-1 px-4 py-3 border border-border-subtle rounded-lg text-lg font-mono-data focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <select
                                                value={selectedCurrency}
                                                onChange={(e) => setSelectedCurrency(e.target.value)}
                                                className="px-4 py-3 border border-border-subtle rounded-lg font-medium"
                                            >
                                                <option value="TRY">TRY</option>
                                            </select>
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-danger'}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleWithdraw}
                                        disabled={processing}
                                        className="w-full py-3 bg-danger text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {processing ? 'İşleniyor...' : <><ArrowUpCircle size={20} /> Çekim Talebini Gönder</>}
                                    </button>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div>
                                    {transactions.length > 0 ? (
                                        <div className="space-y-3">
                                            {transactions.map(tx => (
                                                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        {tx.type === 'DEPOSIT' ?
                                                            <ArrowDownCircle size={20} className="text-emerald-500" /> :
                                                            <ArrowUpCircle size={20} className="text-red-500" />
                                                        }
                                                        <div>
                                                            <div className="font-medium text-sm">
                                                                {tx.type === 'DEPOSIT' ? 'Para Yatırma' : 'Para Çekme'}
                                                            </div>
                                                            <div className="text-xs text-text-muted">
                                                                {new Date(tx.createdAt).toLocaleDateString('tr-TR')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`font-bold font-mono-data ${tx.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-danger'}`}>
                                                            {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount.toLocaleString()} {tx.currency}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs">
                                                            {getStatusIcon(tx.status)}
                                                            <span>{getStatusText(tx.status)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <History size={48} className="mx-auto text-text-muted opacity-30 mb-4" />
                                            <p className="text-text-secondary">Henüz işlem geçmişiniz bulunmuyor.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sağ Panel - Hızlı Bilgi */}
                    <div className="space-y-4">
                        <div className="card-matte p-4">
                            <h3 className="font-bold text-primary-navy mb-3">📊 Hesap Özeti</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-secondary">Toplam Varlık</span>
                                    <span className="font-bold font-mono-data">{totalBalance.toLocaleString('tr-TR')} ₺</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-secondary">Kullanılabilir</span>
                                    <span className="font-mono-data">{tryWallet ? (tryWallet.balance - tryWallet.frozen).toLocaleString('tr-TR') : 0} ₺</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-secondary">Dondurulmuş</span>
                                    <span className="font-mono-data text-amber-600">{tryWallet?.frozen?.toLocaleString('tr-TR') || 0} ₺</span>
                                </div>
                            </div>
                        </div>

                        <div className="card-matte p-4">
                            <h3 className="font-bold text-primary-navy mb-3">🔒 Güvenlik</h3>
                            <div className="text-sm text-text-secondary space-y-2">
                                <p>✅ 256-bit SSL şifreleme</p>
                                <p>✅ 2FA koruması {user?.isTwoFAEnabled ? 'Aktif' : 'Pasif'}</p>
                                <p>✅ Ayrılmış müşteri hesapları</p>
                            </div>
                        </div>

                        <div className="card-matte p-4 bg-gradient-to-br from-primary-navy to-primary text-white">
                            <h3 className="font-bold mb-2">💎 Pro'ya Yükselt</h3>
                            <p className="text-sm opacity-80 mb-3">Daha yüksek limitler ve özel özellikler.</p>
                            <button className="w-full py-2 bg-white text-primary-navy rounded-lg font-bold text-sm hover:bg-gray-100">
                                Detayları Gör
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden">
                    <MobileNav />
                </div>
            </div>

            {/* İşlem Geçmişi Tablosu */}
            <div className="card-matte p-6 border border-border-subtle rounded-xl shadow-sm bg-white">
                <h2 className="text-lg font-bold text-primary-navy mb-4 flex items-center gap-2">
                    <span className="p-1.5 bg-gray-100 rounded-md">📜</span>
                    Geçmiş İşlemlerim
                </h2>
                <TransactionHistory />
            </div>
        </div>
    );
}
