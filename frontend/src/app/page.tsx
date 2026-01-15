'use client';

import AccountSwitch from '../components/AccountSwitch';
import { MarketChart } from '../components/MarketChart'; // Re-using existing chart for now
import { useState } from 'react';

// Mock Data for ASELS - we would fetch this in reality
const MOCK_DATA = [
    { time: '2023-12-22', open: 62.50, high: 63.80, low: 62.10, close: 63.20 },
    { time: '2023-12-23', open: 63.20, high: 64.50, low: 63.00, close: 64.10 },
    { time: '2023-12-24', open: 64.10, high: 65.20, low: 63.80, close: 64.90 },
    { time: '2023-12-25', open: 64.90, high: 66.00, low: 64.50, close: 65.50 },
    { time: '2023-12-26', open: 65.50, high: 65.80, low: 64.20, close: 64.80 },
    { time: '2023-12-27', open: 64.80, high: 66.50, low: 64.80, close: 66.20 },
    { time: '2023-12-28', open: 66.20, high: 68.00, low: 66.00, close: 67.50 },
    { time: '2023-12-29', open: 67.50, high: 69.20, low: 67.20, close: 68.90 },
];

export default function Home() {
    return (
        <div className="container-custom py-6">

            {/* Account Switcher - Centered Top */}
            <AccountSwitch />

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6">

                {/* Chart Area - 8 Columns */}
                <div className="col-span-12 lg:col-span-9">
                    <div className="card-matte h-[500px] flex flex-col">
                        <div className="card-header flex justify-between items-center">
                            <div className="flex items-baseline gap-3">
                                <span className="text-2xl font-bold text-primary-navy">ASELS</span>
                                <span className="text-sm text-text-secondary">ASELSAN ELEKTRONİK SANAYİ TİC. A.Ş.</span>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-success">68.90 ₺</div>
                                <div className="text-xs text-success bg-green-50 px-2 py-1 rounded inline-block font-semibold">
                                    ▲ %2.10
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-white border border-gray-100 rounded-lg overflow-hidden relative">
                            {/* Chart Component would be fully interactive here. 
                                 Using MarketChart but styling needs to be passed or updated for Light Mode 
                             */}
                            <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
                                <MarketChart
                                    data={MOCK_DATA}
                                    colors={{
                                        upColor: '#10b981',
                                        downColor: '#ef4444',
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Buttons Panel */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button className="btn-tactile success text-lg py-4">
                            AL (ASELS)
                        </button>
                        <button className="btn-tactile danger text-lg py-4">
                            SAT (ASELS)
                        </button>
                    </div>
                </div>

                {/* Right Side / Order Book or Details - 3 Columns */}
                <div className="col-span-12 lg:col-span-3">
                    <div className="card-matte h-full">
                        <div className="card-header">İşlem Özeti</div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Hesap Bakiyesi</span>
                                <span className="font-mono font-bold">100.000,00 ₺</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Kullanılabilir</span>
                                <span className="font-mono font-bold">56.250,00 ₺</span>
                            </div>
                            <div className="h-px bg-gray-100 my-4"></div>
                            <div className="p-3 bg-blue-50 rounded text-xs text-blue-700">
                                Piyasa açık. Veriler 15dk gecikmelidir.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
