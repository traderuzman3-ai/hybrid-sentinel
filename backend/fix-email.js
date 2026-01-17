const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixEmail() {
    console.log('🛠️ Email düzeltiliyor...');

    try {
        const user = await prisma.user.update({
            where: { email: 'traderuzman3@gmail.co' },
            data: { email: 'traderuzman3@gmail.com' }
        });

        console.log('✅ Email başarıyla düzeltildi!');
        console.log(`Yeni Email: ${user.email}`);
    } catch (error) {
        console.error('Hata:', error);
    }

    await prisma.$disconnect();
}

fixEmail();
