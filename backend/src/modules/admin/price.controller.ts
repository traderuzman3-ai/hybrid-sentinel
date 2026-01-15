import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../lib/prisma';

// Manuel Fiyat Belirleme (Admin)
export async function setPriceOverride(request: FastifyRequest, reply: FastifyReply) {
    try {
        const admin = (request.user as any);
        if (!admin.isAdmin) return reply.status(403).send({ error: 'Yetkisiz erişim' });

        const { symbol, overridePrice, spread, slippage, isActive } = request.body as {
            symbol: string;
            overridePrice: number;
            spread?: number;
            slippage?: number;
            isActive?: boolean;
        };

        const priceOverride = await prisma.priceOverride.upsert({
            where: { symbol },
            update: {
                overridePrice,
                spread,
                slippage,
                isActive: isActive !== undefined ? isActive : true,
                createdBy: admin.id
            },
            create: {
                symbol,
                overridePrice,
                spread,
                slippage,
                isActive: true,
                createdBy: admin.id
            }
        });

        await prisma.auditLog.create({
            data: {
                userId: admin.id,
                action: 'PRICE_OVERRIDE',
                details: JSON.stringify({ symbol, overridePrice }),
                ipAddress: request.ip
            }
        });

        return reply.send({ success: true, data: priceOverride });
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Fiyat ayarlama hatası' });
    }
}

// Override Fiyatlarını Listele
export async function getPriceOverrides(request: FastifyRequest, reply: FastifyReply) {
    try {
        const overrides = await prisma.priceOverride.findMany();
        return reply.send(overrides);
    } catch (error) {
        return reply.status(500).send({ error: 'Liste alınamadı' });
    }
}
