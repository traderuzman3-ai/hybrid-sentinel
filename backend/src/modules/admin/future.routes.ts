import { FastifyInstance } from 'fastify';
import { Web3WalletService, AiForecastingService } from './future.finance.service';
import { InstitutionalService } from './institutional.service';
import { QuantumSecurityService } from './quantum.service';

export default async function futureFinanceRoutes(fastify: FastifyInstance) {
    fastify.post('/future/connect-wallet', { onRequest: [fastify.authenticate] }, async (req: any) => {
        const { address, chainId } = req.body;
        return await Web3WalletService.connectWeb3Wallet(req.user.id, address, chainId);
    });

    fastify.get('/future/predict/:symbol', async (req: any) => {
        return await AiForecastingService.predictNextPrice(req.params.symbol);
    });

    fastify.post('/future/dark-pool', { onRequest: [fastify.authenticate] }, async (req: any) => {
        const { symbol, side, qty } = req.body;
        return await InstitutionalService.placeDarkPoolOrder(req.user.id, symbol, side, qty);
    });

    fastify.get('/future/quantum-status', async () => {
        return { securityLevel: 'QUANTUM_RESISTANT_V1', meshStatus: 'ENCRYPTED' };
    });

    fastify.get('/future/metaverse-init', async () => {
        return {
            vibe: 'Cyberpunk',
            terminal3D: 'READY',
            view: 'Immersive Dashboard Concept (Faz 10.9)'
        };
    });
}
