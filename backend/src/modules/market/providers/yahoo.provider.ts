import yahooFinance from 'yahoo-finance2';
import { MarketProvider } from './provider.interface';
import { MarketData } from '../sentinel.service';

export class YahooProvider implements MarketProvider {
    name = 'Yahoo Finance';
    priority = 3;

    async getPrice(symbol: string): Promise<Partial<MarketData> | null> {
        try {
            const quote = await yahooFinance.quote(symbol);
            if (!quote) return null;

            return {
                source: 'YAHOO',
                price: quote.regularMarketPrice,
                change: quote.regularMarketChange,
                changePercent: quote.regularMarketChangePercent,
                high: quote.regularMarketDayHigh,
                low: quote.regularMarketDayLow,
                volume: quote.regularMarketVolume,
                updatedAt: Date.now()
            };
        } catch (error) {
            return null;
        }
    }
}
