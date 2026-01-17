import { FastifyInstance } from 'fastify';
import { uploadKycDocument, getKycList, updateKycStatus } from './kyc.controller';
import { setPriceOverride, getPriceOverrides } from './price.controller';
import { getAllUsers, updateUserBalance, forceApproveKYC } from './user.controller';

import { PerformanceService } from './performance.service';
// ... other imports

export default async function adminRoutes(fastify: FastifyInstance) {
    // KYC Routes
    fastify.post('/kyc/upload', { onRequest: [fastify.authenticate] }, uploadKycDocument);

    // Admin only routes
    fastify.get('/admin/kyc/list', { onRequest: [fastify.authenticate] }, getKycList);
    fastify.post('/admin/kyc/status', { onRequest: [fastify.authenticate] }, updateKycStatus);

    // User Management (God Mode)
    fastify.get('/admin/users', { onRequest: [fastify.authenticate] }, getAllUsers);
    fastify.post('/admin/balance/update', { onRequest: [fastify.authenticate] }, updateUserBalance);
    fastify.post('/admin/kyc/force-approve', { onRequest: [fastify.authenticate] }, forceApproveKYC);

    fastify.get('/admin/metrics', { onRequest: [fastify.authenticate] }, async () => {
        return await PerformanceService.getSystemMetrics();
    });

    // ...
    // Price Override Routes
    fastify.get('/admin/prices', { onRequest: [fastify.authenticate] }, getPriceOverrides);
    fastify.post('/admin/prices/override', { onRequest: [fastify.authenticate] }, setPriceOverride);
}
