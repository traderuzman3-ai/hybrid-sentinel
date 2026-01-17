const axios = require('axios');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

const API_URL = 'http://localhost:3000';

// Helper to create multipart body manually
function createMultipartBody(fields, files, boundary) {
    const CRLF = '\r\n';
    const lines = [];

    // Fields
    for (const [key, value] of Object.entries(fields)) {
        lines.push(`--${boundary}`);
        lines.push(`Content-Disposition: form-data; name="${key}"`);
        lines.push('');
        lines.push(value);
    }

    // Files
    for (const [key, filePath] of Object.entries(files)) {
        const filename = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath);

        lines.push(`--${boundary}`);
        lines.push(`Content-Disposition: form-data; name="${key}"; filename="${filename}"`);
        lines.push('Content-Type: application/octet-stream'); // Simplified
        lines.push('');
        lines.push(fileContent); // Note: mixing string and buffer in specific ways might be tricky in simple array join, better to use Buffer.concat
    }

    lines.push(`--${boundary}--`);
    lines.push('');

    // Return as Buffer
    // We need to construct the buffer carefully
    const parts = [];
    for (const [key, value] of Object.entries(fields)) {
        parts.push(Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="${key}"${CRLF}${CRLF}${value}${CRLF}`));
    }
    for (const [key, filePath] of Object.entries(files)) {
        const filename = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath);
        parts.push(Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="${key}"; filename="${filename}"${CRLF}Content-Type: application/octet-stream${CRLF}${CRLF}`));
        parts.push(fileContent);
        parts.push(Buffer.from(CRLF));
    }
    parts.push(Buffer.from(`--${boundary}--${CRLF}`));

    return Buffer.concat(parts);
}

async function runTest() {
    console.log('🚀 Starting End-to-End KYC Verification (No-Deps Mode)...');

    // 1. Create a User
    const email = `test_kyc_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`\n1. Registering user: ${email}`);
    let userToken;
    let userId;

    try {
        await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            firstName: 'Test',
            lastName: 'User',
            accountType: 'REAL'
        });

        console.log('   User registered. Manually verifying email in DB...');
        const user = await prisma.user.update({
            where: { email },
            data: { isEmailVerified: true }
        });
        userId = user.id;

        // Login
        const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
        userToken = loginRes.data.token;
        console.log('   Login successful. Token acquired.');

    } catch (e) {
        console.error('Registration/Login failed:', e.response?.data || e.message);
        return;
    }

    // 2. Upload Document
    console.log('\n2. Uploading KYC Document...');
    try {
        const boundary = '--------------------------' + Date.now().toString(16);
        fs.writeFileSync('dummy_id.jpg', 'fake image content');

        const bodyBuffer = createMultipartBody(
            { documentType: 'ID_FRONT' },
            { file: 'dummy_id.jpg' },
            boundary
        );

        const uploadRes = await axios.post(`${API_URL}/kyc/upload`, bodyBuffer, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            }
        });

        console.log('   Upload successful.');
        console.log('   Response:', uploadRes.data);

        // Verify OCR Data in DB
        const doc = await prisma.kycDocument.findFirst({
            where: { userId },
            orderBy: { uploadedAt: 'desc' }
        });

        if (doc.ocrData) {
            console.log('   ✅ OCR Data found in DB:', doc.ocrData);
        } else {
            console.error('   ❌ OCR Data MISSING in DB!');
        }

        const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
        console.log(`   User Risk Score: ${updatedUser.riskScore} (Expected > 0)`);

    } catch (e) {
        console.error('Upload failed:', e.response?.data || e.message);
        if (e.response?.data) console.log(JSON.stringify(e.response.data));
    }

    console.log('\n✅ Test Complete.');
    if (fs.existsSync('dummy_id.jpg')) fs.unlinkSync('dummy_id.jpg');
}

runTest()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
