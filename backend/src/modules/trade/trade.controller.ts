import { FastifyRequest, FastifyReply } from 'fastify';
import { MatchingEngine } from './matching.engine';

import prisma from '../../lib/prisma';
import { MarketSentinel } from '../market/sentinel.service';

export async function placeOrder(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;
    // user'ı body'den çıkaralım, sadece order verisi kalsın
    const orderData = req.body as any;

    try {
        // Matching Engine'e ilet
        const order = await MatchingEngine.getInstance().placeOrder(userId, orderData);
        return { success: true, orderId: order.id, status: order.status };
    } catch (error: any) {
        req.log.error(error);
        return reply.status(400).send({ error: 'Emir iletilemedi: ' + error.message });
    }
}

export async function getOpenPositions(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;

    // 1. Cüzdan Bilgilerini Çek
    const wallet = await prisma.wallet.findUnique({
        where: { userId_currency: { userId, currency: 'TRY' } }
    });

    // 2. Açık Pozisyonları Çek
    const positions = await prisma.position.findMany({
        where: { userId, isOpen: true }
    });

    // 3. Hesaplamalar
    let totalStockValue = 0;
    let totalPnl = 0;
    const enrichedPositions = positions.map(pos => {
        const marketData = MarketSentinel.getInstance().getPrice(pos.symbol);
        const currentPrice = marketData?.price || pos.entryPrice;

        // Ortalama maliyeti kullan, yoksa giriş fiyatı
        const costBasis = pos.avgPrice || pos.entryPrice;

        const marketValue = currentPrice * pos.quantity;
        const costValue = costBasis * pos.quantity;

        const pnl = marketValue - costValue;
        const pnlPercent = (pnl / costValue) * 100;

        totalStockValue += marketValue;
        totalPnl += pnl;

        return {
            ...pos,
            currentPrice,
            marketValue,
            pnl,
            pnlPercent,
            avgPrice: costBasis
        };
    });

    const balance = wallet?.balance || 0;
    const t1 = wallet?.balance_t1 || 0;
    const t2 = wallet?.balance_t2 || 0;

    // Çekilebilir Bakiye Formülü: Mevcut İşlem Limiti - (Henüz Takasa Girmemiş T1+T2)
    // Aslında "Bakiye" field'ını Trade Limit olarak kullanıyoruz. Nakit paramızın üzerine satıştan limit eklendi.
    // Ancak nakit olarak çekebilmemiz için, satıştan gelen o "fazla limiti" düşmemiz lazım.
    // Örnek: Nakit 100. Satış 10. Balance = 110. T2 = 10.
    // Çekilebilir = 110 - 10 = 100. Doğru.
    // Örnek: Nakit 100. Alış 10. Balance = 90.
    // Çekilebilir = 90. Doğru.
    const withdrawable = balance - (t1 + t2);

    const totalEquity = balance + totalStockValue; // Toplam Varlık (Para + Hisse)

    return {
        summary: {
            totalEquity,
            balance, // Kullanılabilir (Trade) Limiti
            withdrawable, // Çekilebilir Nakit
            t1,
            t2,
            totalPnl,
            pnlPercent: (totalPnl / (totalEquity - totalPnl)) * 100 // Basit ROI
        },
        positions: enrichedPositions
    };
}

export async function getOrderHistory(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;

    // Geçmiş 50 işlemi getir
    const history = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return history;
}
