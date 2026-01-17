import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../lib/prisma';

// Tüm Kullanıcıları Listele (Admin)
export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
        const admin = (request.user as any);
        if (!admin.isAdmin) return reply.status(403).send({ error: 'Yetkisiz erişim' });

        const users = await prisma.users.findMany({
            include: {
                wallets: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Map to safe DTO
        const safeUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            kycStatus: u.kycStatus,
            lastLogin: u.updatedAt, // Using updatedAt as proxy for last active
            wallets: u.wallets.map(w => ({
                currency: w.currency,
                balance: w.balance,
                frozen: w.frozen
            }))
        }));

        return reply.send(safeUsers);
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Kullanıcı listesi alınamadı' });
    }
}

// Bakiye Güncelle (Admin)
export async function updateUserBalance(request: FastifyRequest, reply: FastifyReply) {
    try {
        const admin = (request.user as any);
        if (!admin.isAdmin) return reply.status(403).send({ error: 'Yetkisiz erişim' });

        const { userId, currency, amount } = request.body as { userId: string, currency: string, amount: number };

        if (!userId || !currency || amount === undefined) {
            return reply.status(400).send({ error: 'Eksik parametre' });
        }

        // Find wallet
        const wallet = await prisma.wallets.findFirst({
            where: { userId, currency }
        });

        if (!wallet) return reply.status(404).send({ error: 'Cüzdan bulunamadı' });

        // Update Balance
        const newBalance = wallet.balance + amount;

        await prisma.wallets.update({
            where: { id: wallet.id },
            data: { balance: newBalance }
        });

        // Log Action
        await prisma.auditLog.create({
            data: {
                userId: admin.id,
                action: 'ADMIN_BALANCE_UPDATE',
                details: JSON.stringify({ targetUser: userId, currency, modification: amount, finalBalance: newBalance }),
                ipAddress: request.ip
            }
        });

        return reply.send({ success: true, newBalance });

    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Bakiye güncellenemedi' });
    }
}

// KYC Onayla (Admin)
export async function forceApproveKYC(request: FastifyRequest, reply: FastifyReply) {
    try {
        const admin = (request.user as any);
        if (!admin.isAdmin) return reply.status(403).send({ error: 'Yetkisiz erişim' });

        const { userId } = request.body as { userId: string };

        await prisma.users.update({
            where: { id: userId },
            data: { kycStatus: 'APPROVED' }
        });

        return reply.send({ success: true, status: 'APPROVED' });
    } catch (error) {
        return reply.status(500).send({ error: 'KYC onayı başarısız' });
    }
}
