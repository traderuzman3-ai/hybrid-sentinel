
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3001';

async function verifyAuthFlow() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'Password123!';
    const newPassword = 'NewPassword123!';

    console.log(`🚀 Starting Auth Flow Verification for ${email}...`);

    try {
        // 1. Register
        console.log('\nInput: Registering user...');
        await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            firstName: 'Test',
            lastName: 'User'
        });
        console.log('✅ Register successful');

        // 2. Get Verification Token from DB
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.emailVerificationToken) throw new Error('User or token not found');
        console.log(`ℹ️ Verification Token: ${user.emailVerificationToken}`);

        // 3. Verify Email
        console.log('\nInput: Verifying email...');
        const verifyRes = await axios.get(`${API_URL}/auth/verify-email?token=${user.emailVerificationToken}`);
        if (verifyRes.data.success) console.log('✅ Email verification successful');
        else throw new Error('Verification failed');

        // 4. Login
        console.log('\nInput: Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
        if (loginRes.data.token) console.log('✅ Login successful');
        else throw new Error('Login failed');

        // 5. Forgot Password
        console.log('\nInput: Requesting password reset...');
        await axios.post(`${API_URL}/auth/forgot-password`, { email });
        console.log('✅ Forgot password request successful');

        // 6. Get Reset Token
        const userAfterReset = await prisma.user.findUnique({ where: { email } });
        if (!userAfterReset?.resetPasswordToken) throw new Error('Reset token not found');
        console.log(`ℹ️ Reset Token: ${userAfterReset.resetPasswordToken}`);

        // 7. Reset Password
        console.log('\nInput: Resetting password...');
        const resetRes = await axios.post(`${API_URL}/auth/reset-password`, {
            token: userAfterReset.resetPasswordToken,
            newPassword
        });
        if (resetRes.data.success) console.log('✅ Password reset successful');
        else throw new Error('Password reset failed');

        // 8. Login with New Password
        console.log('\nInput: Logging in with new password...');
        const newLoginRes = await axios.post(`${API_URL}/auth/login`, { email, password: newPassword });
        if (newLoginRes.data.token) console.log('✅ Login with new password successful');
        else throw new Error('Login with new password failed');

        console.log('\n🎉 ALL AUTH TESTS PASSED!');

    } catch (error: any) {
        console.error('❌ Test Failed:', error.response?.data || error.message);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAuthFlow();
