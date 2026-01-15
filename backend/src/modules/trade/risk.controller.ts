import prisma from '../../lib/prisma';
import { RiskEngine } from './risk.engine';
import { InsuranceFundService } from './insurance.service';

export class RiskManagementController {
    /**
     * Admin Risk Dashboard (Faz 6.9)
     */
    public static async getRiskDashboard() {
        const activePositions = await prisma.position.count({ where: { isOpen: true } });
        const totalUnrealizedPnl = await prisma.position.aggregate({
            where: { isOpen: true },
            _sum: { pnl: true }
        });

        const insuranceBalance = await InsuranceFundService.getFundBalance();

        // En riskli 5 kullanıcı
        const riskyUsers = await prisma.position.findMany({
            where: { isOpen: true },
            take: 5,
            orderBy: { pnl: 'asc' }, // En çok zararda olanlar
            include: { user: true }
        });

        return {
            activePositions,
            totalUnrealizedPnl: totalUnrealizedPnl._sum.pnl,
            insuranceBalance,
            riskyUsers,
            systemHealth: 'STABLE'
        };
    }
}
