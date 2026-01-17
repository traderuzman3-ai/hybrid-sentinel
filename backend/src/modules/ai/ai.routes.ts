import { FastifyInstance } from 'fastify';
import { AIEngine } from './ai.engine';

export default async function aiRoutes(fastify: FastifyInstance) {
    const engine = AIEngine.getInstance();

    fastify.post('/chat', async (request, reply) => {
        try {
            const { message, userId } = request.body as any;

            if (!message) {
                return reply.code(400).send({ error: 'Mesaj boş olamaz.' });
            }

            // Simulate "Thinking" delay for realism
            await new Promise(resolve => setTimeout(resolve, 800));

            const response = await engine.processQuery(userId || 'guest', message);
            return response;

        } catch (error) {
            console.error('AI Error:', error);
            return reply.code(500).send({ error: 'Jarvis şu an meşgul.' });
        }
    });
}
