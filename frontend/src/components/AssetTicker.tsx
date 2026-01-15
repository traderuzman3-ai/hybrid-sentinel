'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';

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
];

export default function AssetTicker() {
    return (
        <aside className="w-72 flex-shrink-0 border-l border-gray-200 bg-white min-h-[calc(100vh-80px)] hidden xl:block">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-semibold text-primary-navy text-sm uppercase tracking-wide">Piyasa Özeti</h3>
                <span className="text-xs text-text-secondary animate-pulse">Canlı ●</span>
            </div>

            <div className="divide-y divide-gray-100">
                <div className="px-4 py-2 bg-gray-50 flex justify-between text-xs text-text-secondary font-medium">
                    <span>Sembol</span>
                    <span className="text-right">Fiyat (TRY)</span>
                </div>

                <div className="overflow-y-auto max-h-[calc(100vh-160px)]">
                    {ASSETS.map((asset) => (
                        <div key={asset.symbol} className="px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center group">
                            <div>
                                <div className="font-bold text-primary-navy text-sm group-hover:text-primary-blue transition-colors">{asset.symbol}</div>
                                <div className="text-xs text-text-secondary">TRY</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono font-medium text-primary-navy">{asset.price}</div>
                                <div className={`text-xs flex items-center justify-end gap-1 ${asset.type === 'up' ? 'text-success' : 'text-danger'}`}>
                                    {asset.type === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                    %{Math.abs(asset.change).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
