import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clearUsers() {
    console.log('🗑️ Kullanıcılar temizleniyor...');

    // Önce ilişkili kayıtları sil
    const auditDeleted = await prisma.auditLog.deleteMany({});
    console.log(`  - ${auditDeleted.count} audit log silindi`);

    const walletsDeleted = await prisma.wallet.deleteMany({});
    console.log(`  - ${walletsDeleted.count} cüzdan silindi`);

    const usersDeleted = await prisma.user.deleteMany({});
    console.log(`  - ${usersDeleted.count} kullanıcı silindi`);

    console.log('✅ Tüm kullanıcılar temizlendi!');
    await prisma.$disconnect();
}

clearUsers().catch(e => {
    console.error('Hata:', e);
    prisma.$disconnect();
});
