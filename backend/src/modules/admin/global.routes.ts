import { FastifyInstance } from 'fastify';
import { GlobalSaasService } from './global.saas.service';
import { AutonomousEcosystemService } from './autonomous.service';
import { AdvancedTrustService } from './trust.service';

export default async function globalDominanceRoutes(fastify: FastifyInstance) {
    fastify.post('/global/create-tenant', async (req: any) => {
        const { name, domain } = req.body;
        return await GlobalSaasService.createTenant(name, domain, {});
    });

    fastify.get('/global/sentiment/:symbol', async (req: any) => {
        return await AutonomousEcosystemService.getMarketSentiment(req.params.symbol);
    });

    fastify.get('/global/solvency-proof', async () => {
        return await AdvancedTrustService.generateSolvencyProof();
    });

    fastify.get('/global/aggregated-liquidity/:symbol', async (req: any) => {
        return await AutonomousEcosystemService.getAggregatedLiquidity(req.params.symbol);
    });

    fastify.post('/global/verify-bio', { onRequest: [fastify.authenticate] }, async (req: any) => {
        return await AutonomousEcosystemService.verifyBehavior(req.user.id, req.body.patterns);
    });
}
