import { FastifyInstance } from 'fastify';
import { depositFunds, getWallets, exportStatement } from './ledger.controller';

export default async function ledgerRoutes(fastify: FastifyInstance) {
    // User Routes
    fastify.post('/ledger/deposit', {
        onRequest: [fastify.authenticate]
    }, depositFunds);

    fastify.get('/ledger/wallets', {
        onRequest: [fastify.authenticate]
    }, getWallets);

    fastify.get('/ledger/export', {
        onRequest: [fastify.authenticate]
    }, exportStatement);
}
