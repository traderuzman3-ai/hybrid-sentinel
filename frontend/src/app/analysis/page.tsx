'use client';

import { useState, useEffect } from 'react';
import { useMarket } from '../../context/MarketContext';
import { MarketChart } from '../../components/MarketChart';
import {
    BarChart3, TrendingUp, TrendingDown, Activity, Target,
    Layers, ChevronDown, Star, Info, Maximize2
} from 'lucide-react';

export default function AnalysisPage() {
    const { marketData } = useMarket();
    const [selectedSymbol, setSelectedSymbol] = useState('ASELS.IS');
    const [timeframe, setTimeframe] = useState('1D');
    const [activeIndicators, setActiveIndicators] = useState<string[]>(['volume']);
    const [showIndicatorPanel, setShowIndicatorPanel] = useState(true);

    const symbols = ['ASELS.IS', 'THYAO.IS', 'GARAN.IS', 'AKBNK.IS', 'SISE.IS', 'EREGL.IS'];
    const timeframes = ['1S', '5D', '15D', '1S', '4S', '1G', '1H', '1A'];

    const indicators = [
        { id: 'volume', name: 'Hacim', desc: 'İşlem hacmi göstergesi', category: 'Temel' },
        { id: 'sma', name: 'SMA', desc: 'Basit Hareketli Ortalama', category: 'Trend' },
        { id: 'ema', name: 'EMA', desc: 'Üstel Hareketli Ortalama', category: 'Trend' },
        { id: 'bb', name: 'Bollinger Bands', desc: 'Volatilite bandları', category: 'Volatilite' },
        { id: 'rsi', name: 'RSI', desc: 'Göreceli Güç Endeksi', category: 'Momentum' },
        { id: 'macd', name: 'MACD', desc: 'Hareketli Ortalama Yakınsama', category: 'Momentum' },
        { id: 'stoch', name: 'Stochastic', desc: 'Stokastik Osilatör', category: 'Momentum' },
        { id: 'atr', name: 'ATR', desc: 'Ortalama Gerçek Aralık', category: 'Volatilite' }
    ];

    const toggleIndicator = (id: string) => {
        setActiveIndicators(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const currentData = marketData[selectedSymbol] || { price: 0, changePercent: 0, high: 0, low: 0, volume: 0 };

    // Mock chart data
    const chartData = [
        { time: '2025-01-01', open: 140.50, high: 143.80, low: 139.10, close: 142.20 },
        { time: '2025-01-02', open: 142.20, high: 145.50, low: 141.00, close: 144.10 },
        { time: '2025-01-03', open: 144.10, high: 146.20, low: 143.80, close: 145.90 },
        { time: '2025-01-04', open: 145.90, high: 148.00, low: 144.50, close: 147.50 },
        { time: '2025-01-05', open: 147.50, high: 147.80, low: 143.20, close: 144.80 },
        { time: '2025-01-06', open: 144.80, high: 148.50, low: 144.80, close: 147.20 },
        { time: '2025-01-07', open: 147.20, high: 150.00, low: 146.00, close: 149.50 },
        { time: '2025-01-08', open: 149.50, high: 152.20, low: 148.20, close: 151.90 },
        { time: '2025-01-09', open: 151.90, high: 153.80, low: 150.10, close: 152.40 },
        { time: '2025-01-10', open: 152.40, high: 155.00, low: 151.50, close: 154.20 },
    ];

    // Teknik Analiz Sinyalleri
    const signals = [
        { indicator: 'RSI (14)', value: '58.4', signal: 'Nötr', color: 'text-text-secondary' },
        { indicator: 'MACD', value: '+2.34', signal: 'AL', color: 'text-emerald-600' },
        { indicator: 'Stochastic', value: '72.1', signal: 'Aşırı Alım', color: 'text-amber-600' },
        { indicator: 'SMA (20)', value: '↑ Yukarı', signal: 'Yükseliş', color: 'text-emerald-600' },
        { indicator: 'BB (20)', value: 'Orta', signal: 'Nötr', color: 'text-text-secondary' },
    ];

    return (
        <div className="min-h-screen bg-bg-app p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary-navy flex items-center gap-2">
                            <BarChart3 size={24} /> Teknik Analiz
                        </h1>
                        <p className="text-sm text-text-secondary">Gelişmiş grafik ve teknik göstergeler.</p>
                    </div>

                    {/* Sembol Seçici */}
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedSymbol}
                            onChange={(e) => setSelectedSymbol(e.target.value)}
                            className="px-4 py-2 border border-border-subtle rounded-lg font-bold text-primary-navy bg-white"
                        >
                            {symbols.map(s => (
                                <option key={s} value={s}>{s.replace('.IS', '')}</option>
                            ))}
                        </select>
                        <div className={`text-lg font-bold font-mono-data ${currentData.changePercent >= 0 ? 'text-emerald-600' : 'text-danger'}`}>
                            {currentData.price?.toFixed(2)} ₺
                            <span className="text-sm ml-2">
                                {currentData.changePercent >= 0 ? '+' : ''}{currentData.changePercent?.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Ana Grafik */}
                    <div className="lg:col-span-3 card-matte p-0 overflow-hidden">
                        {/* Zaman Dilimi Seçici */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-gray-50">
                            <div className="flex gap-1">
                                {timeframes.map(tf => (
                                    <button
                                        key={tf}
                                        onClick={() => setTimeframe(tf)}
                                        className={`px-3 py-1 text-xs font-medium rounded ${timeframe === tf
                                                ? 'bg-primary text-white'
                                                : 'text-text-secondary hover:bg-gray-200'
                                            }`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
                                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-text-secondary hover:bg-gray-200 rounded"
                                >
                                    <Layers size={14} /> Göstergeler
                                </button>
                                <button className="p-1 text-text-secondary hover:bg-gray-200 rounded">
                                    <Maximize2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Aktif Göstergeler */}
                        {activeIndicators.length > 0 && (
                            <div className="flex gap-2 px-4 py-2 bg-gray-50 border-b border-border-subtle">
                                {activeIndicators.map(ind => (
                                    <span
                                        key={ind}
                                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium flex items-center gap-1"
                                    >
                                        {indicators.find(i => i.id === ind)?.name}
                                        <button
                                            onClick={() => toggleIndicator(ind)}
                                            className="hover:text-danger"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Grafik Alanı */}
                        <div className="h-[500px] bg-white relative">
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

                    {/* Sağ Panel */}
                    <div className="space-y-4">
                        {/* Fiyat Bilgisi */}
                        <div className="card-matte p-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase mb-3">Fiyat Özeti</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-secondary">Açılış</span>
                                    <span className="font-mono-data">{(currentData.price * 0.98).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-secondary">Yüksek</span>
                                    <span className="font-mono-data text-emerald-600">{currentData.high?.toFixed(2) || (currentData.price * 1.02).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-secondary">Düşük</span>
                                    <span className="font-mono-data text-danger">{currentData.low?.toFixed(2) || (currentData.price * 0.97).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-secondary">Hacim</span>
                                    <span className="font-mono-data">{currentData.volume?.toLocaleString() || '1.2M'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Teknik Sinyaller */}
                        <div className="card-matte p-4">
                            <h3 className="text-xs font-bold text-text-muted uppercase mb-3 flex items-center gap-1">
                                <Activity size={14} /> Teknik Sinyaller
                            </h3>
                            <div className="space-y-2">
                                {signals.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between py-1 border-b border-border-subtle last:border-0">
                                        <span className="text-xs text-text-secondary">{s.indicator}</span>
                                        <div className="text-right">
                                            <div className="text-xs font-mono-data">{s.value}</div>
                                            <div className={`text-[10px] font-medium ${s.color}`}>{s.signal}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gösterge Paneli */}
                        {showIndicatorPanel && (
                            <div className="card-matte p-4">
                                <h3 className="text-xs font-bold text-text-muted uppercase mb-3 flex items-center gap-1">
                                    <Layers size={14} /> Göstergeler
                                </h3>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {indicators.map(ind => (
                                        <button
                                            key={ind.id}
                                            onClick={() => toggleIndicator(ind.id)}
                                            className={`w-full flex items-center justify-between p-2 rounded text-left text-sm transition-all ${activeIndicators.includes(ind.id)
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'hover:bg-gray-50 text-text-secondary'
                                                }`}
                                        >
                                            <div>
                                                <div className="font-medium">{ind.name}</div>
                                                <div className="text-[10px] opacity-70">{ind.category}</div>
                                            </div>
                                            {activeIndicators.includes(ind.id) && <Star size={14} className="text-primary" fill="currentColor" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alt Bilgi */}
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
                    <Info size={18} className="text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-700">
                        Teknik analiz araçları bilgilendirme amaçlıdır. Yatırım kararlarınızı sadece bu verilere dayandırmayın.
                    </p>
                </div>
            </div>
        </div>
    );
}
