const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetUser() {
    console.log('🔄 Resetting Melih status...');

    // Delete existing documents first
    const user = await prisma.user.findFirst({ where: { email: 'melihdogantoprak@gmail.com' } });
    if (user) {
        await prisma.kycDocument.deleteMany({ where: { userId: user.id } });

        // Reset status
        await prisma.user.update({
            where: { id: user.id },
            data: { kycStatus: 'NOT_SUBMITTED', accountLevel: 'STARTER' }
        });
        console.log('✅ User reset to NOT_SUBMITTED');
    } else {
        console.log('User not found');
    }
}

resetUser().catch(console.error).finally(() => prisma.$disconnect());
