
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
            id: true,
            email: true,
            accountType: true,
            createdAt: true,
            wallets: {
                select: {
                    currency: true,
                    balance: true
                }
            }
        }
    });
    console.log(JSON.stringify(users, null, 2));
    await prisma.$disconnect();
}

check();
