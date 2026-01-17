'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Zap, Lock, Unlock, RefreshCw } from 'lucide-react';

export default function GodPriceControl() {
    const [symbol, setSymbol] = useState('BTCUSDT');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAction = async (action: 'CRASH' | 'PUMP' | 'FREEZE' | 'RESET') => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => setLoading(false), 1000);

        let msg = '';
        if (action === 'CRASH') msg = `${symbol} üzerinde %10 Flash Crash tetiklendi!`;
        if (action === 'PUMP') msg = `${symbol} üzerinde %10 Pump tetiklendi!`;
        if (action === 'FREEZE') msg = `${symbol} tahtası donduruldu.`;

        alert(msg || 'İşlem Başarılı');
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="text-yellow-500 fill-yellow-500" />
                Piyasa Kontrolü (God Mode)
            </h2>

            <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Hedef Sembol</label>
                <input
                    type="text"
                    value={symbol}
                    onChange={e => setSymbol(e.target.value.toUpperCase())}
                    className="w-full text-lg font-mono font-bold p-2 border rounded border-gray-300 focus:border-yellow-500 outline-none"
                    placeholder="BTC, THYAO..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => handleAction('CRASH')}
                    className="bg-red-50 hover:bg-red-100 border border-red-200 p-4 rounded-xl flex flex-col items-center gap-2 group transition-all"
                >
                    <ArrowDown size={32} className="text-red-500 group-hover:scale-125 transition-transform" />
                    <span className="font-bold text-red-700">FLASH CRASH</span>
                    <span className="text-[10px] text-red-400">-10% (5 saniye)</span>
                </button>

                <button
                    onClick={() => handleAction('PUMP')}
                    className="bg-green-50 hover:bg-green-100 border border-green-200 p-4 rounded-xl flex flex-col items-center gap-2 group transition-all"
                >
                    <ArrowUp size={32} className="text-green-500 group-hover:scale-125 transition-transform" />
                    <span className="font-bold text-green-700">MEGA PUMP</span>
                    <span className="text-[10px] text-green-400">+10% (5 saniye)</span>
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="Manuel Fiyat Gir..."
                        className="flex-1 border rounded px-3 font-mono text-sm"
                    />
                    <button className="bg-gray-800 text-white px-4 py-2 rounded font-bold text-sm hover:bg-black">
                        AYARLA
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleAction('FREEZE')}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 py-3 rounded text-sm font-bold text-gray-600"
                    >
                        <Lock size={16} /> TAHTAYI DONDUR
                    </button>
                    <button
                        onClick={() => handleAction('RESET')}
                        className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 py-3 rounded text-sm font-bold text-blue-600"
                    >
                        <RefreshCw size={16} /> SIFIRLA
                    </button>
                </div>
            </div>
        </div>
    );
}
