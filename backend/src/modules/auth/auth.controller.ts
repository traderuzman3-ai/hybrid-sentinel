import { FastifyRequest, FastifyReply } from 'fastify';
import argon2 from 'argon2';
import prisma from '../../lib/prisma';

// Kayıt (Register)
export async function register(request: FastifyRequest, reply: FastifyReply) {
    console.log('📥 YENİ KAYIT İSTEĞİ GELDİ:', request.body);
    try {
        const { email, password, firstName, lastName, phone, accountType } = request.body as {
            email: string;
            password: string;
            firstName?: string;
            lastName?: string;
            phone?: string;
            accountType?: 'REAL' | 'DEMO';
        };

        console.log(`- İşleniyor: ${email} (${accountType || 'REAL'})`);

        // Email kontrolü
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return reply.status(400).send({ error: 'Bu email zaten kayıtlı' });
        }

        // Şifre hash'leme
        const passwordHash = await argon2.hash(password);

        // Verification token oluştur
        const crypto = require('crypto');
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        // Kullanıcı oluştur
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                emailVerificationToken,
                accountType: accountType || 'REAL',
                isEmailVerified: accountType === 'DEMO', // Demo hesaplar otomatik onaylı
                // Otomatik cüzdan oluşturma
                wallets: {
                    create: [
                        {
                            currency: 'TRY',
                            balance: accountType === 'DEMO' ? 100000 : 0, // Demo hesaplara 100.000 TL bakiye
                            frozen: 0
                        },
                        {
                            currency: 'USD',
                            balance: accountType === 'DEMO' ? 10000 : 0, // Demo hesaplara 10.000 USD bakiye
                            frozen: 0
                        }
                    ]
                }
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                kycStatus: true,
                accountLevel: true,
                accountType: true,
                createdAt: true
            }
        });

        // Email gönder (Sadece REAL hesaplar için)
        if (user.accountType === 'REAL') {
            const { MailService } = require('./mail.service');
            await MailService.sendVerificationEmail(email, emailVerificationToken);
        }

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'REGISTER',
                details: JSON.stringify({ email }),
                ipAddress: request.ip,
                userAgent: request.headers['user-agent']
            }
        });

        return reply.status(201).send({ user, message: 'Kayıt başarılı. Lütfen e-postanızı doğrulayın.' });
    } catch (error) {
        console.error('REGISTER ERROR:', error);
        request.log.error(error);
        return reply.status(500).send({ error: 'Kayıt sırasında hata oluştu' });
    }
}

// Giriş (Login)
export async function login(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { email, password } = request.body as {
            email: string;
            password: string;
        };

        // Kullanıcı kontrolü
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return reply.status(401).send({ error: 'Email veya şifre hatalı' });
        }

        // Hesap aktif mi? (Email Onayı)
        if (!user.isEmailVerified) {
            return reply.status(403).send({ error: 'Lütfen önce e-posta adresinizi doğrulayın. Spam klasörünü kontrol etmeyi unutmayın.' });
        }

        // KYC ve Hesap Durumu Kontrolleri (Grand Simulation Rules)
        // 1. KYC Yüklenmiş mi?
        if (user.kycStatus === 'NOT_SUBMITTED' && user.accountType === 'REAL') {
            return reply.status(403).send({
                error: 'KYC_REQUIRED', // Frontend bunu yakalayıp KYC sayfasına yönlendirecek
                message: 'İşlem yapabilmek için kimlik doğrulama belgelerinizi yüklemelisiniz.'
            });
        }

        // 2. Admin Onayı Bekliyor mu?
        if (user.kycStatus === 'PENDING' && user.accountType === 'REAL') {
            return reply.status(403).send({
                error: 'APPROVAL_PENDING',
                message: 'Hesabınız yönetici onayı bekliyor. Bu işlem 24 saate kadar sürebilir.'
            });
        }

        // 3. KYC Reddedilmiş mi?
        if (user.kycStatus === 'REJECTED') {
            return reply.status(403).send({
                error: 'ACCOUNT_SUSPENDED',
                message: 'Kimlik doğrulamanız reddedildi. Lütfen destek ekibiyle iletişime geçin.'
            });
        }

        // Şifre kontrolü
        const isValidPassword = await argon2.verify(user.passwordHash, password);
        if (!isValidPassword) {
            return reply.status(401).send({ error: 'Email veya şifre hatalı' });
        }

        // JWT Token oluştur
        const token = reply.server.jwt.sign(
            {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin
            },
            { expiresIn: '1h' }
        );

        // Refresh Token
        const refreshToken = reply.server.jwt.sign(
            { id: user.id },
            {
                // @ts-ignore
                secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
                expiresIn: '7d'
            }
        );

        // Audit log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'LOGIN',
                details: JSON.stringify({ email }),
                ipAddress: request.ip,
                userAgent: request.headers['user-agent']
            }
        });

        return reply.send({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                kycStatus: user.kycStatus,
                accountLevel: user.accountLevel,
                isAdmin: user.isAdmin
            },
            token,
            refreshToken
        });
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Giriş sırasında hata oluştu' });
    }
}

// Token Yenileme
export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { refreshToken } = request.body as { refreshToken: string };

        // Refresh token doğrula
        const decoded = reply.server.jwt.verify(refreshToken, {
            // @ts-ignore
            secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret'
        }) as { id: string };

        // Kullanıcı kontrolü
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return reply.status(401).send({ error: 'Geçersiz token' });
        }

        // Yeni access token
        const newToken = reply.server.jwt.sign(
            {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin
            },
            { expiresIn: '1h' }
        );

        return reply.send({ token: newToken });
    } catch (error) {
        request.log.error(error);
        return reply.status(401).send({ error: 'Token yenileme başarısız' });
    }
}


// Profil Bilgisi
export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = (request.user as any);
        console.log('getProfile request for user:', user);

        const profile = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                kycStatus: true,
                accountLevel: true,
                isAdmin: true,
                createdAt: true,
                wallets: true
            }
        });

        if (!profile) {
            console.error('Profile not found for id:', user.id);
            return reply.status(404).send({ error: 'Kullanıcı bulunamadı' });
        }

        return reply.send({ user: profile });
    } catch (error) {
        console.error('GET PROFILE ERROR:', error);
        request.log.error(error);
        return reply.status(500).send({ error: 'Profil bilgisi alınamadı' });
    }
}
