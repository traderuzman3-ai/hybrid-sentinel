import prisma from '../../lib/prisma';

export class MarketAnalyticsService {
    /**
     * Varlık bazlı açık emirleri ve geçmişi getirir (Faz 4.1)
     */
    public static async getAssetDetails(userId: string, symbol: string) {
        const openOrders = await prisma.order.findMany({
            where: { userId, symbol, status: 'OPEN' },
            orderBy: { createdAt: 'desc' }
        });

        const tradeHistory = await prisma.ledgerEntry.findMany({
            where: { userId, currency: symbol.split('-')[0] }, // TRX-USD -> TRX
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return { openOrders, tradeHistory };
    }

    /**
     * Piyasa Genişliği (Market Breadth) Analizi (Faz 4.4)
     */
    public static async getMarketBreadth() {
        // Simülasyon: Kaç varlık yükseliyor, kaçı düşüyor
        const totalAssets = 50;
        const advancing = Math.floor(Math.random() * 35) + 5;
        const declining = totalAssets - advancing;

        return {
            ratio: (advancing / declining).toFixed(2),
            advancing,
            declining,
            sentiment: advancing > declining ? 'BULLISH' : 'BEARISH'
        };
    }
}
