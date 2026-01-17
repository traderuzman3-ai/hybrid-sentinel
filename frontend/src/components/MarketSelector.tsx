'use client';

import { useState } from 'react';
import { MARKET_STRUCTURE } from '../lib/market-structure';

interface MarketSelectorProps {
    onSelectSymbol: (symbol: string) => void;
    activeSymbol: string;
}

export default function MarketSelector({ onSelectSymbol, activeSymbol }: MarketSelectorProps) {
    // Accordion State
    const [expandedCountry, setExpandedCountry] = useState<string | null>('TR');
    const [expandedExchange, setExpandedExchange] = useState<string | null>('BIST');
    const [expandedIndex, setExpandedIndex] = useState<string | null>('XU100');

    // Mobile Drawer State
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleCountry = (key: string) => setExpandedCountry(expandedCountry === key ? null : key);
    const toggleExchange = (key: string) => setExpandedExchange(expandedExchange === key ? null : key);
    const toggleIndex = (key: string) => setExpandedIndex(expandedIndex === key ? null : key);

    const renderContent = () => (
        <div className="flex flex-col gap-1 overflow-y-auto h-full pr-1 custom-scrollbar">
            {Object.entries(MARKET_STRUCTURE).map(([cKey, country]: [string, any]) => (
                <div key={cKey} className="border-b border-border-subtle/50 last:border-0 pb-1 mb-1">
                    {/* Ülke Başlığı */}
                    <button
                        onClick={() => toggleCountry(cKey)}
                        className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded transition-colors text-left group"
                    >
                        <span className="font-bold text-sm text-primary-navy flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span> {country.name}
                        </span>
                        <span className={`text-[10px] text-text-muted transform transition-transform ${expandedCountry === cKey ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {/* Borsalar */}
                    {expandedCountry === cKey && (
                        <div className="pl-3 flex flex-col gap-1 mt-1 border-l-2 border-border-subtle ml-2">
                            {Object.entries(country.exchanges).map(([eKey, exchange]: [string, any]) => (
                                <div key={eKey}>
                                    <button
                                        onClick={() => toggleExchange(eKey)}
                                        className="w-full flex items-center justify-between py-1 px-2 hover:bg-white/5 rounded text-left text-xs font-medium text-text-secondary"
                                    >
                                        {exchange.name}
                                        <span className={`text-[8px] transform transition-transform ${expandedExchange === eKey ? 'rotate-180' : ''}`}>▼</span>
                                    </button>

                                    {/* Endeksler */}
                                    {expandedExchange === eKey && (
                                        <div className="pl-3 mt-1 ml-1 border-l border-border-subtle/50">
                                            {Object.entries(exchange.indices).map(([iKey, index]: [string, any]) => (
                                                <div key={iKey} className="mb-2">
                                                    <button
                                                        onClick={() => toggleIndex(iKey)}
                                                        className="w-full text-left text-[11px] font-bold text-primary-navy/80 hover:text-primary mb-1 pl-1"
                                                    >
                                                        {index.name}
                                                    </button>

                                                    {/* Hisseler */}
                                                    {expandedIndex === iKey && (
                                                        <div className="grid grid-cols-2 gap-1 pl-1">
                                                            {index.symbols.map((sym: string) => (
                                                                <button
                                                                    key={sym}
                                                                    onClick={() => {
                                                                        onSelectSymbol(sym);
                                                                        setIsMobileOpen(false); // Mobilde seçince kapat
                                                                    }}
                                                                    className={`text-[10px] text-left px-2 py-1 rounded truncate transition-colors ${activeSymbol === sym
                                                                            ? 'bg-primary text-white font-bold shadow-sm'
                                                                            : 'bg-bg-card hover:bg-gray-100 text-text-secondary'
                                                                        }`}
                                                                >
                                                                    {sym.replace('.IS', '').replace('-USD', '').replace('=F', '').replace('=X', '')}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col w-64 bg-bg-surface border-r border-border-subtle h-full p-2 shrink-0">
                <div className="text-xs font-bold text-primary-navy uppercase tracking-wider mb-3 px-2">Piyasalar</div>
                {renderContent()}
            </div>

            {/* Mobile Drawer Trigger */}
            <div className="lg:hidden">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-border-subtle rounded-md shadow-sm text-sm font-bold text-primary-navy w-full"
                >
                    <span>🌍 Piyasalar & Sembol Seç</span>
                    <span className="ml-auto text-xs opacity-50">▼</span>
                </button>

                {/* Mobile Drawer Overlay */}
                {isMobileOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
                        <div className="relative w-[300px] h-full bg-white shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200">
                            <div className="flex items-center justify-between mb-4 border-b pb-2">
                                <h2 className="text-lg font-bold text-primary-navy">Piyasalar</h2>
                                <button onClick={() => setIsMobileOpen(false)} className="text-2xl text-text-secondary hover:text-red-500">&times;</button>
                            </div>
                            {renderContent()}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
