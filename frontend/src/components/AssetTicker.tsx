'use client';

import { ArrowUp, ArrowDown, Activity } from 'lucide-react';

const ASSETS = [
    { symbol: 'GRAM ALTIN', price: '3.150,00', change: 0.34, type: 'up' },
    { symbol: 'GRAM GÜMÜŞ', price: '34,75', change: -0.12, type: 'down' },
    { symbol: 'BIST 100', price: '10.559,00', change: 1.20, type: 'up' },
    { symbol: 'BIST 30', price: '11.200,00', change: 1.15, type: 'up' },
    { symbol: 'USD/TRY', price: '36,85', change: 0.05, type: 'up' },
    { symbol: 'EUR/TRY', price: '39,20', change: -0.20, type: 'down' },
    { symbol: 'THYAO', price: '278,50', change: 1.50, type: 'up' },
    { symbol: 'GARAN', price: '85,30', change: -0.50, type: 'down' },
    { symbol: 'ASELS', price: '68,90', change: 2.10, type: 'up' },
    { symbol: 'AKBNK', price: '45,10', change: 0.80, type: 'up' },
    { symbol: 'ISCTR', price: '32,40', change: -0.30, type: 'down' },
    { symbol: 'KCHOL', price: '142,10', change: 0.90, type: 'up' },
];

export default function AssetTicker() {
    return (
        <aside className="w-64 flex-shrink-0 border-l border-border-subtle bg-bg-app hidden xl:flex flex-col">
            <div className="h-12 flex items-center justify-between px-4 border-b border-border-subtle bg-bg-header shrink-0">
                <div className="flex items-center gap-2 text-primary-navy font-bold text-xs tracking-wider uppercase">
                    <Activity size={14} className="text-primary-blue" />
                    Piyasa İzle
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
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

                    {ASSETS.map((asset) => (
                        <div key={asset.symbol} className="grid grid-cols-3 px-3 py-2.5 hover:bg-white transition-colors cursor-pointer group items-center">
                            <div className="col-span-1 truncate">
                                <div className="font-bold text-xs text-primary-navy group-hover:text-primary-blue transition-colors truncate" title={asset.symbol}>{asset.symbol}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono-data font-medium text-xs text-text-primary">{asset.price}</div>
                            </div>
                            <div className="text-right flex justify-end">
                                <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 w-fit ${asset.type === 'up'
                                        ? 'bg-emerald-50 text-success'
                                        : 'bg-red-50 text-danger'
                                    }`}>
                                    {asset.change > 0 ? '+' : ''}{asset.change}%
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
