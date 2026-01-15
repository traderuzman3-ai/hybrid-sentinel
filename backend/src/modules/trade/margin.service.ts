import prisma from '../../lib/prisma';

export class MarginService {
    /**
     * Kaldıraçlı işlem için marjin kontrolü (Faz 5.2)
     */
    public static async checkLeveragedMargin(userId: string, amount: number, price: number, leverage: number) {
        const requiredMargin = (amount * price) / leverage;

        const wallet = await (prisma.wallet as any).findUnique({
            where: { userId_currency: { userId, currency: 'TRY' } }
        });

        if (!wallet || wallet.balance < requiredMargin) {
            throw new Error(`Yetersiz bakiye. Gerekli marjin: ${requiredMargin} ₺`);
        }

        return true;
    }

    /**
     * Likidasyon Kontrolü (Faz 5.3)
     */
    public static async checkLiquidation(userId: string) {
        const positions = await prisma.position.findMany({
            where: { userId, isOpen: true }
        });

        for (const pos of positions) {
            // Basitleştirilmiş likidasyon mantığı
            // Eğer fiyat giriş fiyatından %10 (10x kaldıraçta) ters yöne giderse likidasyon olur
            // Bu sadece simülasyondur.
            const pnlPercent = pos.pnl / (Math.abs(pos.quantity) * pos.entryPrice);

            if (pnlPercent < -0.1) {
                console.warn(`[LIQUIDATION] User ${userId} position on ${pos.symbol} is liquidating!`);
                // Pozisyonu kapat, sigorta fonuna devret
                await prisma.position.update({
                    where: { id: pos.id },
                    data: { isOpen: false, pnl: -pos.quantity * pos.entryPrice }
                });
            }
        }
    }
}
