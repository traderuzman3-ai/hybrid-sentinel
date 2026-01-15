
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const email = 'traderuzman3@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
        include: { wallets: true }
    });

    if (user) {
        console.log(`✅ KULLANICI BULUNDU: ${email}`);
        console.log('Hesap Tipi:', user.accountType);
        console.log('Cüzdanlar:', JSON.stringify(user.wallets, null, 2));
    } else {
        console.log(`❌ KULLANICI HENÜZ KAYIT OLMAMIŞ: ${email}`);
    }
    await prisma.$disconnect();
}

check();
