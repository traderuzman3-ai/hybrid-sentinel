import { FastifyInstance } from 'fastify';
import { submitAdvancedKyc, getUserKycStatus, verifyAddress } from './kyc.controller';
import { upgradeKycTier } from './kyc.tier.service';

export default async function kycRoutes(fastify: FastifyInstance) {
  fastify.post('/kyc/submit', {
    onRequest: [fastify.authenticate]
  }, submitAdvancedKyc);

  fastify.get('/kyc/status', {
    onRequest: [fastify.authenticate]
  }, getUserKycStatus);

  fastify.post('/kyc/upgrade-tier', {
    onRequest: [fastify.authenticate]
  }, upgradeKycTier);

  fastify.post('/kyc/verify-address', {
    onRequest: [fastify.authenticate]
  }, verifyAddress);
}
