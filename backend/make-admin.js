// Admin Yetkilendirme Scripti
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
    // En son oluşturulan kullanıcıyı admin yap (ya da belirli bir email)
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log('\n📋 SON 5 KULLANICI:');
    users.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.email} (${u.role}) - ${u.firstName} ${u.lastName}`);
    });

    // İlk kullanıcıyı admin yap
    if (users.length > 0) {
        const targetUser = users[0];
        await prisma.user.update({
            where: { id: targetUser.id },
            data: { isAdmin: true }
        });
        console.log(`\n✅ ${targetUser.email} ADMIN yapıldı!`);
        console.log(`   Şimdi bu hesapla giriş yapıp sol menüden "Kontrol Paneli"ni görebilirsiniz.`);
    }

    await prisma.$disconnect();
}

makeAdmin().catch(console.error);
