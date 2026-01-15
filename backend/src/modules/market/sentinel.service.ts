import axios from 'axios';
import yahooFinance from 'yahoo-finance2';

export interface MarketData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    volume: number;
    source: string;
    updatedAt: number;
}

const SYMBOLS = {
    KRIPTO: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD'],
    BIST: ['THYAO.IS', 'ASELS.IS', 'EREGL.IS', 'SASA.IS', 'GARAN.IS'],
    US: ['AAPL', 'TSLA', 'NVDA', 'AMZN', 'MSFT']
};

export class MarketSentinel {
    private static instance: MarketSentinel;
    private cache: Map<string, MarketData> = new Map();

    private constructor() {
        this.startSentinels();
    }

    public static getInstance(): MarketSentinel {
        if (!MarketSentinel.instance) {
            MarketSentinel.instance = new MarketSentinel();
        }
        return MarketSentinel.instance;
    }

    private startSentinels() {
        // 10 saniyede bir verileri tazele
        setInterval(() => this.pollCrypto(), 5000);
        setInterval(() => this.pollStocks(), 15000);
    }

    private async pollCrypto() {
        try {
            for (const symbol of SYMBOLS.KRIPTO) {
                // Binance Public API (Ücretsiz)
                const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.replace('-USD', 'USDT')}`);
                const data = response.data;

                this.updateCache({
                    symbol,
                    price: parseFloat(data.lastPrice),
                    change: parseFloat(data.priceChange),
                    changePercent: parseFloat(data.priceChangePercent),
                    high: parseFloat(data.highPrice),
                    low: parseFloat(data.lowPrice),
                    volume: parseFloat(data.volume),
                    source: 'BINANCE',
                    updatedAt: Date.now()
                });
            }
        } catch (e) {
            console.error('Crypto sentinel error:', e);
        }
    }

    private async pollStocks() {
        try {
            const allStocks = [...SYMBOLS.BIST, ...SYMBOLS.US];
            for (const symbol of allStocks) {
                // Yahoo Finance (Ücretsiz katman)
                const result = await yahooFinance.quote(symbol);

                this.updateCache({
                    symbol,
                    price: result.regularMarketPrice || 0,
                    change: result.regularMarketChange || 0,
                    changePercent: result.regularMarketChangePercent || 0,
                    high: result.regularMarketDayHigh || 0,
                    low: result.regularMarketDayLow || 0,
                    volume: result.regularMarketVolume || 0,
                    source: 'YAHOO',
                    updatedAt: Date.now()
                });
            }
        } catch (e) {
            // Yahoo bazen rate limit atabilir, session reset gerekebilir
            console.error('Stock sentinel error:', e);
        }
    }

    private updateCache(data: MarketData) {
        this.cache.set(data.symbol, data);
    }

    public getAllPrices(): MarketData[] {
        return Array.from(this.cache.values());
    }

    public getPrice(symbol: string): MarketData | undefined {
        return this.cache.get(symbol);
    }
}
