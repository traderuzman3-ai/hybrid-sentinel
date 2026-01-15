import prisma from '../../lib/prisma';
import { RiskEngine } from './risk.engine';

export class LiquidationService {
    /**
     * Likidasyon Motoru (Faz 6.2)
     */
    public static async processLiquidations() {
        console.log('[LIQUIDATION] Scanning for risky positions...');

        // Tüm açık pozisyonları olan kullanıcıları bul (Simülasyon için basitleştirilmiş)
        const usersWithPositions = await prisma.position.findMany({
            where: { isOpen: true },
            distinct: ['userId']
        });

        for (const user of usersWithPositions) {
            const risk = await RiskEngine.checkUserRisk(user.userId);

            if (risk.status === 'LIQUIDATION_REQUIRED') {
                await this.liquidateUser(user.userId);
            }
        }
    }

    private static async liquidateUser(userId: string) {
        console.warn(`[LIQUIDATION] Liquidating user ${userId}!`);

        // Tüm pozisyonları piyasa fiyatından kapat
        const positions = await prisma.position.findMany({
            where: { userId, isOpen: true }
        });

        for (const pos of positions) {
            await prisma.$transaction([
                prisma.position.update({
                    where: { id: pos.id },
                    data: { isOpen: false, closedAt: new Date() }
                }),
                // Kalan bakiyeyi sigorta fonuna devret (Faz 6.4)
                prisma.ledgerEntry.create({
                    data: {
                        userId,
                        type: 'LIQUIDATION',
                        amount: -pos.margin, // Tüm teminatı al
                        currency: 'TRY',
                        status: 'COMPLETED',
                        metadata: JSON.stringify({ reason: 'Liquidation', symbol: pos.symbol })
                    }
                })
            ]);
        }

        // Faz 6.8: Negatif Bakiye Koruması
        const wallet = await (prisma.wallet as any).findUnique({
            where: { userId_currency: { userId, currency: 'TRY' } }
        });

        if (wallet && wallet.balance < 0) {
            console.log(`[PROTECTION] Negative balance protection triggered for ${userId}`);
            await (prisma.wallet as any).update({
                where: { id: wallet.id },
                data: { balance: 0 }
            });
        }
    }
}
