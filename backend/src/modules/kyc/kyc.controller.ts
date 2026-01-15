import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../lib/prisma';
import { KycIntelligenceService } from './kyc.intelligence';

export async function submitAdvancedKyc(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req.user as any).id;
  const { documentType, documentUrl, postalCode } = req.body as any;

  try {
    const ocrData = await KycIntelligenceService.processOcrSimulation(documentUrl);
    const liveness = await KycIntelligenceService.verifyLivenessSimulation(userId);
    const riskScore = await KycIntelligenceService.calculateRiskScore(userId);

    const doc = await prisma.kycDocument.create({
      data: {
        userId,
        documentType,
        fileUrl: documentUrl,
        ocrData: JSON.stringify(ocrData),
        livenessScore: liveness.score,
        status: 'PENDING'
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        riskScore,
        kycStatus: 'PENDING'
      }
    });

    return {
      success: true,
      ocrResult: ocrData,
      livenessResult: liveness,
      message: 'KYC başvurunuz akıllı tarayıcı tarafından alındı.'
    };
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function verifyAddress(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req.user as any).id;
  const { postalCode } = req.body as { postalCode: string };

  try {
    const result = await KycIntelligenceService.verifyAddressSimulation(userId, postalCode);

    await prisma.user.update({
      where: { id: userId },
      data: { addressVerified: true }
    });

    return { success: true, ...result };
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function getUserKycStatus(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { kycDocuments: true }
  });
  return user;
}
