import { FastifyRequest, FastifyReply } from 'fastify';
import { TwoFAService } from './twofa.service';

export async function setupTwoFA(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req.user as any).id;
  const userEmail = (req.user as any).email;
  const { secret, qrCodeUrl } = await TwoFAService.generateSecret(userId, userEmail);
  return { secret, qrCodeUrl };
}

export async function enableTwoFA(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req.user as any).id;
  const { token, secret } = req.body as { token: string; secret: string };

  try {
    await TwoFAService.enableTwoFA(userId, token, secret);
    return { success: true, message: '2FA başarıyla aktif edildi.' };
  } catch (error: any) {
    return reply.status(400).send({ error: error.message });
  }
}
