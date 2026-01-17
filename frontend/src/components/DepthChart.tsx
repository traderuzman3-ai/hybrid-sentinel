'use client';

import { useEffect, useState } from 'react';

interface OrderBookLevel {
    price: number;
    amount: number;
    total: number;
    percent: number;
}

export default function DepthChart({ currentPrice, volume }: { currentPrice: number, volume?: number }) {
    const [bids, setBids] = useState<OrderBookLevel[]>([]);
    const [asks, setAsks] = useState<OrderBookLevel[]>([]);

    useEffect(() => {
        if (!currentPrice) return;

        // Simulate Depth
        const generateLevel = (basePrice: number, type: 'BID' | 'ASK', count: number) => {
            let levels = [];
            let cumulative = 0;

            for (let i = 0; i < count; i++) {
                // Fiyat adımları (Tick size)
                const spread = basePrice * 0.0005 * (i + 1);
                const price = type === 'BID'
                    ? basePrice - spread - (Math.random() * basePrice * 0.0002)
                    : basePrice + spread + (Math.random() * basePrice * 0.0002);

                const amount = Math.floor(Math.random() * 5000) + 100;
                cumulative += amount;

                levels.push({
                    price,
                    amount,
                    total: cumulative,
                    percent: 0 // Will calc later
                });
            }
            return levels;
        };

        const simulatedBids = generateLevel(currentPrice, 'BID', 10);
        const simulatedAsks = generateLevel(currentPrice, 'ASK', 10);

        // Calculate max total for progress bars
        const maxTotal = Math.max(
            simulatedBids[simulatedBids.length - 1].total,
            simulatedAsks[simulatedAsks.length - 1].total
        );

        simulatedBids.forEach(l => l.percent = (l.total / maxTotal) * 100);
        simulatedAsks.forEach(l => l.percent = (l.total / maxTotal) * 100);

        setBids(simulatedBids);
        setAsks(simulatedAsks);

    }, [currentPrice]); // Updates when price changes

    return (
        <div className="card-matte border border-border-subtle rounded-md shadow-sm bg-white overflow-hidden text-[10px] w-full">
            <div className="bg-gray-50 p-2 border-b border-gray-100 flex justify-between">
                <span className="font-bold text-text-secondary">DERİNLİK (Level 2)</span>
                <span className="text-xs font-bold text-gray-400">Canlı</span>
            </div>

            <div className="flex flex-col">
                {/* Headers */}
                <div className="flex text-gray-400 px-1 py-1 bg-gray-50/50">
                    <div className="flex-1">Fiyat</div>
                    <div className="flex-1 text-right">Adet</div>
                    <div className="flex-1 text-right">Toplam</div>
                </div>

                {/* ASKS (Satıcılar - Üstte, Kırmızı) */}
                <div className="flex flex-col-reverse">
                    {asks.slice(0, 5).reverse().map((level, i) => (
                        <div key={i} className="flex relative items-center px-1 py-0.5 hover:bg-red-50/50">
                            {/* Visual Bar */}
                            <div
                                className="absolute right-0 top-0 bottom-0 bg-red-100/30 z-0"
                                style={{ width: `${level.percent}%`, transition: 'width 0.3s' }}
                            />
                            <div className="flex-1 z-10 font-mono-data text-red-600 font-bold">
                                {level.price.toFixed(2)}
                            </div>
                            <div className="flex-1 z-10 text-right font-mono-data text-text-secondary">
                                {level.amount.toLocaleString()}
                            </div>
                            <div className="flex-1 z-10 text-right font-mono-data text-gray-400">
                                {level.total.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* SPREAD INDICATOR */}
                <div className="bg-gray-100 text-center py-1 text-gray-500 font-bold border-y border-gray-200">
                    {currentPrice.toFixed(2)} ₺
                </div>

                {/* BIDS (Alıcılar - Altta, Yeşil) */}
                <div>
                    {bids.slice(0, 5).map((level, i) => (
                        <div key={i} className="flex relative items-center px-1 py-0.5 hover:bg-green-50/50">
                            {/* Visual Bar */}
                            <div
                                className="absolute right-0 top-0 bottom-0 bg-green-100/30 z-0"
                                style={{ width: `${level.percent}%`, transition: 'width 0.3s' }}
                            />
                            <div className="flex-1 z-10 font-mono-data text-green-600 font-bold">
                                {level.price.toFixed(2)}
                            </div>
                            <div className="flex-1 z-10 text-right font-mono-data text-text-secondary">
                                {level.amount.toLocaleString()}
                            </div>
                            <div className="flex-1 z-10 text-right font-mono-data text-gray-400">
                                {level.total.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
