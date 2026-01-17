'use client';

import { useEffect, useState } from 'react';
import { Layers, PieChart, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OrderBookLevel {
    price: number;
    amount: number;
    total: number;
    percent: number;
}

interface Broker {
    name: string;
    lot: number;
    price: number;
    percent: number;
    color: string;
}

const BROKERS = [
    { name: 'Bank of America', color: '#dc2626' }, // Red
    { name: 'Yatırım Fin.', color: '#2563eb' },   // Blue
    { name: 'İnfo Yatırım', color: '#16a34a' },  // Green
    { name: 'Garanti BBVA', color: '#16a34a' },   // Green
    { name: 'Yapı Kredi', color: '#2563eb' },     // Blue
    { name: 'İş Yatırım', color: '#2563eb' },     // Blue
    { name: 'Ziraat Yat.', color: '#dc2626' },    // Red
    { name: 'Diğer', color: '#9ca3af' }           // Gray
];

export default function MarketDepth({ currentPrice }: { currentPrice: number }) {
    const [activeTab, setActiveTab] = useState<'DEPTH' | 'AKD'>('DEPTH');
    const [bids, setBids] = useState<OrderBookLevel[]>([]);
    const [asks, setAsks] = useState<OrderBookLevel[]>([]);
    const [buyers, setBuyers] = useState<Broker[]>([]);
    const [sellers, setSellers] = useState<Broker[]>([]);

    useEffect(() => {
        if (!currentPrice) return;

        // --- 1. DEPTH SIMULATION ---
        const generateLevel = (basePrice: number, type: 'BID' | 'ASK', count: number) => {
            let levels = [];
            let cumulative = 0;
            for (let i = 0; i < count; i++) {
                const spread = basePrice * 0.0005 * (i + 1);
                const price = type === 'BID'
                    ? basePrice - spread - (Math.random() * basePrice * 0.0002)
                    : basePrice + spread + (Math.random() * basePrice * 0.0002);
                const amount = Math.floor(Math.random() * 5000) + 100;
                cumulative += amount;
                levels.push({ price, amount, total: cumulative, percent: 0 });
            }
            return levels;
        };

        const simBids = generateLevel(currentPrice, 'BID', 10);
        const simAsks = generateLevel(currentPrice, 'ASK', 10);

        const maxTotal = Math.max(simBids[simBids.length - 1].total, simAsks[simAsks.length - 1].total);
        simBids.forEach(l => l.percent = (l.total / maxTotal) * 100);
        simAsks.forEach(l => l.percent = (l.total / maxTotal) * 100);

        setBids(simBids);
        setAsks(simAsks);

        // --- 2. AKD SIMULATION ---
        const generateBrokers = () => {
            // Shuffle and pick top 5
            const shuffled = [...BROKERS].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 5);

            let totalLot = 0;
            const brokers = selected.map(b => {
                const lot = Math.floor(Math.random() * 500000) + 50000;
                totalLot += lot;
                return { ...b, lot, price: currentPrice, percent: 0 };
            });

            brokers.sort((a, b) => b.lot - a.lot);
            brokers.forEach(b => b.percent = (b.lot / totalLot) * 100);
            return brokers;
        }

        setBuyers(generateBrokers());
        setSellers(generateBrokers());

    }, [currentPrice]); // Updates on tick

    return (
        <div className="card-matte border border-border-subtle rounded-md shadow-sm bg-white overflow-hidden text-[10px] w-full flex flex-col h-full">
            {/* TABS */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('DEPTH')}
                    className={`flex-1 py-2 font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === 'DEPTH' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-secondary hover:bg-gray-50'}`}
                >
                    <Layers size={14} /> Derinlik
                </button>
                <button
                    onClick={() => setActiveTab('AKD')}
                    className={`flex-1 py-2 font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === 'AKD' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-secondary hover:bg-gray-50'}`}
                >
                    <PieChart size={14} /> AKD
                </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-auto bg-white relative">

                {/* --- DEPTH VIEW --- */}
                {activeTab === 'DEPTH' && (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex text-gray-400 px-2 py-1 bg-gray-50 text-[9px] uppercase tracking-wider font-bold">
                            <div className="flex-1">Fiyat</div>
                            <div className="flex-1 text-right">Adet</div>
                            <div className="flex-1 text-right">Toplam</div>
                        </div>

                        {/* ASKS (SELLERS) */}
                        <div className="flex flex-col-reverse">
                            {asks.slice(0, 8).reverse().map((level, i) => (
                                <div key={i} className="flex relative items-center px-2 py-0.5 hover:bg-red-50 cursor-crosshair group">
                                    <div className="absolute right-0 top-0 bottom-0 bg-red-100/40 z-0 transition-all duration-300" style={{ width: `${level.percent}%` }} />
                                    <div className="flex-1 z-10 font-mono-data text-red-600 font-bold group-hover:text-red-700">{level.price.toFixed(2)}</div>
                                    <div className="flex-1 z-10 text-right font-mono-data text-text-secondary">{level.amount.toLocaleString()}</div>
                                    <div className="flex-1 z-10 text-right font-mono-data text-gray-400 group-hover:text-gray-500">{level.total.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>

                        {/* MID PRICE */}
                        <div className="bg-gray-50 py-1 text-center font-bold text-lg text-primary-navy border-y border-gray-100 font-mono relative">
                            {currentPrice.toFixed(2)} <span className="text-xs font-sans text-gray-400 font-normal">TRY</span>
                        </div>

                        {/* BIDS (BUYERS) */}
                        <div className="flex flex-col">
                            {bids.slice(0, 8).map((level, i) => (
                                <div key={i} className="flex relative items-center px-2 py-0.5 hover:bg-green-50 cursor-crosshair group">
                                    <div className="absolute right-0 top-0 bottom-0 bg-green-100/40 z-0 transition-all duration-300" style={{ width: `${level.percent}%` }} />
                                    <div className="flex-1 z-10 font-mono-data text-green-600 font-bold group-hover:text-green-700">{level.price.toFixed(2)}</div>
                                    <div className="flex-1 z-10 text-right font-mono-data text-text-secondary">{level.amount.toLocaleString()}</div>
                                    <div className="flex-1 z-10 text-right font-mono-data text-gray-400 group-hover:text-gray-500">{level.total.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- AKD VIEW --- */}
                {activeTab === 'AKD' && (
                    <div className="flex flex-col h-full gap-2 p-2">
                        {/* BUYERS */}
                        <div>
                            <h4 className="text-[10px] font-bold text-green-600 mb-1 flex items-center justify-between">
                                <span>ALICILAR (İlk 5)</span>
                                <ArrowUpRight size={12} />
                            </h4>
                            <div className="space-y-1">
                                {buyers.map((b, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px] bg-green-50/50 p-1 rounded border border-green-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: b.color }} />
                                            <div>
                                                <div className="font-bold text-primary-navy">{b.name}</div>
                                                <div className="text-[9px] text-text-secondary">Ort: {b.price.toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-green-700">%{b.percent.toFixed(1)}</div>
                                            <div className="text-[9px] text-text-muted">{b.lot.toLocaleString()} Lot</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-dashed border-gray-200 my-1"></div>

                        {/* SELLERS */}
                        <div>
                            <h4 className="text-[10px] font-bold text-red-600 mb-1 flex items-center justify-between">
                                <span>SATICILAR (İlk 5)</span>
                                <ArrowDownRight size={12} />
                            </h4>
                            <div className="space-y-1">
                                {sellers.map((b, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px] bg-red-50/50 p-1 rounded border border-red-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: b.color }} />
                                            <div>
                                                <div className="font-bold text-primary-navy">{b.name}</div>
                                                <div className="text-[9px] text-text-secondary">Ort: {b.price.toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-red-700">%{b.percent.toFixed(1)}</div>
                                            <div className="text-[9px] text-text-muted">{b.lot.toLocaleString()} Lot</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
