import axios from 'axios';
import yahooFinance from 'yahoo-finance2';
import { SyntheticEngine, OrderBook } from './synthetic.engine';
import { MatchingEngine } from '../trade/matching.engine';
import { QuantumEngine } from './quantum.engine';
import { MarketDiscoveryService } from './market.discovery';
import { HybridMarketService } from './hybrid.service';

export type MarketType = 'CRYPTO' | 'BIST' | 'US_STOCK' | 'EU_STOCK' | 'ASIA_STOCK' | 'RUSSIA_STOCK' | 'COMMODITY' | 'FOREX';

// ... (Interface MarketData remains same) ...

// ... (Inside MarketSentinel Class) ...

    private async pollYahooAssets() {
    console.log('🕵️ Stealth Mode: Hybrid Global Fetch (TV -> INV -> YHOO)...');
    const hybridService = new HybridMarketService();

    // Get EVERYTHING from Discovery Service
    const allAssets = MarketDiscoveryService.getInstance().getAllSymbols();
    console.log(`🌍 Global Market Scope: Tracking ${allAssets.length} assets across all continents.`);

    // Process sequentially or in small batches to respect scraping limits
    const BATCH_SIZE = 5; // Allow slightly more parallel for global coverage
    for (let i = 0; i < allAssets.length; i += BATCH_SIZE) {
        const batch = allAssets.slice(i, i + BATCH_SIZE);

        await Promise.all(batch.map(async (item) => {
            const data = await hybridService.fetchPrice(item.symbol);

            if (data && data.price) {
                this.anchorCache.set(item.symbol, data.price);
                this.updateCache({
                    ...data,
                    symbol: item.symbol,
                    type: item.type,
                    // Fill missing fields with defaults or existing values
                    volume: data.volume || 0,
                    high: data.high || data.price * 1.01,
                    low: data.low || data.price * 0.99,
                    change: data.change || 0,
                    changePercent: data.changePercent || 0,
                    source: data.source || 'HYBRID',
                    updatedAt: Date.now()
                } as MarketData);
            }
        }));

        // Random pause between batches
        await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
    }
}

export interface MarketData {
    symbol: string;
    type: MarketType;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    volume: number;
    source: string;
    updatedAt: number;
    description?: string;
    // Technicals
    rsi?: number;
    macd?: number;
    ma20?: number;
    ma50?: number;
    signal?: 'BUY' | 'SELL' | 'NEUTRAL' | 'STRONG_BUY' | 'STRONG_SELL';
    // Fundamentals
    marketCap?: number;
    pe?: number; // F/K Oranı
}

const SYMBOLS: Record<MarketType, string[]> = {
    CRYPTO: [
        'BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD', 'DOGE-USD', 'DOT-USD', 'MATIC-USD'
    ],
    BIST: [
        'THYAO.IS', 'ASELS.IS', 'EREGL.IS', 'SASA.IS', 'GARAN.IS', 'SISE.IS', 'KCHOL.IS', 'AKBNK.IS', 'YKBNK.IS', 'TUPRS.IS',
        'FROTO.IS', 'ISCTR.IS', 'BIMAS.IS', 'HEKTS.IS', 'KOZAL.IS', 'EKGYO.IS', 'VESTL.IS', 'ODAS.IS', 'PETKM.IS', 'ALARK.IS',
        'SAHOL.IS', 'TCELL.IS', 'HALKB.IS', 'VAKBN.IS', 'ENKAI.IS', 'PGSUS.IS', 'TOASO.IS', 'ARCLK.IS', 'AEFES.IS', 'MGROS.IS',
        'SOKM.IS', 'BOSSA.IS', 'AKSEN.IS', 'ALGYO.IS', 'ALKIM.IS', 'AYGAZ.IS', 'BERA.IS', 'BIOEN.IS', 'BRSAN.IS', 'CANTE.IS',
        'CCOLA.IS', 'CEMTS.IS', 'CIMSA.IS', 'DOAS.IS', 'DOHOL.IS', 'ECILC.IS', 'EGEEN.IS', 'GENIL.IS', 'GUBRF.IS', 'GWIND.IS',
        'ISDMR.IS', 'JANTS.IS', 'KARSN.IS', 'KMPUR.IS', 'KONTR.IS', 'KORDS.IS', 'KOZAA.IS', 'MAVI.IS', 'OTKAR.IS', 'OYAKC.IS',
        'QUAGR.IS', 'SKE.IS', 'SKBNK.IS', 'SMRTG.IS', 'TAVHL.IS', 'TKFEN.IS', 'TTKOM.IS', 'ULKER.IS', 'VESBE.IS', 'ZOREN.IS'
    ],
    US_STOCK: [
        'AAPL', 'TSLA', 'NVDA', 'AMZN', 'MSFT', 'GOOGL', 'META', 'NFLX', 'AMD', 'INTC',
        'COIN', 'PLTR', 'UBER', 'DIS', 'JPM', 'V', 'WMT', 'KO', 'PEP', 'MCD'
    ],
    COMMODITY: [
        'GC=F', // Altın
        'SI=F', // Gümüş
        'CL=F', // Ham Petrol
        'NG=F', // Doğalgaz
        'HG=F', // Bakır
        'PL=F'  // Platin
    ],
    FOREX: [
        'TRY=X',         // USD/TRY
        'EURTRY=X',      // EUR/TRY
        'EURUSD=X',      // EUR/USD
        'GBPUSD=X',      // GBP/USD
        'USDJPY=X',      // USD/JPY
        'GBPTRY=X'       // GBP/TRY
    ]
};

const VOLATILITY_MAP: Record<MarketType, number> = {
    'CRYPTO': 0.002,   // Çok hareketli
    'BIST': 0.0008,    // Orta
    'US_STOCK': 0.001, // Orta-Yüksek
    'COMMODITY': 0.0005, // Sakin
    'FOREX': 0.0003    // Çok sakin
};

export class MarketSentinel {
    private static instance: MarketSentinel;
    private cache: Map<string, MarketData> = new Map();
    private anchorCache: Map<string, number> = new Map();
    private updateInterval: NodeJS.Timeout | null = null;
    private initialized = false;

    private constructor() {
        this.hydrateMarket(); // Immediate Data Flood
        this.startSentinels();
        this.startQuantumStream();
    }

    public static getInstance(): MarketSentinel {
        if (!MarketSentinel.instance) {
            MarketSentinel.instance = new MarketSentinel();
        }
        return MarketSentinel.instance;
    }

    /**
     * HYDRAULICS: Immediate Cache Population
     * User doesn't want to wait. We fill the board with "Last Known" (Simulated) data instantly.
     */
    private hydrateMarket() {
        const bistSymbols = MarketDiscoveryService.getInstance().getSymbols();
        console.log(`🌊 Hydraulics active: Instant flooding of ${bistSymbols.length} simulacra assets.`);

        bistSymbols.forEach(symbol => {
            // Generate a deterministic "random" price based on symbol chars so it stays consistent on reloads
            const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const basePrice = (seed % 1000) + 10;

            this.updateCache({
                symbol: symbol,
                type: 'BIST',
                price: basePrice,
                change: 0,
                changePercent: 0,
                high: basePrice * 1.02,
                low: basePrice * 0.98,
                volume: Math.floor(Math.random() * 1000000),
                source: 'HYBRID (SIMULATED)',
                updatedAt: Date.now(),
                description: 'BIST Sirketi (Yukleniyor...)',
                // Technicals (Simulated for initial view)
                rsi: 30 + (seed % 40), // 30-70 range
                macd: (seed % 10) / 100,
                signal: (seed % 2 === 0) ? 'BUY' : 'SELL',
                // Fundamentals
                marketCap: (basePrice * 1000000) * (1 + (seed % 10)),
                pe: 5 + (seed % 20)
            });
        });
    }

    private startSentinels() {
        // Kripto: 60sn
        this.pollCrypto();
        setInterval(() => this.pollCrypto(), 60000);

        // Diğer Tüm Piyasalar: 5dk
        this.pollYahooAssets();
        setInterval(() => this.pollYahooAssets(), 300000);
    }

    private startQuantumStream() {
        setInterval(() => {
            this.cache.forEach((data, symbol) => {
                const anchorPrice = this.anchorCache.get(symbol);
                if (anchorPrice) {
                    const volatility = VOLATILITY_MAP[data.type] || 0.0005;
                    const newPrice = QuantumEngine.fluctuatePrice(anchorPrice, data.price, volatility);

                    data.price = newPrice;
                    data.volume = QuantumEngine.generateVolume(data.volume);
                    data.updatedAt = Date.now();
                    // data.isQuantum = true; // removed if not needed by interface or added to interface

                    data.orderBook = SyntheticEngine.generateOrderBook(symbol, newPrice);
                    this.updateCache(data); // Use updateCache to trigger matching engine
                }
            });
        }, 1000);
    }

    private async pollCrypto() {
        try {
            console.log('🕵️ Stealth Mode: Crypto fetch...');
            for (const symbol of SYMBOLS.CRYPTO) {
                const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.replace('-USD', 'USDT')}`);
                const data = response.data;
                const price = parseFloat(data.lastPrice);
                this.anchorCache.set(symbol, price);

                this.updateCache({
                    symbol,
                    type: 'CRYPTO',
                    price: price,
                    change: parseFloat(data.priceChange),
                    changePercent: parseFloat(data.priceChangePercent),
                    high: parseFloat(data.highPrice),
                    low: parseFloat(data.lowPrice),
                    volume: parseFloat(data.volume),
                    source: 'BINANCE (LIVE)',
                    updatedAt: Date.now()
                });
            }
        } catch (e) {
            console.error('Crypto error:', e);
        }
    }

    private async pollYahooAssets() {
        console.log('🕵️ Stealth Mode: Hybrid Global Fetch (TV -> INV -> YHOO)...');
        const hybridService = new HybridMarketService();

        // Dynamic BIST List from Discovery Service
        const bistSymbols = MarketDiscoveryService.getInstance().getSymbols();

        const allSymbols = [
            ...bistSymbols.map(s => ({ s, type: 'BIST' as MarketType })),
            ...SYMBOLS.US_STOCK.map(s => ({ s, type: 'US_STOCK' as MarketType })),
            ...SYMBOLS.COMMODITY.map(s => ({ s, type: 'COMMODITY' as MarketType })),
            ...SYMBOLS.FOREX.map(s => ({ s, type: 'FOREX' as MarketType }))
        ];

        // Process sequentially or in small batches to respect scraping limits
        const BATCH_SIZE = 3;
        for (let i = 0; i < allSymbols.length; i += BATCH_SIZE) {
            const batch = allSymbols.slice(i, i + BATCH_SIZE);

            await Promise.all(batch.map(async (item) => {
                const data = await hybridService.fetchPrice(item.s);

                if (data && data.price) {
                    this.anchorCache.set(item.s, data.price);
                    this.updateCache({
                        ...data,
                        symbol: item.s,
                        type: item.type,
                        // Fill missing fields with defaults or existing values
                        volume: data.volume || 0,
                        high: data.high || data.price * 1.01,
                        low: data.low || data.price * 0.99,
                        change: data.change || 0,
                        changePercent: data.changePercent || 0,
                        source: data.source || 'HYBRID',
                        updatedAt: Date.now()
                    } as MarketData);
                }
            }));

            // Random pause between batches
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
        }
    }

    private updateCache(data: MarketData) {
        data.orderBook = SyntheticEngine.generateOrderBook(data.symbol, data.price);
        this.cache.set(data.symbol, data);

        // Limit Emir Eşleşme Kontrolü
        MatchingEngine.getInstance().processPriceUpdate(data.symbol, data.price).catch(console.error);
    }

    public getAllPrices(): MarketData[] {
        return Array.from(this.cache.values());
    }

    public getPrice(symbol: string): MarketData | undefined {
        return this.cache.get(symbol);
    }
}
