
'use client';

import AccountSwitch from '../../components/AccountSwitch';
import { MarketChart } from '../../components/MarketChart';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useMarket } from '../../context/MarketContext';
import { useRouter } from 'next/navigation';
import { useDeviceType } from '../../hooks/useDeviceType';
import OrderForm from '../../components/OrderForm';
import TradeSidebar from '../../components/TradeSidebar';
import MobileNav from '../../components/MobileNav';
import MarketDepth from '../../components/MarketDepth';
import AlarmList from '../../components/AlarmList';
import { Bell } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useUser();
    const { marketData, isConnected } = useMarket();
    const router = useRouter();
    const [activeSymbol, setActiveSymbol] = useState('ASELS.IS');

    // Cihaz Algılama
    const { isDesktop } = useDeviceType();
    const [showMobileChart, setShowMobileChart] = useState(false);
    const [showAlarms, setShowAlarms] = useState(false);

    useEffect(() => {
        if (user && user.accountType === 'REAL' && user.kycStatus === 'NOT_SUBMITTED') {
            router.push('/kyc');
        }
    }, [user, router]);

    // Get TRY wallet
    const tryWallet = user?.wallets?.find((w: any) => w.currency === 'TRY');
    const balance = tryWallet ? tryWallet.balance : 0;
    const available = tryWallet ? (tryWallet.balance - tryWallet.frozen) : 0;

    const activeData = marketData[activeSymbol] || {
        price: 0,
        changePercent: 0,
        high: 0,
        low: 0,
        volume: 0
    };

    // Chart Data - API'den çekiliyor
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartLoading, setChartLoading] = useState(true);
    const [chartRange, setChartRange] = useState('1mo');

    // Hisse değiştiğinde veya range değiştiğinde geçmiş veriyi çek
    useEffect(() => {
        const fetchHistory = async () => {
            setChartLoading(true);
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                // chartRange formatı: "range|interval" örn: "1d|5m"
                const [range, interval] = chartRange.includes('|')
                    ? chartRange.split('|')
                    : [chartRange, '1d'];
                const res = await fetch(`${API_URL}/market/history/${activeSymbol}?range=${range}&interval=${interval}`);
                const data = await res.json();

                if (data.candles && data.candles.length > 0) {
                    setChartData(data.candles);
                }
            } catch (error) {
                console.error('Chart data fetch error:', error);
            } finally {
                setChartLoading(false);
            }
        };

        fetchHistory();
    }, [activeSymbol, chartRange]);

    return (
        <div className="flex h-screen bg-bg-app overflow-hidden">
            {/* LEFT SIDEBAR (SOL TARAF AYNASI) */}
            <div className="hidden lg:block h-full">
                <TradeSidebar onSelectSymbol={setActiveSymbol} activeSymbol={activeSymbol} />
            </div>

            <main className="flex-1 flex flex-col min-w-0 p-2 gap-2 overflow-y-auto">

                {/* KYC Banner */}
                {user && user.kycStatus !== 'APPROVED' && user.accountType === 'REAL' && (
                    <div className={`rounded-md px-4 py-3 flex items-center justify-between shadow-sm ${user.kycStatus === 'PENDING' ? 'bg-blue-50 border border-blue-200 text-blue-800' :
                        user.kycStatus === 'REJECTED' ? 'bg-red-50 border border-red-200 text-red-800' :
                            'bg-amber-50 border border-amber-200 text-amber-800'
                        }`}>
                        <div className="flex items-center gap-3">
                            <span className="text-xl">
                                {user.kycStatus === 'PENDING' ? '⏳' : user.kycStatus === 'REJECTED' ? '❌' : '🛡️'}
                            </span>
                            <div>
                                <div className="font-bold text-sm">
                                    {user.kycStatus === 'PENDING' ? 'Kimlik Doğrulaması İnceleniyor' :
                                        user.kycStatus === 'REJECTED' ? 'Kimlik Doğrulaması Reddedildi' :
                                            'Hesabınızı onaylatmanız gerekiyor'}
                                </div>
                            </div>
                        </div>
                        {user.kycStatus !== 'PENDING' && (
                            <a href="/kyc" className="px-4 py-2 bg-white border border-current rounded text-sm font-bold hover:opacity-80 transition-opacity">
                                {user.kycStatus === 'REJECTED' ? 'Tekrar Dene' : 'Doğrula'} →
                            </a>
                        )}
                    </div>
                )}

                {/* Top Control Bar */}
                <div className="flex items-center justify-between bg-bg-card border border-border-subtle rounded-md px-3 py-2 shadow-sm h-12 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Market Status (Far Left) */}


                        <AccountSwitch />
                        <div className="h-4 w-px bg-border-subtle"></div>
                        <div className="flex items-baseline gap-2">
                            <h1 className="text-lg font-bold text-primary-navy tracking-tight">{activeSymbol.replace('.IS', '')}</h1>
                            <span className="text-xs text-text-secondary font-medium hidden sm:inline">PRO TRADER</span>
                            {!isConnected && <span className="text-[10px] text-red-500 font-bold ml-2">BAĞLANTI YOK</span>}
                        </div>


                    </div>

                    <div className="flex items-center gap-6">
                        {/* Alarm Button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowAlarms(!showAlarms)}
                                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${showAlarms ? 'bg-primary/10 text-primary' : 'text-text-secondary'}`}
                            >
                                <Bell size={20} />
                                {/* Badge if active alarms exist (mock) */}
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>

                            {showAlarms && (
                                <div className="absolute right-0 top-12 w-80 z-50 animate-in fade-in slide-in-from-top-2">
                                    <AlarmList
                                        symbol={activeSymbol}
                                        currentPrice={activeData.price}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="text-right">
                            <div className="text-xs text-text-muted">Son Fiyat</div>
                            <div className={`text-lg font-bold font-mono-data tracking-tight ${activeData.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                                {activeData.price?.toLocaleString()} ₺
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-text-muted">Değişim</div>
                            <div className={`text-sm font-bold font-mono-data flex items-center gap-1 ${activeData.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                                {activeData.changePercent >= 0 ? '▲' : '▼'} %{activeData.changePercent?.toFixed(2)}
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="text-xs text-text-muted">Hacim</div>
                            <div className="text-sm font-medium font-mono-data text-text-primary">{activeData.volume?.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Content Grid (Chart + Order) */}
                <div className="flex-1 flex flex-col lg:flex-row gap-2 min-h-0">

                    {/* CHART AREA */}
                    <div className="flex-1 card-matte flex flex-col p-0 overflow-hidden min-h-[400px] lg:min-h-0 relative">
                        <div className="absolute top-2 left-2 z-10 flex gap-1 flex-wrap">
                            <button onClick={() => setChartRange('1d|1m')} className={`px-2 py-1 text-xs font-medium border rounded transition-all ${chartRange === '1d|1m' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}>1dk</button>
                            <button onClick={() => setChartRange('1d|5m')} className={`px-2 py-1 text-xs font-medium border rounded transition-all ${chartRange === '1d|5m' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}>5dk</button>
                            <button onClick={() => setChartRange('5d|15m')} className={`px-2 py-1 text-xs font-medium border rounded transition-all ${chartRange === '5d|15m' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}>15dk</button>
                            <button onClick={() => setChartRange('5d|30m')} className={`px-2 py-1 text-xs font-medium border rounded transition-all ${chartRange === '5d|30m' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}>30dk</button>
                            <button onClick={() => setChartRange('1mo|1h')} className={`px-2 py-1 text-xs font-medium border rounded transition-all ${chartRange === '1mo|1h' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}>1S</button>
                            <button onClick={() => setChartRange('3mo|4h')} className={`px-2 py-1 text-xs font-medium border rounded transition-all ${chartRange === '3mo|4h' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}>4S</button>

                            <button onClick={() => setChartRange('5y|1mo')} className={`px-2 py-1 text-xs font-medium border rounded transition-all ${chartRange === '5y|1mo' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}>1A</button>

                        </div>
                        <div className="flex items-center justify-center h-full bg-white relative">
                            {chartLoading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs text-text-muted">Grafik yükleniyor...</span>
                                </div>
                            ) : (
                                <MarketChart
                                    data={chartData}
                                    colors={{
                                        upColor: '#10b981',
                                        downColor: '#ef4444',
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE (ORDER FORM) */}
                    <div className="w-full lg:w-80 flex flex-col gap-2 shrink-0">
                        <OrderForm
                            symbol={activeSymbol}
                            currentPrice={activeData.price}
                        />

                        {/* Derinlik Tablosu (AKD & Levels) */}
                        <MarketDepth
                            currentPrice={activeData.price}
                        />

                        {/* Account Summary */}
                        <div className="card-matte p-3 flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-3 pb-1 border-b border-border-subtle">
                                <div className="text-xs font-bold text-primary-navy uppercase tracking-wider">Portföy</div>
                                <a href="/portfolio" className="text-[10px] text-primary hover:text-primary-navy font-bold">Detaylar →</a>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-text-secondary">Bakiye</span>
                                    <span className="font-bold font-mono-data text-primary-navy">{balance.toLocaleString('tr-TR')} ₺</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-text-secondary">Müsait</span>
                                    <span className="font-bold font-mono-data text-success">{available.toLocaleString('tr-TR')} ₺</span>
                                </div>
                            </div>


                        </div>
                    </div>

                </div>

                {/* Mobile Navigation */}
                <MobileNav />
            </main>
        </div>
    );
}
