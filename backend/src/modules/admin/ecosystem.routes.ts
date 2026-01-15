import { FastifyInstance } from 'fastify';
import { SocialTradingService } from '../trade/social.service';
import { SentinelAiService } from '../market/ai.service';
import { EcosystemProductService } from '../ledger/ecosystem.service';

export default async function ecosystemRoutes(fastify: FastifyInstance) {
    fastify.post('/ecosystem/copy-trade', { onRequest: [fastify.authenticate] }, async (req: any) => {
        const { leaderId, allocation } = req.body;
        return await SocialTradingService.followTrader(req.user.id, leaderId, allocation);
    });

    fastify.post('/ecosystem/ai-chat', async (req: any) => {
        const { query } = req.body;
        return { reply: await SentinelAiService.chat(query) };
    });

    fastify.get('/ecosystem/launchpads', async () => {
        return await EcosystemProductService.getActiveLaunchpads();
    });

    fastify.get('/ecosystem/arbitrage', async () => {
        return EcosystemProductService.getArbitrageOpportunities();
    });

    fastify.post('/ecosystem/stake', { onRequest: [fastify.authenticate] }, async (req: any) => {
        const { amount, duration } = req.body;
        return await EcosystemProductService.stake(req.user.id, amount, duration);
    });
}
