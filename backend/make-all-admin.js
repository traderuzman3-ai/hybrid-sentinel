// Tüm kullanıcıları admin yap
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAllAdmin() {
    const result = await prisma.user.updateMany({
        data: { isAdmin: true }
    });

    console.log(`\n✅ ${result.count} kullanıcı ADMIN yapıldı!`);
    console.log('   Artık herkes admin paneline erişebilir.\n');

    await prisma.$disconnect();
}

makeAllAdmin().catch(console.error);
