import { FastifyInstance } from 'fastify';
import { uploadKycDocument, getKycList, updateKycStatus } from './kyc.controller';
import { setPriceOverride, getPriceOverrides } from './price.controller';

import { PerformanceService } from './performance.service';
import { RiskManagementController } from '../trade/risk.controller';
import { GlobalTestingSuite } from './testing.service';
import { DocumentationService } from './docs.service';
import { MonitoringService } from './monitoring.service';

export default async function adminRoutes(fastify: FastifyInstance) {
    // KYC Routes
    fastify.post('/kyc/upload', { onRequest: [fastify.authenticate] }, uploadKycDocument);

    // Admin only routes
    fastify.get('/admin/kyc/list', { onRequest: [fastify.authenticate] }, getKycList);
    fastify.post('/admin/kyc/status', { onRequest: [fastify.authenticate] }, updateKycStatus);

    fastify.get('/admin/metrics', { onRequest: [fastify.authenticate] }, async () => {
        return await PerformanceService.getSystemMetrics();
    });

    fastify.post('/admin/archive', { onRequest: [fastify.authenticate] }, async () => {
        return await PerformanceService.archiveOldTrades();
    });

    // Price Override Routes
    fastify.get('/admin/prices', { onRequest: [fastify.authenticate] }, getPriceOverrides);
    fastify.post('/admin/prices/override', { onRequest: [fastify.authenticate] }, setPriceOverride);
}
