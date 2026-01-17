import prisma from '../../lib/prisma';
import { MarketSentinel } from '../market/sentinel.service';

interface OrderBookEntry {
    id: string;
    userId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    price: number; // Limit Price
    quantity: number;
    createdAt: Date;
}

export class MatchingEngine {
    private static instance: MatchingEngine;
    // Sembol bazlı bekleyen limit emirler
    private pendingOrders: Map<string, OrderBookEntry[]> = new Map();
    // Sembol bazlı bekleyen stop emirler (STOP_LIMIT)
    private stopOrders: Map<string, any[]> = new Map();

    private constructor() { }

    public static getInstance(): MatchingEngine {
        if (!MatchingEngine.instance) {
            MatchingEngine.instance = new MatchingEngine();
        }
        return MatchingEngine.instance;
    }

    public async placeOrder(userId: string, orderData: any) {
        // 1. Emri Veritabanına Kaydet (PENDING)
        const order = await prisma.order.create({
            data: {
                userId,
                symbol: orderData.symbol,
                side: orderData.side,
                type: orderData.type,
                quantity: parseFloat(orderData.quantity),
                price: orderData.price ? parseFloat(orderData.price) : null,
                stopPrice: orderData.stopPrice ? parseFloat(orderData.stopPrice) : null,
                status: 'PENDING'
            }
        });

        // 2. Emir Tipi Kontrolü
        if (orderData.type === 'MARKET') {
            await this.executeMarketOrder(order);
        } else if (orderData.type === 'LIMIT') {
            this.addToQueue(order as any);
        } else if (orderData.type === 'STOP_LIMIT') {
            this.addToStopQueue(order as any);
        }

        return order;
    }

    public async processPriceUpdate(symbol: string, currentPrice: number) {
        // 1. Check Stop Orders (Triggers)
        await this.checkStopTriggers(symbol, currentPrice);

        // 2. Check Limit Orders (Execution)
        const orders = this.pendingOrders.get(symbol) || [];
        if (orders.length === 0) return;

        const remainingOrders: OrderBookEntry[] = [];
        for (const order of orders) {
            let shouldExecute = false;

            if (order.side === 'BUY') {
                if (currentPrice <= order.price) shouldExecute = true;
            } else if (order.side === 'SELL') {
                if (currentPrice >= order.price) shouldExecute = true;
            }

            if (shouldExecute) {
                await this.fillOrder(order.id, currentPrice);
            } else {
                remainingOrders.push(order);
            }
        }
        this.pendingOrders.set(symbol, remainingOrders);
    }

    private addToStopQueue(order: any) {
        const list = this.stopOrders.get(order.symbol) || [];
        list.push(order);
        this.stopOrders.set(order.symbol, list);
        console.log(`[MatchingEngine] Stop Order Added: ${order.id} @ ${order.stopPrice}`);
    }

    private async checkStopTriggers(symbol: string, currentPrice: number) {
        const stops = this.stopOrders.get(symbol) || [];
        if (stops.length === 0) return;

        const remainingStops: any[] = [];

        for (const order of stops) {
            let triggered = false;

            // Stop Logic:
            // BUY STOP: Fiyat Yükselince (Direnc kırılınca al) -> Current >= StopPrice
            // SELL STOP: Fiyat Düşünce (Destek kırılınca sat) -> Current <= StopPrice
            if (order.side === 'BUY') {
                if (currentPrice >= order.stopPrice) triggered = true;
            } else {
                if (currentPrice <= order.stopPrice) triggered = true;
            }

            if (triggered) {
                console.log(`[MatchingEngine] Stop Triggered! Converting ${order.id} to Limit Order.`);
                // Stop emri artık aktif bir Limit emrine dönüşür
                // Kuyruğa ekle
                this.addToQueue(order);
                // DB güncellemesi (İsteğe bağlı, loglayabiliriz)
            } else {
                remainingStops.push(order);
            }
        }
        this.stopOrders.set(symbol, remainingStops);
    }

    /**
     * Piyasa emrini anında o anki fiyattan gerçekleştirir
     */
    private async executeMarketOrder(order: any) {
        const currentPrice = MarketSentinel.getInstance().getPrice(order.symbol);
        if (!currentPrice) {
            // Fiyat yoksa iptal et veya beklet (Şimdilik bekletelim)
            console.warn(`[MatchingEngine] No price for ${order.symbol}, order ${order.id} failed.`);
            return;
        }

        await this.fillOrder(order.id, currentPrice.price);
    }

    /**
     * Emri hafızadaki kuyruğa ekler
     */
    private addToQueue(order: OrderBookEntry) {
        const list = this.pendingOrders.get(order.symbol) || [];
        list.push(order);
        this.pendingOrders.set(order.symbol, list);
        console.log(`[MatchingEngine] Order queued: ${order.symbol} @ ${order.price}`);
    }

    /**
     * Emri "FILLED" olarak işaretle ve bakiyeleri güncelle
     */
    private async fillOrder(orderId: string, fillPrice: number) {
        // 1. Order Statüsünü Güncelle
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'FILLED',
                filledAt: new Date(),
                // Not: Gerçekleşen fiyatı metadata'ya veya ayrı bir 'execution' tablosuna yazabiliriz.
                // Basitlik için burada bırakıyoruz, Order modelinde filledPrice alanı yoksa eklenmeli.
                metadata: JSON.stringify({ filledPrice: fillPrice })
            }
        });

        // 2. Pozisyonları Güncelle (Cüzdan veya Hisse bakiyesi)
        await this.updatePosition(order, fillPrice);

        console.log(`[MatchingEngine] Order FILLED: ${order.symbol} @ ${fillPrice}`);
    }

    private async updatePosition(order: any, price: number) {
        // Gerçek Para Yönetimi (Wallet Balance)
        const totalValue = price * order.quantity;
        const currency = order.symbol.includes('.IS') ? 'TRY' : 'USD'; // BIST=TRY, Global=USD

        // Cüzdanı Bul veya Oluştur
        const wallet = await prisma.wallet.findUnique({
            where: { userId_currency: { userId: order.userId, currency } }
        });

        if (!wallet) {
            console.error(`[MatchingEngine] Wallet not found for ${order.userId} ${currency}`);
            return;
        }

        if (order.side === 'BUY') {
            // ALIM: Cüzdandan PARA DÜŞ
            await prisma.wallet.update({
                where: { id: wallet.id },
                data: { balance: { decrement: totalValue } }
            });
        } else {
            // SATIM: Cüzdana PARA EKLE
            await prisma.wallet.update({
                where: { id: wallet.id },
                data: { balance: { increment: totalValue } }
            });
        }

        // Pozisyon Yönetimi (Hisse Ekle/Çıkar)
        const existing = await prisma.position.findFirst({
            where: { userId: order.userId, symbol: order.symbol, isOpen: true }
        });

        if (existing) {
            let newQty = existing.quantity;
            if (order.side === existing.side) {
                // Pozisyonu Büyüt (Zaten Buy ise Buy ekle)
                // Not: Spot piyasada genelde tek yön (LONG) olur ama burada basit tutuyoruz.
                newQty += order.quantity;

                // Ortalama Maliyet Güncelleme (Ağırlıklı Ortalama)
                if (order.side === 'BUY') {
                    const totalCostOld = existing.avgPrice * existing.quantity;
                    const totalCostNew = price * order.quantity;
                    const avgPrice = (totalCostOld + totalCostNew) / (existing.quantity + order.quantity);

                    await prisma.position.update({
                        where: { id: existing.id },
                        data: { quantity: newQty, avgPrice: avgPrice }
                    });
                } else {
                    // Short pozisyon büyütme (opsiyonel)
                    await prisma.position.update({ where: { id: existing.id }, data: { quantity: newQty } });
                }

            } else {
                // Ters Yön (Satış) -> Miktarı düşür
                newQty -= order.quantity; // Mevcut 10, Sat 5 => Yeni 5

                if (newQty <= 0) {
                    // Tamamen Kapandı
                    await prisma.position.update({ where: { id: existing.id }, data: { isOpen: false, closedAt: new Date(), quantity: 0 } });
                } else {
                    // Kısmen Kapandı (Maliyet değişmez, sadece miktar azalır)
                    await prisma.position.update({ where: { id: existing.id }, data: { quantity: newQty } });
                }
            }
        } else {
            // Hiç pozisyon yoksa yarat
            await prisma.position.create({
                data: {
                    userId: order.userId,
                    symbol: order.symbol,
                    side: order.side,
                    quantity: order.quantity,
                    entryPrice: price,
                    avgPrice: price,
                    currentPrice: price,
                    margin: totalValue,
                    leverage: 1
                }
            });
        }
    }
}
