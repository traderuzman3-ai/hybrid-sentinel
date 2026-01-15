import { FastifyInstance } from 'fastify';
import { placeOrder, getOpenPositions } from './trade.controller';

export default async function tradeRoutes(fastify: FastifyInstance) {
    fastify.post('/trade/order', {
        onRequest: [fastify.authenticate]
    }, placeOrder);

    fastify.get('/trade/positions', {
        onRequest: [fastify.authenticate]
    }, getOpenPositions);
}
