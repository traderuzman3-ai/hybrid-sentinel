'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../context/UserContext';
import MarketSelector from './MarketSelector';
import { LayoutDashboard, Wallet, Receipt, LineChart, Settings, LogOut, Briefcase, Shield, Newspaper, Search } from 'lucide-react';
import { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import DepthChart from './DepthChart';
import EconomicCalendar from './EconomicCalendar';

interface TradeSidebarProps {
    onSelectSymbol?: (symbol: string) => void;
    activeSymbol?: string;
}

export default function TradeSidebar({ onSelectSymbol, activeSymbol }: TradeSidebarProps) {
    const { user, logout } = useUser();
    const { marketData, selectSymbol: contextSelectSymbol } = useMarket();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<'MARKET' | 'ANALYSIS'>('MARKET');
    const [searchTerm, setSearchTerm] = useState('');

    // Get live data for selected symbol
    const activeData = (activeSymbol && marketData[activeSymbol]) || { price: 0, volume: 0 };
    const currentPrice = activeData.price;
    const currentVolume = activeData.volume;

    const handleSymbolSelect = (sym: string) => {
        if (onSelectSymbol) onSelectSymbol(sym);
        if (contextSelectSymbol) contextSelectSymbol(sym);
    };

    return (
        <aside className="w-[320px] bg-white border-r border-border-subtle flex flex-col h-full shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
            {/* User Profile Summary */}
            <div className="p-4 border-b border-border-subtle bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-blue flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                        {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-primary-navy truncate">
                            {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-[10px] text-text-muted flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Çevrimiçi</span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 hover:bg-white hover:text-red-500 rounded-lg transition-colors text-text-muted hover:shadow-sm"
                        title="Çıkış Yap"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>

            {/* Tab Header for Market/Analysis */}
            <div className="flex border-b border-border-subtle bg-white">
                <button
                    onClick={() => setActiveTab('MARKET')}
                    className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 relative ${activeTab === 'MARKET'
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-gray-50'
                        }`}
                >
                    PİYASA
                    {activeTab === 'MARKET' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full mb-1"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('ANALYSIS')}
                    className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 relative ${activeTab === 'ANALYSIS'
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-gray-50'
                        }`}
                >
                    ANALİZ & TAKVİM
                    {activeTab === 'ANALYSIS' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full mb-1"></span>}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'ANALYSIS' ? (
                    <div className="h-full overflow-y-auto">
                        <EconomicCalendar />
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        {/* Market Selector Component handles the list and search */}
                        <MarketSelector onSelect={handleSymbolSelect} activeSymbol={activeSymbol} />

                        {/* Mini Depth Chart at bottom of sidebar (Optional) */}
                        <div className="h-1/3 border-t border-border-subtle bg-gray-50/30 overflow-hidden flex flex-col">
                            <div className="px-3 py-2 border-b border-border-subtle flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase text-text-secondary">DERİNLİK (ÖZET)</span>
                                <span className="text-[10px] font-mono text-primary font-bold">{activeSymbol}</span>
                            </div>
                            <div className="flex-1 relative">
                                {/* Pass volume to simulate depth */}
                                <DepthChart currentPrice={currentPrice} volume={currentVolume || 100000} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
