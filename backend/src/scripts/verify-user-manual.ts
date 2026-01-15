
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verify() {
    const email = 'traderuzman3@gmail.com';
    await prisma.user.update({
        where: { email },
        data: { isEmailVerified: true }
    });
    console.log(`✅ ${email} adresi başarıyla manuel olarak doğrulandı.`);
    await prisma.$disconnect();
}

verify();
