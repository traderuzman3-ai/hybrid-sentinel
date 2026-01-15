
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

// Env variables are loaded by tsx

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || 'http://localhost:3001';

async function main() {
    console.log('🚀 Doğrulama Başlıyor...');
    console.log('DB URL (Script):', process.env.DATABASE_URL ? 'Defined' : 'Undefined');

    const email = `demo_${Date.now()}@test.com`;
    const password = 'Password123!';

    try {
        // 1. Kayıt Ol (Register)
        console.log(`1. Demo kullanıcı oluşturuluyor: ${email}`);
        let registeredUser;
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                email,
                password,
                firstName: 'Demo',
                lastName: 'User',
                accountType: 'DEMO'
            });
            console.log('✅ Kayıt başarılı. Response:', res.status);
            console.log('User from API:', res.data.user);
            registeredUser = res.data.user;
        } catch (e: any) {
            console.error('Kayıt hatası:', e.response?.data || e.message);
            throw e;
        }

        // 2. Email Doğrulama (DB üzerinden bypass)
        console.log('2. Email veritabanından doğrulanıyor...');
        // Wait a bit just in case of replication lag (unlikely for single DB but good for debugging)
        await new Promise(r => setTimeout(r, 1000));

        const user = await prisma.user.findUnique({ where: { email } });
        console.log('User found in DB:', user);

        if (!user) {
            console.error('CRITICAL: API says user created, but Script cannot see it in DB.');
            console.error('API returned ID:', registeredUser.id);
            throw new Error('Kullanıcı veritabanında bulunamadı');
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { isEmailVerified: true }
        });
        console.log('✅ Email manuel olarak doğrulandı');

        // 3. Giriş Yap (Login)
        console.log('3. Giriş yapılıyor...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        const token = loginRes.data.token;
        console.log('✅ Giriş başarılı');

        // 4. Profil ve Bakiyeleri Kontrol Et
        console.log('4. Profil bakiyeleri kontrol ediliyor...');
        const profileRes = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const wallets = profileRes.data.user.wallets;
        console.log('Kullanıcı Cüzdanları:', JSON.stringify(wallets, null, 2));

        const tryWallet = wallets.find((w: any) => w.currency === 'TRY');
        const usdWallet = wallets.find((w: any) => w.currency === 'USD');

        const tryBalance = Number(tryWallet?.balance || 0);
        const usdBalance = Number(usdWallet?.balance || 0);

        if (tryBalance === 100000 && usdBalance === 10000) {
            console.log('✨ BAŞARILI: Demo bakiyeleri doğru! (100.000 TRY & 10.000 USD)');
        } else {
            console.error(`❌ BAŞARISIZ: Bakiyeler hatalı. Beklenen: 100000 TRY, 10000 USD. Bulunan: ${tryBalance} TRY, ${usdBalance} USD`);
            process.exit(1);
        }

    } catch (error: any) {
        console.error('❌ Hata:', error.response?.data || error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
