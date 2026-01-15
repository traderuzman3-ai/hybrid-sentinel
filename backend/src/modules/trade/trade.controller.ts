import { FastifyRequest, FastifyReply } from 'fastify';
import { MatchingEngine } from './matching.engine';

export async function placeOrder(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;
    const orderData = { ...req.body as any, userId };

    try {
        const order = await MatchingEngine.getInstance().placeOrder(orderData);
        return { success: true, order };
    } catch (error: any) {
        return reply.status(400).send({ error: error.message });
    }
}

export async function getOpenPositions(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.user as any).id;
    // Prisma üzerinden açık pozisyonları çek
    return { positions: [] };
}
