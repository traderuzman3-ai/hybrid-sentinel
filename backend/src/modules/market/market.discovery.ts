import { MarketType } from './sentinel.service';

export class MarketDiscoveryService {
    private static instance: MarketDiscoveryService;
    private symbolCache: Map<MarketType, string[]> = new Map();

    private constructor() {
        this.seedGlobalMarkets();
    }

    public static getInstance(): MarketDiscoveryService {
        if (!MarketDiscoveryService.instance) {
            MarketDiscoveryService.instance = new MarketDiscoveryService();
        }
        return MarketDiscoveryService.instance;
    }

    public getSymbols(type: MarketType = 'BIST'): string[] {
        return this.symbolCache.get(type) || [];
    }

    public getAllSymbols(): { symbol: string, type: MarketType }[] {
        const all: { symbol: string, type: MarketType }[] = [];
        this.symbolCache.forEach((symbols, type) => {
            symbols.forEach(s => all.push({ symbol: s, type }));
        });
        return all;
    }

    private seedGlobalMarkets() {
        // 1. BIST (Turkey) - Expanded
        const bist = [
            'THYAO.IS', 'ASELS.IS', 'GARAN.IS', 'SISE.IS', 'EREGL.IS', 'KCHOL.IS', 'AKBNK.IS', 'YKBNK.IS', 'TUPRS.IS', 'FROTO.IS',
            'BIMAS.IS', 'HEKTS.IS', 'KOZAL.IS', 'EKGYO.IS', 'VESTL.IS', 'ODAS.IS', 'PETKM.IS', 'ALARK.IS', 'SAHOL.IS', 'TCELL.IS',
            'HALKB.IS', 'VAKBN.IS', 'ENKAI.IS', 'PGSUS.IS', 'TOASO.IS', 'ARCLK.IS', 'AEFES.IS', 'MGROS.IS', 'SOKM.IS', 'KONTR.IS',
            // ... (We can assume the full 500 list is dynamically fetched or file-based in real prod)
            'SASA.IS', 'ASTOR.IS', 'GUBRF.IS', 'ISCTR.IS'
        ];
        this.symbolCache.set('BIST', bist);

        // 2. US Market (Tech, Finance, Energy - EXPANDED)
        const us = [
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX', 'AMD', 'INTC',
            'JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'V', 'MA', 'AXP',
            'XOM', 'CVX', 'COP', 'SLB', 'EOG',
            'JNJ', 'PFE', 'UNH', 'LLY', 'MRK', 'ABBV',
            'PEP', 'KO', 'MCD', 'WMT', 'COST', 'TGT',
            'DIS', 'CMCSA', 'VZ', 'T', 'TMUS',
            'BA', 'LMT', 'RTX', 'GE', 'MMM', 'CAT', 'DE'
        ];
        this.symbolCache.set('US_STOCK', us);

        // 3. Europe (Germany, UK, France)
        const eu = [
            'SAP.DE', 'SIE.DE', 'ALV.DE', 'DTE.DE', 'BMW.DE', 'VOW3.DE', // DAX
            'SHEL.L', 'AZN.L', 'HSBA.L', 'ULVR.L', 'BP.L', 'RIO.L', // FTSE
            'MC.PA', 'OR.PA', 'TTE.PA', 'SAN.PA', 'AIR.PA' // CAC
        ];
        this.symbolCache.set('EU_STOCK', eu as any); // Extending type dynamically or need to update Type def

        // 4. Asia (India, Japan, China)
        const asia = [
            'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', // India (NSE)
            '7203.T', '6758.T', '9984.T', '9983.T', '8035.T', // Japan (Toyota, Sony, Softbank...)
            '0700.HK', '9988.HK', '3690.HK' // China/HK (Tencent, Baba, Meituan)
        ];
        this.symbolCache.set('ASIA_STOCK', asia as any);

        // 5. Russia (MOEX - Check availability)
        // Yahoo uses .ME for Moscow. Note: Data might be stale/frozen.
        const russia = [
            'SBER.ME', 'GAZP.ME', 'LKOH.ME', 'ROSN.ME', 'NVTK.ME', 'YNDX.ME'
        ];
        this.symbolCache.set('RUSSIA_STOCK' as any, russia);

        // 6. Crypto (Major + Meme)
        const crypto = [
            'BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD', 'DOGE-USD', 'SHIB-USD',
            'DOT-USD', 'MATIC-USD', 'LTC-USD', 'UNI-USD', 'LINK-USD', 'ATOM-USD', 'XLM-USD'
        ];
        this.symbolCache.set('CRYPTO', crypto);

        // 7. Commodities & Forex
        const commodities = ['GC=F', 'SI=F', 'CL=F', 'NG=F', 'HG=F', 'PL=F', 'PA=F', 'ZC=F', 'ZW=F'];
        this.symbolCache.set('COMMODITY', commodities);

        const forex = ['TRY=X', 'EURTRY=X', 'USDJPY=X', 'GBPUSD=X', 'EURUSD=X', 'USDCNY=X', 'USDRUB=X', 'USDINR=X'];
        this.symbolCache.set('FOREX', forex);
    }
}
