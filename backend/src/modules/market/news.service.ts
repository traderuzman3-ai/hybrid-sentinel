import { MarketData } from './sentinel.service';

export interface NewsItem {
    id: string;
    headline: string;
    source: string; // 'Reuters', 'Bloomberg', 'KAP', 'CoinDesk'
    category: 'CRYPTO' | 'STOCK' | 'FOREX' | 'MACRO';
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    timestamp: number;
    relatedSymbol?: string;
}

export class NewsService {
    private static instance: NewsService;
    private newsBuffer: NewsItem[] = [];

    private constructor() { }

    public static getInstance(): NewsService {
        if (!NewsService.instance) {
            NewsService.instance = new NewsService();
        }
        return NewsService.instance;
    }

    /**
     * Generates a news item based on market data movement.
     * "Context-Aware Headlines"
     */
    public generateMarketNews(data: MarketData): NewsItem | null {
        // Only generate news for significant moves to reduce noise
        if (Math.abs(data.changePercent) < 1.5) return null;

        const isPositive = data.changePercent > 0;
        const action = isPositive ?
            ['Surges', 'Jumps', 'Rallies', 'Soars', 'Climbs'] :
            ['Plunges', 'Drops', 'Slips', 'Tumbles', 'Retreats'];

        const reason = isPositive ?
            ['on strong earnings hopes', 'driven by buying momentum', 'breaking key resistance', 'on sector optimism'] :
            ['on profit taking', 'amidst global uncertainty', 'breaking key support', 'on weak volume'];

        const randomAction = action[Math.floor(Math.random() * action.length)];
        const randomReason = reason[Math.floor(Math.random() * reason.length)];

        let source = 'Terminal Wire';
        if (data.type === 'CRYPTO') source = 'CoinDesk';
        else if (data.type === 'BIST') source = 'KAP';
        else source = 'Bloomberg';

        return {
            id: Math.random().toString(36).substring(7),
            headline: `${data.symbol} ${randomAction} ${data.changePercent.toFixed(2)}% ${randomReason}.`,
            source: source,
            category: data.type === 'CRYPTO' ? 'CRYPTO' : 'STOCK',
            impact: Math.abs(data.changePercent) > 5 ? 'HIGH' : 'MEDIUM',
            timestamp: Date.now(),
            relatedSymbol: data.symbol
        };
    }

    public getLatestNews(): NewsItem[] {
        // Generate some random macro news occasionally
        if (Math.random() > 0.7) {
            this.generateMacroNews();
        }
        return this.newsBuffer.slice(-20).reverse(); // Return last 20 reversed
    }

    public addNews(item: NewsItem) {
        this.newsBuffer.push(item);
        if (this.newsBuffer.length > 100) this.newsBuffer.shift(); // Keep buffer clean
    }

    private generateMacroNews() {
        const templates = [
            'Fed Signals Rate Cuts May Start Sooner Than Expected',
            'ECB President Lagarde: "Inflation is under control"',
            'Oil Prices Stabilize Near $80 Amid Geopolitical Tensions',
            'Goldman Sachs Raises Global GDP Forecast',
            'Asian Markets Mixed as Investors Await China Data',
            'Bitcoin Hashrate Hits New All-Time High',
            'Tech Sector Leads Rally in Pre-Market Trading'
        ];

        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

        this.addNews({
            id: Math.random().toString(36).substring(7),
            headline: randomTemplate,
            source: 'Reuters',
            category: 'MACRO',
            impact: 'HIGH',
            timestamp: Date.now()
        });
    }
}
