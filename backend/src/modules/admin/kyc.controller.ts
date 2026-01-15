import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../lib/prisma';
import fs from 'fs';
import path from 'path';

// KYC Doküman Yükleme (Simüle edilmiş)
export async function uploadKycDocument(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = (request.user as any);
        const { documentType, fileContent } = request.body as {
            documentType: string;
            fileContent: string; // Base64 or placeholder content
        };

        // Gerçek bir sistemde burada S3 veya benzeri bir şifreli storage kullanılır.
        // Biz şimdilik simüle ediyoruz.
        const fileUrl = `encrypted_storage/${user.id}_${Date.now()}_${documentType}.dat`;

        const kycDoc = await prisma.kycDocument.create({
            data: {
                userId: user.id,
                documentType,
                fileUrl,
                status: 'PENDING'
            }
        });

        // Kullanıcı durumunu KYC bekleniyor olarak güncelle (e-mail vb tetiklenebilir)
        await prisma.user.update({
            where: { id: user.id },
            data: { kycStatus: 'PENDING' }
        });

        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'KYC_UPLOAD',
                details: JSON.stringify({ documentType, kycDocId: kycDoc.id }),
                ipAddress: request.ip
            }
        });

        return reply.send({ success: true, document: kycDoc });
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'KYC yükleme hatası' });
    }
}

// Admin için KYC Listesi
export async function getKycList(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = (request.user as any);
        if (!user.isAdmin) return reply.status(403).send({ error: 'Yetkisiz erişim' });

        const kycList = await prisma.kycDocument.findMany({
            include: { user: { select: { email: true, firstName: true, lastName: true } } },
            orderBy: { uploadedAt: 'desc' }
        });

        return reply.send(kycList);
    } catch (error) {
        return reply.status(500).send({ error: 'Liste alınamadı' });
    }
}

// Admin için KYC Onay/Ret
export async function updateKycStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
        const admin = (request.user as any);
        if (!admin.isAdmin) return reply.status(403).send({ error: 'Yetkisiz erişim' });

        const { id, status, comment } = request.body as { id: string, status: string, comment?: string };

        const kycDoc = await prisma.kycDocument.update({
            where: { id },
            data: {
                status,
                reviewedAt: new Date(),
                reviewedBy: admin.id
            }
        });

        // Eğer onaylandıysa kullanıcı seviyesini ve durumunu güncelle
        if (status === 'APPROVED') {
            const otherDocs = await prisma.kycDocument.findMany({
                where: { userId: kycDoc.userId, status: 'APPROVED' }
            });

            // Örnek mantık: En az 2 belge onaylıysa işlem yapabilir
            if (otherDocs.length >= 1) {
                await prisma.user.update({
                    where: { id: kycDoc.userId },
                    data: {
                        kycStatus: 'APPROVED',
                        accountLevel: 'TRADING_ENABLED'
                    }
                });
            }
        } else if (status === 'REJECTED') {
            await prisma.user.update({
                where: { id: kycDoc.userId },
                data: { kycStatus: 'REJECTED' }
            });
        }

        await prisma.auditLog.create({
            data: {
                userId: admin.id,
                action: 'KYC_REVIEW',
                details: JSON.stringify({ kycDocId: id, status, targetUserId: kycDoc.userId }),
                ipAddress: request.ip
            }
        });

        return reply.send({ success: true });
    } catch (error) {
        return reply.status(500).send({ error: 'Güncelleme hatası' });
    }
}
