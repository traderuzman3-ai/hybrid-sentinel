import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../lib/prisma';
import { KycIntelligenceService } from '../kyc/kyc.intelligence';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { pipeline } from 'stream';
const pump = util.promisify(pipeline);

// KYC Doküman Yükleme
export async function uploadKycDocument(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = (request.user as any);
        const parts = (request as any).parts();

        let documentType = '';
        let fileUrl = '';

        // Uploads klasörü yoksa oluştur
        const uploadDir = path.join(__dirname, '../../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Kullanıcıya özel klasör (opsiyonel, şimdilik düz klasör)
        // const userDir = path.join(uploadDir, user.id);
        // if (!fs.existsSync(userDir)) fs.mkdirSync(userDir);

        for await (const part of parts) {
            if (part.type === 'field') {
                if (part.fieldname === 'documentType') {
                    documentType = part.value as string;
                }
            } else if (part.type === 'file') {
                const filename = `${user.id}_${Date.now()}_${part.filename}`;
                const savePath = path.join(uploadDir, filename);

                // Dosyayı kaydet
                await pump(part.file, fs.createWriteStream(savePath));
                fileUrl = `/uploads/${filename}`;
            }
        }

        if (!documentType || !fileUrl) {
            return reply.status(400).send({ error: 'Dosya veya documentType eksik' });
        }

        // Intelligence Simulation (OCR & Risk)
        const ocrData = await KycIntelligenceService.processOcrSimulation(fileUrl);
        const riskScore = await KycIntelligenceService.calculateRiskScore(user.id);

        const kycDoc = await prisma.kycDocument.create({
            data: {
                userId: user.id,
                documentType,
                fileUrl,
                status: 'PENDING',
                ocrData: JSON.stringify(ocrData)
            }
        });

        // Kullanıcı durumu ve Risk Skoru güncelle
        await prisma.user.update({
            where: { id: user.id },
            data: {
                kycStatus: 'PENDING',
                riskScore: riskScore
            }
        });

        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'KYC_UPLOAD',
                details: JSON.stringify({ documentType, kycDocId: kycDoc.id, ocrConfidence: ocrData.confidence }),
                ipAddress: request.ip
            }
        });

        return reply.send({ success: true, document: kycDoc });
    } catch (error) {
        request.log.error(error);
        console.error('KYC Upload Error:', error);
        return reply.status(500).send({ error: 'KYC yükleme hatası' });
    }
}

// Admin için KYC Listesi
export async function getKycList(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = (request.user as any);
        if (!user.isAdmin) return reply.status(403).send({ error: 'Yetkisiz erişim' });

        const kycList = await prisma.kycDocument.findMany({
            include: { user: { select: { email: true, firstName: true, lastName: true, riskScore: true, kycStatus: true } } },
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
