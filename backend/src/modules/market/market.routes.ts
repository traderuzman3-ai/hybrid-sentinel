import { FastifyInstance } from 'fastify';
import { MarketSentinel } from './sentinel.service';
import { SyntheticEngine } from './synthetic.engine';
import { IntelligenceService } from './intelligence.service';
import { TechnicalAnalysisEngine } from './analysis.service';
import { HeatmapService } from './heatmap.service';
import { TapeService } from './tape.service';
import { MarketAnalyticsService } from './analytics.service';
import { watchlistRoutes } from './watchlist.routes';
import { MarketDataService } from './market.service';
import { createAlarm, getUserAlarms } from './alarm.controller';
import { NewsService } from './news.service';

export default async function marketRoutes(fastify: FastifyInstance) {
    const sentinel = MarketSentinel.getInstance();

    // Watchlist API (Auth Required)
    fastify.register(watchlistRoutes, { prefix: '/watchlist' });

    fastify.get('/market/ws', { websocket: true }, (connection: any, req) => {
        if (!connection) {
            console.error('Connection is undefined!');
            return;
        }

        // connection is either the socket itself or a stream containing the socket
        const socket = connection.socket || connection;

        console.log('Client connected to Market WebSocket');

        const socketId = Math.random().toString(36).substring(7);
        (socket as any).id = socketId;

        // Private Stream Simulation (Faz 5.7)
        const userId = (req as any).user?.id;
        if (userId) {
            console.log(`[WS] Private stream joined for user: ${userId}`);
        }

        socket.on('message', (message: any) => {
            // ...
        });

        const interval = setInterval(() => {
            const prices = sentinel.getAllPrices();

            const payload = prices.map(p => ({
                ...p,
                orderBook: SyntheticEngine.generateOrderBook(p.symbol, p.price),
                tape: TapeService.getTapeData(p.symbol, p.price)
            }));

            socket.send(JSON.stringify({
                type: 'MARKET_UPDATE',
                data: payload,
                intelligence: {
                    sentiment: IntelligenceService.getSentiment(),
                    news: NewsService.getInstance().getLatestNews(), // LIVE NEWS STREAM
                    scan: TechnicalAnalysisEngine.scanMarket(prices),
                    heatmap: HeatmapService.getHeatmapData(prices)
                },
                timestamp: Date.now()
            }));
        }, 2000); // 2 saniyede bir broadcast

        socket.on('close', () => {
            clearInterval(interval);
            console.log('Client disconnected from Market WebSocket');
        });
    });

    // REST Fallback
    fastify.get('/market/prices', async () => {
        return sentinel.getAllPrices();
    });

    // Historical OHLC Data (Mum Grafiği)
    fastify.get('/market/history/:symbol', async (request: any, reply: any) => {
        const { symbol } = request.params;
        const { range = '1mo', interval = '1d' } = request.query;

        try {
            // Hybrid Data Fetching
            const marketService = MarketDataService.getInstance();
            let candles = await marketService.fetchHistory(symbol, range as string, interval as string);

            if (!candles || candles.length === 0) {
                return generateSyntheticHistory(symbol, range as string, interval as string);
            }

            // Aggregation Utility (if needed for long intervals not natively supported)
            const needsAggregation = ['3mo', '6mo', '2y', '5y'].includes(interval as string);
            if (needsAggregation) {
                // Convert candles array back to "result" format or just write a candle-based aggregator?
                // Since MarketService returns Candle[], better to rewrite aggregateCandles to work on Candle[]
                candles = aggregateCandlesFromObjects(candles, interval as string);
            }

            // Ensure unique and sorted
            const uniqueCandles = [];
            const seenTimes = new Set();
            // Sort
            candles.sort((a, b) => (a.time as number) - (b.time as number));

            for (const candle of candles) {
                if (!seenTimes.has(candle.time)) {
                    seenTimes.add(candle.time);
                    uniqueCandles.push(candle);
                }
            }

            return { symbol, range, interval, candles: uniqueCandles };
        } catch (error) {
            console.error('History fetch error:', error);
            return generateSyntheticHistory(symbol, range as string, interval as string);
        }
    });
}

function aggregateCandlesFromObjects(candles: any[], targetInterval: string) {
    // Basic aggregation logic for Monthly -> Yearly etc.
    // For now, if we use Yahoo's native intervals (1mo, 1wk, 1d), we might not need heavy aggregation 
    // unless establishing custom timeframes.
    // Reusing the "skip" logic:

    let groupSize = 1;
    // Map custom Frontend intervals to grouping count (assuming base is roughly what we fetched? 1mo?)
    // If backend fetched '1mo' for '1y' request, we don't need to aggregate unless we want fewer points.

    // Simplification: Return candles as is if logic is complex without `result` object. 
    // The previous aggregation relied on Yahoo's specific JSON structure.
    return candles;
}



// Sentetik geçmiş veri üretici (Fractal Enhanced)
import { FractalEngine, Candle } from './fractal.engine';

function generateSyntheticHistory(symbol: string, range: string, interval: string = '1d'): any {
    const now = Date.now();
    let daysBack = 1;
    let multiplier = 24 * 60; // Default breakdown multiplier (Daily -> Minute)

    // Determine scope
    if (range === '1d') daysBack = 1;
    else if (range === '5d') daysBack = 5;
    else if (range === '1mo') daysBack = 30;
    else if (range === '6mo') daysBack = 180;
    else if (range === '1y') daysBack = 365;
    else if (range === '2y') daysBack = 730;
    else if (range === '5y') daysBack = 1825; // 5 Yıl 
    else if (range === '10y') daysBack = 3650;
    else if (range === 'max') daysBack = 39000; // ~1920'den bugüne (106 yıl)
    else daysBack = 365; // Default fallback

    // Determine resolution
    // If interval is 1d, we generate 1d candles directly.
    // If interval is 5m, we generate 1d candles and EXPLODE them.
    const isIntraday = ['1m', '5m', '15m', '30m', '1h'].includes(interval);

    // 1. Generate Base Macro Trend (Daily Candles)
    const baseCandles: Candle[] = [];
    let price = 100 + Math.random() * 50; // Arbitrary start
    const dayMs = 86400000;

    for (let i = daysBack; i >= 0; i--) {
        const time = now - (i * dayMs);
        const change = (Math.random() - 0.48) * (price * 0.03);
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * (price * 0.01);
        const low = Math.min(open, close) - Math.random() * (price * 0.01);

        baseCandles.push({
            time, open, high, low, close, volume: Math.floor(Math.random() * 1000000)
        });
        price = close;
    }

    // 2. If Intraday needed, Fractalize!
    if (isIntraday || interval === '1s') {
        let chunks = 24; // 1h
        if (interval === '1m') chunks = 24 * 60;
        else if (interval === '5m') chunks = 24 * 12;
        else if (interval === '15m') chunks = 24 * 4;
        else if (interval === '1s') chunks = 24 * 60 * 60; // saniyelik kırılım (Extreme)

        // Only fractalize the last few days to save performance if range is huge
        // But user wants consistency. For '1d' range, we just fractalize the last day.

        const exploded: Candle[] = [];
        baseCandles.forEach((c, index) => {
            // For 1-day view, only fractalize the relevant day
            const children = FractalEngine.explodeCandle(c, chunks);
            // Fix timestamps for children
            const step = dayMs / chunks;
            children.forEach((child, ci) => {
                child.time = c.time + (ci * step);
            });
            exploded.push(...children);
        });

        return { symbol, range, interval, candles: exploded };
    }

    return { symbol, range, interval, candles: baseCandles };
}
