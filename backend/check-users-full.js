const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    console.log('🔍 Kullanıcı aranıyor...');

    // Tüm kullanıcıları listele (zaten az var)
    const users = await prisma.user.findMany();

    console.log('📋 Kayıtlı Kullanıcılar:');
    users.forEach(u => {
        console.log(`- Email: "${u.email}"`);
        console.log(`  ID: ${u.id}`);
        console.log(`  Doğrulanmış: ${u.isEmailVerified}`);
        console.log(`  Hesap Tipi: ${u.accountType}`);
        console.log('-------------------');
    });

    await prisma.$disconnect();
}

checkUser().catch(e => {
    console.error(e);
    prisma.$disconnect();
});
