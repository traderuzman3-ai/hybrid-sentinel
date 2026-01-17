import { FastifyInstance } from 'fastify';
import * as watchlistController from './watchlist.controller';

export async function watchlistRoutes(fastify: FastifyInstance) {
    // Tüm rotalar JWT korumalıdır
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/', watchlistController.getWatchlist);
    fastify.post('/', watchlistController.addToWatchlist);
    fastify.post('/remove', watchlistController.removeFromWatchlist);
}
