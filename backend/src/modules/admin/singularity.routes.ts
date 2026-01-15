import { FastifyInstance } from 'fastify';
import { SingularityService } from './singularity.service';
import { NeuralAndGreenService } from './neural.service';

export default async function singularityRoutes(fastify: FastifyInstance) {
    fastify.get('/singularity/god-mode', async () => {
        const macro = await SingularityService.getMacroForecast();
        const evolution = await SingularityService.evolveCore();
        const carbon = NeuralAndGreenService.calculateCarbonOffset(1000000000);

        return {
            systemControl: 'FULL_SOVEREIGNTY',
            evolution,
            macroForecast: macro,
            planetaryImpact: carbon,
            activeCBDCs: ['TR-CBDC', 'E-CNY', 'D-EURO'],
            status: 'SINGULARITY_REACHED'
        };
    });

    fastify.post('/singularity/ghost-mode', { onRequest: [fastify.authenticate] }, async (req: any) => {
        return await SingularityService.createGhostWallet(req.user.id);
    });

    fastify.get('/singularity/neural-init', async () => {
        return NeuralAndGreenService.getNeuralStream();
    });
}
