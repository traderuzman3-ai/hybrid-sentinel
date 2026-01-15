import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../lib/prisma';
import { FinancialService } from './financial.service';

export async function depositFunds(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;
    const { amount, method, bankName, txHash, currency } = req.body as any;

    try {
        let entry;
        if (method === 'BANK') {
            entry = await FinancialService.simulateBankDeposit(userId, amount, bankName);
        } else {
            entry = await FinancialService.simulateCryptoTransfer(userId, amount, currency || 'BTC', txHash);
        }

        // Uzlaştırmayı tetikle (Kripto ise hemen, banka ise admin onayından sonra olur normalde)
        if (entry.status === 'COMPLETED') {
            await FinancialService.reconcileBalance(userId, entry.currency);
        }

        return { success: true, entry };
    } catch (error: any) {
        return reply.status(400).send({ error: error.message });
    }
}

export async function getWallets(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;
    const wallets = await prisma.wallet.findMany({ where: { userId } });
    return { wallets };
}

export async function exportStatement(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;
    const entries = await prisma.ledgerEntry.findMany({ where: { userId } });

    // CSV formatı simülasyonu
    const csv = "Date,Type,Amount,Currency,Status\n" +
        entries.map(e => `${e.createdAt},${e.type},${e.amount},${e.currency},${e.status}`).join('\n');

    return reply.header('Content-Type', 'text/csv').send(csv);
}
