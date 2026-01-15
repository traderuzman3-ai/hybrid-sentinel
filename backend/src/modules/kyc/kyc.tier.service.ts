import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../lib/prisma';

export const KYC_LIMITS: Record<number, { dailyWithdraw: number, monthlyWithdraw: number, label: string }> = {
    0: { dailyWithdraw: 0, monthlyWithdraw: 0, label: "Unverified" },
    1: { dailyWithdraw: 10000, monthlyWithdraw: 50000, label: "Starter" },
    2: { dailyWithdraw: 50000, monthlyWithdraw: 250000, label: "Verified / Tier 2" },
    3: { dailyWithdraw: 500000, monthlyWithdraw: 2000000, label: "VIP / Tier 3" }
};

export async function upgradeKycTier(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;
    const { newTier } = req.body as { newTier: number };

    if (![1, 2, 3].includes(newTier)) {
        return reply.status(400).send({ error: "Geçersiz Tier seviyesi." });
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { kycTier: newTier }
    });

    return { success: true, tier: newTier, limits: KYC_LIMITS[newTier] };
}

export async function checkWithdrawLimits(userId: string, amount: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return false;

    const limits = KYC_LIMITS[user.kycTier as keyof typeof KYC_LIMITS];

    // Basitleştirilmiş: Sadece bugünkü çekimleri kontrol et
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyTotal = await prisma.ledgerEntry.aggregate({
        where: {
            userId,
            type: 'WITHDRAWAL',
            createdAt: { gte: today }
        },
        _sum: { amount: true }
    });

    const currentTotal = dailyTotal._sum.amount || 0;
    return (currentTotal + amount) <= limits.dailyWithdraw;
}
