'use client';

import { Activity } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export default function AssetTicker() {
    const { ticker, isConnected } = useMarket();

    // Fallback if no data yet (show skeletons or static list until connection)
    const displayAssets = ticker.length > 0 ? ticker : [];

    return (
        <aside className="w-64 flex-shrink-0 border-l border-border-subtle bg-bg-app hidden xl:flex flex-col">
            <div className="h-12 flex items-center justify-between px-4 border-b border-border-subtle bg-bg-header shrink-0">
                <div className="flex items-center gap-2 text-primary-navy font-bold text-xs tracking-wider uppercase">
                    <Activity size={14} className="text-primary-blue" />
                    Piyasa İzle
                </div>
                <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-border-subtle">
                    {/* Header Row */}
                    <div className="grid grid-cols-3 px-3 py-2 bg-gray-50 text-[10px] text-text-muted font-medium uppercase tracking-wider">
                        <div className="col-span-1">Sembol</div>
                        <div className="text-right">Son</div>
                        <div className="text-right">%</div>
                    </div>

                    {displayAssets.length === 0 && (
                        <div className="p-4 text-center text-xs text-text-muted">Veri bekleniyor...</div>
                    )}

                    {displayAssets.map((asset) => (
                        <div key={asset.symbol} className="grid grid-cols-3 px-3 py-2.5 hover:bg-white transition-colors cursor-pointer group items-center">
                            <div className="col-span-1 truncate">
                                <div className="font-bold text-xs text-primary-navy group-hover:text-primary-blue transition-colors truncate" title={asset.symbol}>{asset.symbol.replace('-USD', '').replace('.IS', '')}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono-data font-medium text-xs text-text-primary">
                                    {asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div className="text-right flex justify-end">
                                <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 w-fit ${asset.changePercent >= 0
                                        ? 'bg-emerald-50 text-success'
                                        : 'bg-red-50 text-danger'
                                    }`}>
                                    {asset.changePercent > 0 ? '+' : ''}{asset.changePercent?.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-2 border-t border-border-subtle bg-bg-header shrink-0">
                <button className="w-full btn-tactile text-xs justify-center text-text-secondary">
                    Tümünü Gör
                </button>
            </div>
        </aside>
    );
}
