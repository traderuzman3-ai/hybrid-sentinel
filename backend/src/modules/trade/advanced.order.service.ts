import prisma from '../../lib/prisma';
import { MatchingEngine } from './matching.engine';

export class AdvancedOrderService {
    /**
     * Trailing Stop, OCO, Bracket Orders (Faz 5.4)
     * Bu servis gelişmiş emir mantıklarını yönetir.
     */
    public static async placeOcoOrder(userId: string, symbol: string, side: 'BUY' | 'SELL', qty: number, limitPrice: number, stopPrice: number) {
        // One-Cancels-the-Other (Biri diğerini iptal eder)
        // Aynı anda bir Limit ve bir Stop-Limit emri açılır.

        const order1 = await prisma.order.create({
            data: {
                userId, symbol, side, type: 'LIMIT', quantity: qty, price: limitPrice, status: 'OPEN',
                metadata: JSON.stringify({ ocoGroup: 'GROUP_123' })
            }
        });

        const order2 = await prisma.order.create({
            data: {
                userId, symbol, side, type: 'STOP_LIMIT', quantity: qty, price: stopPrice, status: 'OPEN',
                metadata: JSON.stringify({ ocoGroup: 'GROUP_123' })
            }
        });

        return { success: true, orders: [order1, order2] };
    }

    /**
     * Kısmi Eşleşme ve Zaman Aşımı (Faz 5.5)
     */
    public static async monitorOrderExpiration() {
        const expiredOrders = await prisma.order.findMany({
            where: {
                status: 'OPEN',
                createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 saat
            }
        });

        for (const order of expiredOrders) {
            await prisma.order.update({
                where: { id: order.id },
                data: { status: 'EXPIRED' }
            });
        }
    }
}
