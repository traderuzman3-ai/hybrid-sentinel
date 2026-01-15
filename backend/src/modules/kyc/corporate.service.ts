import prisma from '../../lib/prisma';

export class CorporateService {
    /**
     * Kurumsal hesap başvurusunu simüle eder.
     */
    public static async applyForCorporate(userId: string, companyData: any) {
        // 1. Kullanıcıyı kurumsal olarak işaretle (beklemede)
        await prisma.user.update({
            where: { id: userId },
            data: {
                isCorporate: true,
                kycStatus: 'PENDING'
            }
        });

        // 2. Denetim kaydı oluştur
        await prisma.auditLog.create({
            data: {
                userId,
                action: "CORPORATE_APPLICATION",
                details: JSON.stringify(companyData)
            }
        });

        return { success: true, message: "Kurumsal hesap başvurunuz alındı. 24-48 saat içinde incelenecektir." };
    }

    /**
     * Alt hesap (Sub-account) yetki yönetimi simülasyonu.
     */
    public static async manageSubAccount(masterId: string, subEmail: string, permissions: string[]) {
        // Master hesap kurumsal mı kontrol et
        const master = await prisma.user.findUnique({ where: { id: masterId } });
        if (!master?.isCorporate) throw new Error("Sadece kurumsal hesaplar alt hesap yönetebilir.");

        // Alt hesap yetkilerini bir tabloda tutmak gerekir, şimdilik logluyoruz.
        console.log(`Sub-account ${subEmail} updated with permissions: ${permissions.join(', ')}`);

        return { success: true };
    }
}
