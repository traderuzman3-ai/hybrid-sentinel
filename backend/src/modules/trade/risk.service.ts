import prisma from '../../lib/prisma';

export class RiskService {
    /**
     * Marjin kontrolü yapar. (Faz 6.1)
     */
    public static async checkMargin(userId: string, symbol: string, amount: number, price: number) {
        const totalCost = amount * price;
        const wallet = await prisma.wallet.findUnique({
            where: { userId_currency: { userId, currency: 'TRY' } }
        });

        if (!wallet || wallet.balance < totalCost) {
            throw new Error("Yetersiz marjin/bakiye.");
        }
        return true;
    }

    /**
     * Stop-out kontrolü (Basitleştirilmiş Faz 6.2)
     */
    public static async checkStopOut(userId: string) {
        const positions = await prisma.position.findMany({
            where: { userId, isOpen: true }
        });

        // PnL hesapla ve bakiye ile karşılaştır
        let totalPnL = 0;
        positions.forEach(p => totalPnL += p.pnl);

        const wallet = await prisma.wallet.findUnique({
            where: { userId_currency: { userId, currency: 'TRY' } }
        });

        if (wallet && (wallet.balance + totalPnL) < (wallet.balance * 0.2)) {
            // %20'nin altına düşerse likidasyon/stop-out tetiklenir
            console.warn(`[STOP-OUT] User ${userId} is close to liquidation!`);
            return true;
        }
        return false;
    }
}
