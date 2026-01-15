import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
    try {
        const user = await prisma.user.update({
            where: { email },
            data: {
                isAdmin: true,
                accountLevel: 'WITHDRAWAL_ENABLED',
                kycStatus: 'APPROVED'
            }
        });
        console.log(`✅ SUCCESS: User ${email} is now an ADMIN.`);
        console.log(user);
    } catch (error) {
        console.error(`❌ ERROR: Could not find user with email ${email}`);
    } finally {
        await prisma.$disconnect();
    }
}

const email = process.argv[2];
if (!email) {
    console.log('Usage: npx tsx scripts/make-admin.ts <email>');
    process.exit(1);
}

makeAdmin(email);
