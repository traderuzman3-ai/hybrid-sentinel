import prisma from '../../lib/prisma';

export class FinancialService {
    /**
     * Banka Entegrasyonu (EFT/Havale) - Faz 3.1
     */
    public static async simulateBankDeposit(userId: string, amount: number, bankName: string) {
        const referenceId = `BNK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        return await prisma.ledgerEntry.create({
            data: {
                userId,
                type: 'DEPOSIT',
                amount,
                currency: 'TRY',
                referenceId,
                status: 'PENDING',
                metadata: JSON.stringify({ bank: bankName, type: 'EFT' })
            }
        });
    }

    /**
     * Kripto Para Yatırma/Çekme - Faz 3.2
     */
    public static async simulateCryptoTransfer(userId: string, amount: number, currency: string, txHash: string) {
        return await prisma.ledgerEntry.create({
            data: {
                userId,
                type: 'DEPOSIT',
                amount,
                currency,
                referenceId: txHash,
                status: 'COMPLETED', // Kripto doğrulanmış varsayıyoruz
                metadata: JSON.stringify({ network: 'Mainnet', method: 'Blockchain' })
            }
        });
    }

    /**
     * Komisyon (Fee) Hesaplama - Faz 3.4
     */
    public static async calculateFee(userId: string, amount: number) {
        const user = await prisma.user.findUnique({ where: { id: userId } }) as any;
        let feeRate = 0.002; // Standart %0.2

        // Tier bazlı indirimler
        if (user?.kycTier === 2) feeRate = 0.001; // %0.1
        if (user?.kycTier === 3) feeRate = 0.0005; // %0.05

        return amount * feeRate;
    }

    /**
     * Bakiye Uzlaştırma (Reconciliation) - Faz 3.3
     */
    public static async reconcileBalance(userId: string, currency: string) {
        const entries = await prisma.ledgerEntry.findMany({
            where: { userId, currency, status: 'COMPLETED' }
        });

        const calculatedBalance = entries.reduce((acc, entry) => {
            if (['DEPOSIT', 'TRADE_PROFIT', 'TRANSFER_IN'].includes(entry.type)) {
                return acc + entry.amount;
            }
            return acc - entry.amount;
        }, 0);

        // Wallet'ı güncelle
        await prisma.wallet.upsert({
            where: { userId_currency: { userId, currency } },
            create: { userId, currency, balance: calculatedBalance },
            update: { balance: calculatedBalance }
        });

        return calculatedBalance;
    }

    /**
     * Varlık Dondurma - Faz 3.7
     */
    public static async freezeAsset(userId: string, currency: string, amount: number) {
        const wallet = await prisma.wallet.findUnique({
            where: { userId_currency: { userId, currency } }
        });

        if (!wallet || wallet.balance < amount) throw new Error("Yetersiz bakiye");

        await prisma.wallet.update({
            where: { id: wallet.id },
            data: {
                balance: { decrement: amount },
                frozen: { increment: amount }
            }
        });
    }
}
