import { FastifyInstance } from 'fastify';
import { register, login, refreshToken, getProfile } from './auth.controller';
import { setupTwoFA, enableTwoFA } from './twofa.controller';
import { forgotPassword, verifyEmail } from './security.controller';

export default async function authRoutes(fastify: FastifyInstance) {
    // Public routes
    fastify.post('/auth/register', register);
    fastify.post('/auth/login', login);
    fastify.post('/auth/refresh', refreshToken);

    // Protected routes
    fastify.get('/auth/profile', {
        onRequest: [fastify.authenticate]
    }, getProfile);

    // 2FA Routes
    fastify.get('/auth/2fa/setup', {
        onRequest: [fastify.authenticate]
    }, setupTwoFA);

    fastify.post('/auth/2fa/enable', {
        onRequest: [fastify.authenticate]
    }, enableTwoFA);

    // Security Routes
    fastify.post('/auth/forgot-password', forgotPassword);
    fastify.get('/auth/verify-email', verifyEmail);
}
