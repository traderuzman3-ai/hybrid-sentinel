'use client';

import AccountSwitch from '../../components/AccountSwitch';
import { MarketChart } from '../../components/MarketChart';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useMarket } from '../../context/MarketContext';

export default function DashboardPage() {
    const { user } = useUser();
    const { marketData, isConnected } = useMarket();

    // Get TRY wallet
    const tryWallet = user?.wallets?.find((w: any) => w.currency === 'TRY');
    const balance = tryWallet ? tryWallet.balance : 0;
    const available = tryWallet ? (tryWallet.balance - tryWallet.frozen) : 0;

    const symbol = 'ASELS.IS';
    const activeData = marketData[symbol] || {
        price: 68.90,
        changePercent: 2.10,
        high: 69.10,
        low: 67.50,
        volume: 452100
    };

    // Mock Chart Data for now - would be replaced by historical fetch
    const [chartData, setChartData] = useState([
        { time: '2023-12-22', open: 62.50, high: 63.80, low: 62.10, close: 63.20 },
        { time: '2023-12-23', open: 63.20, high: 64.50, low: 63.00, close: 64.10 },
        { time: '2023-12-24', open: 64.10, high: 65.20, low: 63.80, close: 64.90 },
        { time: '2023-12-25', open: 64.90, high: 66.00, low: 64.50, close: 65.50 },
        { time: '2023-12-26', open: 65.50, high: 65.80, low: 64.20, close: 64.80 },
        { time: '2023-12-27', open: 64.80, high: 66.50, low: 64.80, close: 66.20 },
        { time: '2023-12-28', open: 66.20, high: 68.00, low: 66.00, close: 67.50 },
        { time: '2023-12-29', open: 67.50, high: 69.20, low: 67.20, close: 68.90 },
    ]);

    return (
        <div className="flex flex-col h-full bg-bg-app p-2 gap-2">

            {/* Top Control Bar: Reduced height, high density */}
            <div className="flex items-center justify-between bg-bg-card border border-border-subtle rounded-md px-3 py-2 shadow-sm h-12 shrink-0">
                <div className="flex items-center gap-4">
                    <AccountSwitch />
                    <div className="h-4 w-px bg-border-subtle"></div>
                    <div className="flex items-baseline gap-2">
                        <h1 className="text-lg font-bold text-primary-navy tracking-tight">{symbol.replace('.IS', '')}</h1>
                        <span className="text-xs text-text-secondary font-medium">ASELSAN ELEKTRONİK</span>
                        {!isConnected && <span className="text-[10px] text-red-500 font-bold ml-2">BAĞLANTI YOK</span>}
                    </div>
                </div>

                <div className="flex items-center gap-6">
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

            {/* Main Terminal Grid */}
            <div className="flex-1 grid grid-cols-12 gap-2 min-h-0">

                {/* Center Panel: Chart (9 Columns) */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-2 min-h-0">
                    <div className="card-matte flex-1 flex flex-col p-0 overflow-hidden min-h-0 relative">
                        {/* Chart Toolbar Overlay */}
                        <div className="absolute top-2 left-2 z-10 flex gap-1">
                            {['1D', '1W', '1M', '3M', '1Y'].map(t => (
                                <button key={t} className="px-2 py-0.5 text-[10px] font-medium bg-white/80 border border-gray-200 rounded hover:bg-gray-50 text-text-secondary">
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-center h-full bg-white relative">
                            <MarketChart
                                data={chartData}
                                colors={{
                                    upColor: '#10b981',
                                    downColor: '#ef4444',
                                    backgroundColor: 'transparent',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel: Order Book & Entry (3 Columns) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-2 min-h-0">

                    {/* Order Entry Panel */}
                    <div className="card-matte p-3 shrink-0">
                        <div className="text-xs font-bold text-primary-navy uppercase tracking-wider mb-2 border-b border-border-subtle pb-1">Hızlı Emir</div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-gray-50 p-2 rounded border border-gray-100 text-center cursor-pointer hover:border-blue-200 transition-colors">
                                <div className="text-[10px] text-text-secondary">Alış</div>
                                <div className="font-mono-data font-bold text-success">{activeData.price?.toLocaleString()}</div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded border border-gray-100 text-center cursor-pointer hover:border-red-200 transition-colors">
                                <div className="text-[10px] text-text-secondary">Satış</div>
                                <div className="font-mono-data font-bold text-danger">{activeData.price?.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button className="btn-tactile success w-full justify-center py-2 text-sm shadow-sm">
                                AL
                            </button>
                            <button className="btn-tactile danger w-full justify-center py-2 text-sm shadow-sm">
                                SAT
                            </button>
                        </div>
                    </div>

                    {/* Account Summary - Compact */}
                    <div className="card-matte p-3 flex-1 flex flex-col">
                        <div className="text-xs font-bold text-primary-navy uppercase tracking-wider mb-3 border-b border-border-subtle pb-1">Portföy</div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs text-text-secondary">Bakiye</span>
                                <span className="font-bold font-mono-data text-primary-navy">{balance.toLocaleString('tr-TR')} ₺</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs text-text-secondary">Müsait</span>
                                <span className="font-bold font-mono-data text-success">{available.toLocaleString('tr-TR')} ₺</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs text-text-secondary">Risk</span>
                                <span className="font-bold font-mono-data text-text-primary">%45</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-3 border-t border-border-subtle">
                            <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Piyasa açık
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
