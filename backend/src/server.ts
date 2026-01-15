import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import { authenticate } from './middleware/auth.middleware';
import authRoutes from './modules/auth/auth.routes';
import adminRoutes from './modules/admin/admin.routes';
import ledgerRoutes from './modules/ledger/ledger.routes';
import marketRoutes from './modules/market/market.routes';
import kycRoutes from './modules/kyc/kyc.routes';
import tradeRoutes from './modules/trade/trade.routes';
import ecosystemRoutes from './modules/admin/ecosystem.routes';
import futureFinanceRoutes from './modules/admin/future.routes';
import globalDominanceRoutes from './modules/admin/global.routes';
import singularityRoutes from './modules/admin/singularity.routes';
import omegaRoutes from './modules/admin/omega.routes';
import absoluteRoutes from './modules/admin/absolute.routes';

async function buildServer() {
    const fastify = Fastify({
        logger: true
    });

    // CORS - Allow all origins to fix "Failed to fetch" on different deployments
    await fastify.register(cors, {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    });

    // Rate Limiting
    await fastify.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute'
    });

    // JWT
    await fastify.register(jwt, {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    });

    // WebSocket
    await fastify.register(websocket);

    // Auth middleware
    fastify.decorate('authenticate', authenticate);

    // Health check
    fastify.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // Register routes
    await fastify.register(authRoutes);
    await fastify.register(adminRoutes);
    await fastify.register(ledgerRoutes);
    await fastify.register(marketRoutes);
    await fastify.register(kycRoutes);
    await fastify.register(tradeRoutes);
    await fastify.register(ecosystemRoutes);
    await fastify.register(futureFinanceRoutes);
    await fastify.register(globalDominanceRoutes);
    await fastify.register(singularityRoutes);
    await fastify.register(omegaRoutes);
    await fastify.register(absoluteRoutes);

    return fastify;
}

const start = async () => {
    try {
        const fastify = await buildServer();
        const port = parseInt(process.env.PORT || '3001');
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 Backend server running on http://localhost:${port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
