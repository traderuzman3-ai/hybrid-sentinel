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
        // Kripto verilerini 10 saniyede bir tazele
        setInterval(() => this.pollCrypto(), 10000);
        // Yahoo Finance şu an rate limit atıyor, logları kirletmemek için hisseleri geçici olarak kapalı tutuyoruz
        // setInterval(() => this.pollStocks(), 60000); 
    }

    private async pollCrypto() {
        try {
            console.log('🔄 Crypto sentinel polling starting...');
            for (const symbol of SYMBOLS.KRIPTO) {
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
            console.log('🔄 Stock sentinel polling starting...');
            const allStocks = [...SYMBOLS.BIST, ...SYMBOLS.US];
            for (const symbol of allStocks) {
                // Rate limit yememek için her sembol arası 1.5 sn bekle
                await new Promise(resolve => setTimeout(resolve, 1500));

                try {
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
                } catch (innerError: any) {
                    console.error(`Error polling ${symbol}:`, innerError.message);
                }
            }
        } catch (e) {
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
