import prisma from '../../lib/prisma';

export interface Order {
    id: string;
    userId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT' | 'STOP';
    price?: number;
    quantity: number;
    status: 'PENDING' | 'FILLED' | 'CANCELLED';
    createdAt: Date;
}

interface OrderBookSide {
    price: number;
    orders: any[];
}

export class MatchingEngine {
    private static instance: MatchingEngine;
    private orderBooks: Map<string, { bids: OrderBookSide[], asks: OrderBookSide[] }> = new Map();

    private constructor() { }

    public static getInstance(): MatchingEngine {
        if (!MatchingEngine.instance) {
            MatchingEngine.instance = new MatchingEngine();
        }
        return MatchingEngine.instance;
    }

    /**
     * Bellek içi emir defterini başlatır veya getirir.
     */
    private getOrderBook(symbol: string) {
        if (!this.orderBooks.has(symbol)) {
            this.orderBooks.set(symbol, { bids: [], asks: [] });
        }
        return this.orderBooks.get(symbol)!;
    }

    /**
     * Emir yerleştirme ve eşleşme mantığı.
     */
    public async placeOrder(orderData: any) {
        if (orderData.type === 'MARKET') {
            await this.matchMarketOrder(orderData);
        }
    }

    private async matchMarketOrder(order: Order) {
        // Market emirleri için simüle edilmiş anlık dolum
        await prisma.order.update({
            where: { id: order.id },
            data: { status: 'FILLED', filledAt: new Date() }
        });

        // Pozisyon oluştur
        await this.updatePosition(order);
    }

    private async tryMatch(symbol: string) {
        const book = this.orderBooks.get(symbol);
        if (!book) return;

        while (book.bids.length > 0 && book.asks.length > 0) {
            const bestBuy = book.bids[0];
            const bestSell = book.asks[0];

            if ((bestBuy.price || 0) >= (bestSell.price || 0)) {
                // EŞLEŞME GERÇEKLEŞTİ
                const matchQuantity = Math.min(bestBuy.quantity, bestSell.quantity);

                // Veritabanını güncelle
                await this.executeTrade(bestBuy, bestSell, matchQuantity);

                // Defterden düş veya azalt
                bestBuy.quantity -= matchQuantity;
                bestSell.quantity -= matchQuantity;

                if (bestBuy.quantity === 0) book.bids.shift();
                if (bestSell.quantity === 0) book.asks.shift();
            } else {
                break;
            }
        }
    }

    private async executeTrade(buy: Order, sell: Order, quantity: number) {
        const price = sell.price || buy.price || 0;

        // Emir durumlarını güncelle
        if (buy.quantity === quantity) {
            await prisma.order.update({ where: { id: buy.id }, data: { status: 'FILLED', filledAt: new Date() } });
        }
        if (sell.quantity === quantity) {
            await prisma.order.update({ where: { id: sell.id }, data: { status: 'FILLED', filledAt: new Date() } });
        }

        // Pozisyonları güncelle
        await this.updatePosition({ ...buy, quantity, price });
        await this.updatePosition({ ...sell, quantity, price });
    }

    private async updatePosition(order: any) {
        const existing = await prisma.position.findFirst({
            where: { userId: order.userId, symbol: order.symbol, isOpen: true }
        });

        if (existing) {
            // Mevcut pozisyonu güncelle (Basitleştirilmiş)
            const newQty = order.side === existing.side ? existing.quantity + order.quantity : existing.quantity - order.quantity;
            if (newQty === 0) {
                await prisma.position.update({ where: { id: existing.id }, data: { isOpen: false, closedAt: new Date() } });
            } else {
                await prisma.position.update({ where: { id: existing.id }, data: { quantity: Math.abs(newQty) } });
            }
        } else {
            // Yeni pozisyon aç
            await prisma.position.create({
                data: {
                    userId: order.userId,
                    symbol: order.symbol,
                    side: order.side,
                    quantity: order.quantity,
                    entryPrice: order.price || 0,
                    currentPrice: order.price || 0,
                    margin: (order.price || 0) * order.quantity,
                    leverage: 1
                }
            });
        }
    }
}
