import prisma from '../../lib/prisma';

export class KycAuditService {
    /**
     * KYC olaylarını loglar (Faz 2.7)
     */
    public static async logEvent(userId: string, action: string, details: any) {
        await prisma.auditLog.create({
            data: {
                userId,
                action: `KYC_${action}`,
                details: JSON.stringify(details),
                createdAt: new Date()
            }
        });
    }

    /**
     * Kullanıcının KYC tarihçesini getirir.
     */
    public static async getKycHistory(userId: string) {
        return await prisma.auditLog.findMany({
            where: {
                userId,
                action: { startsWith: 'KYC_' }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
