const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearUsers() {
    console.log('Kullanicilar temizleniyor...');

    const a = await prisma.auditLog.deleteMany({});
    console.log('Audit logs:', a.count);

    const w = await prisma.wallet.deleteMany({});
    console.log('Wallets:', w.count);

    const u = await prisma.user.deleteMany({});
    console.log('Users:', u.count);

    console.log('TAMAM! Tum kullanicilar silindi.');
    await prisma.$disconnect();
}

clearUsers().catch(e => {
    console.error('Hata:', e);
    prisma.$disconnect();
});
