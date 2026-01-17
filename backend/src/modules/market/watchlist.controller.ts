import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../lib/prisma';

// Takip Listesini Getir
export async function getWatchlist(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = (request.user as any);
        const watchlist = await prisma.watchlist.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });
        return reply.send(watchlist);
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Liste alınamadı' });
    }
}

// Listeye Ekle
export async function addToWatchlist(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = (request.user as any);
        const { symbol } = request.body as { symbol: string };

        if (!symbol) return reply.status(400).send({ error: 'Sembol gerekli' });

        const item = await prisma.watchlist.create({
            data: {
                userId: user.id,
                symbol
            }
        });
        return reply.send(item);
    } catch (error: any) {
        // P2002: Unique constraint violation (Zaten ekli)
        if (error.code === 'P2002') {
            return reply.status(400).send({ error: 'Bu sembol zaten listenizde' });
        }
        return reply.status(500).send({ error: 'Ekleme başarısız' });
    }
}

// Listeden Çıkar
export async function removeFromWatchlist(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = (request.user as any);
        const { symbol } = request.body as { symbol: string };

        await prisma.watchlist.deleteMany({
            where: {
                userId: user.id,
                symbol: symbol
            }
        });

        return reply.send({ success: true });
    } catch (error) {
        return reply.status(500).send({ error: 'Silme başarısız' });
    }
}
