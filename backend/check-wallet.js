const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkWallets() {
    console.log('💰 Cüzdanlar kontrol ediliyor...');

    const user = await prisma.user.findFirst({
        where: { email: 'traderuzman3@gmail.com' },
        include: { wallets: true }
    });

    if (user) {
        console.log(`Kullanıcı: ${user.email} (${user.accountType})`);
        console.log('Cüzdanlar:');
        user.wallets.forEach(w => {
            console.log(`- ${w.currency}: ${w.balance}`);
        });
    } else {
        console.log('Kullanıcı bulunamadı!');
    }

    await prisma.$disconnect();
}

checkWallets().catch(e => {
    console.error(e);
    prisma.$disconnect();
});
