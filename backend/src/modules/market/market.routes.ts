import { FastifyInstance } from 'fastify';
import { MarketSentinel } from './sentinel.service';
import { SyntheticEngine } from './synthetic.engine';
import { IntelligenceService } from './intelligence.service';
import { TechnicalAnalysisEngine } from './analysis.service';
import { HeatmapService } from './heatmap.service';
import { TapeService } from './tape.service';
import { MarketAnalyticsService } from './analytics.service';

export default async function marketRoutes(fastify: FastifyInstance) {
    const sentinel = MarketSentinel.getInstance();

    fastify.get('/market/ws', { websocket: true }, (connection, req) => {
        console.log('Client connected to Market WebSocket');

        const socketId = Math.random().toString(36).substring(7);
        (connection.socket as any).id = socketId;

        // Private Stream Simulation (Faz 5.7)
        const userId = (req as any).user?.id;
        if (userId) {
            console.log(`[WS] Private stream joined for user: ${userId}`);
        }

        connection.socket.on('message', message => {
            // ...
        });

        const interval = setInterval(() => {
            const prices = sentinel.getAllPrices();

            const payload = prices.map(p => ({
                ...p,
                orderBook: SyntheticEngine.generateOrderBook(p.symbol, p.price),
                tape: TapeService.getTapeData(p.symbol, p.price)
            }));

            (connection as any).socket.send(JSON.stringify({
                type: 'MARKET_UPDATE',
                data: payload,
                intelligence: {
                    sentiment: IntelligenceService.getSentiment(),
                    news: IntelligenceService.getLiveNews(),
                    scan: TechnicalAnalysisEngine.scanMarket(prices),
                    heatmap: HeatmapService.getHeatmapData(prices)
                },
                timestamp: Date.now()
            }));
        }, 2000); // 2 saniyede bir broadcast

        (connection as any).socket.on('close', () => {
            clearInterval(interval);
            console.log('Client disconnected from Market WebSocket');
        });
    });

    // REST Fallback
    fastify.get('/market/prices', async () => {
        return sentinel.getAllPrices();
    });
}
