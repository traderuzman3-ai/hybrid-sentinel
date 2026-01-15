import prisma from '../../lib/prisma';

export class InsuranceFundService {
    /**
     * Sigorta Fonu Yönetimi (Faz 6.4)
     */
    public static async getFundBalance() {
        // Simülasyon: Likidasyonlardan gelen kesintilerin toplandığı havuz
        const totalFees = await prisma.ledgerEntry.aggregate({
            where: { type: 'LIQUIDATION' },
            _sum: { amount: true }
        });

        return Math.abs(totalFees._sum.amount || 0);
    }

    /**
     * Sembol Bazlı Pozisyon Limitleri (Faz 6.6)
     */
    public static async checkExposureLimit(userId: string, symbol: string, newAmount: number) {
        const symbolLimit = 1000000; // Örn: 1M TRY limit

        const currentPositions = await prisma.position.findMany({
            where: { userId, symbol, isOpen: true }
        });

        const currentExposure = currentPositions.reduce((sum, p) => sum + (Math.abs(p.quantity) * p.currentPrice), 0);

        if (currentExposure + newAmount > symbolLimit) {
            throw new Error(`Sembol bazlı pozisyon limiti aşıldı! Maksimum: ${symbolLimit} ₺`);
        }

        return true;
    }
}
