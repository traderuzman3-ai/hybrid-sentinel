import { MarketProvider } from './providers/provider.interface';
import { TradingViewProvider } from './providers/tradingview.provider';
import { InvestingProvider } from './providers/investing.provider';
import { YahooProvider } from './providers/yahoo.provider';
import { MarketData } from './sentinel.service';

export class HybridMarketService {
    private providers: MarketProvider[];

    private requestCount: number = 0;
    private readonly BATCH_SIZE = 5;

    constructor() {
        // Initialize providers in priority order
        this.providers = [
            new TradingViewProvider(),
            new InvestingProvider(),
            new YahooProvider()
            // Add Google/Bloomberg later
        ];
    }

    async fetchPrice(symbol: string): Promise<Partial<MarketData> | null> {
        this.requestCount++;

        // Round-Robin Logic: Each provider handles 5 requests in a row before switching
        // requestCount = 1..5 -> Index 0
        // requestCount = 6..10 -> Index 1
        const primaryIndex = Math.floor((this.requestCount - 1) / this.BATCH_SIZE) % this.providers.length;

        // Re-order providers list to start with the selected primary, followed by others as fallback
        const orderedProviders = [
            ...this.providers.slice(primaryIndex),
            ...this.providers.slice(0, primaryIndex)
        ];

        console.log(`[HybridMarket] Request #${this.requestCount} -> Primary: ${orderedProviders[0].name}`);

        for (const provider of orderedProviders) {
            try {
                // Add human-like random delay (100-500ms) to avoid burst patterns
                await new Promise(r => setTimeout(r, 100 + Math.random() * 400));

                const data = await provider.getPrice(symbol);
                if (data && data.price) {
                    console.log(`✅ Data found from ${provider.name} for ${symbol}`);
                    return data;
                }
            } catch (err) {
                console.warn(`⚠️ ${provider.name} failed for ${symbol}`);
                // Continue to next provider in the rotated list
            }
        }

        console.error(`❌ All providers failed for ${symbol}`);
        return null; // All failed
    }
}
