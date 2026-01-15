import prisma from '../../lib/prisma';

export class RiskEngine {
    private static MAINTENANCE_MARGIN_RATE = 0.05; // %5 bakım marjini

    /**
     * Dinamik Marjin Hesaplama (Faz 6.1)
     */
    public static calculateRequiredMargin(amount: number, price: number, leverage: number) {
        const initialMargin = (Math.abs(amount) * price) / leverage;
        const maintenanceMargin = (Math.abs(amount) * price) * this.MAINTENANCE_MARGIN_RATE;
        return { initialMargin, maintenanceMargin };
    }

    /**
     * Kullanıcının toplam risk durumunu kontrol eder (Faz 6.1, 6.5)
     */
    public static async checkUserRisk(userId: string) {
        const positions = await prisma.position.findMany({
            where: { userId, isOpen: true }
        });

        const wallet = await (prisma.wallet as any).findUnique({
            where: { userId_currency: { userId, currency: 'TRY' } }
        });

        if (!wallet) return { status: 'SAFE', details: 'No wallet' };

        let totalUnrealizedPnl = 0;
        let totalMaintenanceMargin = 0;

        for (const pos of positions) {
            totalUnrealizedPnl += pos.pnl;
            const { maintenanceMargin } = this.calculateRequiredMargin(pos.quantity, pos.currentPrice, pos.leverage);
            totalMaintenanceMargin += maintenanceMargin;
        }

        const accountEquity = wallet.balance + totalUnrealizedPnl;
        const marginLevel = (accountEquity / totalMaintenanceMargin) * 100;

        // Faz 6.7: Margin Call
        if (marginLevel < 120 && marginLevel > 100) {
            return { status: 'MARGIN_CALL', marginLevel };
        }

        // Faz 6.5: Stop-out (Likidasyon eşiği)
        if (marginLevel <= 100) {
            return { status: 'LIQUIDATION_REQUIRED', marginLevel };
        }

        return { status: 'SAFE', marginLevel };
    }
}
