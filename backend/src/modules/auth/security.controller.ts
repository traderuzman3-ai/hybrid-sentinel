import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../lib/prisma';
import { MailService } from './mail.service';
import crypto from 'crypto';

export async function forgotPassword(req: FastifyRequest, reply: FastifyReply) {
    const { email } = req.body as { email: string };
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        await prisma.user.update({
            where: { id: user.id },
            data: { resetPasswordToken: token }
        });
        await MailService.sendResetPasswordEmail(email, token);
    }

    return { message: 'Eğer e-posta kayıtlıysa, şifre sıfırlama linki gönderilmiştir.' };
}

export async function verifyEmail(req: FastifyRequest, reply: FastifyReply) {
    const { token } = req.query as { token: string };
    const user = await prisma.user.findFirst({ where: { emailVerificationToken: token } });

    if (!user) return reply.status(400).send({ error: 'Geçersiz veya süresi dolmuş token.' });

    await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true, emailVerificationToken: null }
    });

    return { success: true, message: 'Hesabınız başarıyla doğrulandı.' };
}

export async function resetPassword(req: FastifyRequest, reply: FastifyReply) {
    const { token, newPassword } = req.body as { token: string; newPassword: string };
    const user = await prisma.user.findFirst({ where: { resetPasswordToken: token } });

    if (!user) return reply.status(400).send({ error: 'Geçersiz veya süresi dolmuş token.' });

    const argon2 = require('argon2');
    const passwordHash = await argon2.hash(newPassword);

    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, resetPasswordToken: null }
    });

    return { success: true, message: 'Şifreniz başarıyla güncellendi.' };
}
