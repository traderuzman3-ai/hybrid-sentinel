const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3001';

async function runTest() {
    console.log('🚀 KYC Verification Test Begins...');

    // ---------------------------------------------------------
    // 1. LOGIN as User (melihdogantoprak@gmail.com)
    // ---------------------------------------------------------
    console.log('\n👤 1. Logging in as USER...');
    const userRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'melihdogantoprak@gmail.com', password: '123456' })
    });

    if (!userRes.ok) throw new Error(`User login failed: ${await userRes.text()}`);
    const userData = await userRes.json();
    console.log(`✅ User Logged In: ${userData.user.email}`);
    const userToken = userData.token;

    // ---------------------------------------------------------
    // 2. UPLOAD Document
    // ---------------------------------------------------------
    console.log('\n📤 2. Uploading ID Document...');

    // Convert string to Blob/File for upload
    const fileContent = "Simulated ID Card Content";
    const blob = new Blob([fileContent], { type: 'text/plain' });

    const formData = new FormData();
    formData.append('documentType', 'ID_FRONT');
    formData.append('file', blob, 'kimlik_on.txt');

    const uploadRes = await fetch(`${API_URL}/kyc/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userToken}` },
        body: formData
    });

    if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
    const uploadData = await uploadRes.json();
    console.log(`✅ Upload Success! Doc ID: ${uploadData.document.id}`);
    const docId = uploadData.document.id;

    // ---------------------------------------------------------
    // 3. LOGIN as ADMIN (traderuzman3@gmail.com)
    // ---------------------------------------------------------
    console.log('\n👑 3. Logging in as ADMIN...');
    const adminRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'traderuzman3@gmail.com', password: '123456' })
    });

    if (!adminRes.ok) throw new Error(`Admin login failed: ${await adminRes.text()}`);
    const adminData = await adminRes.json();
    console.log(`✅ Admin Logged In: ${adminData.user.email} (Admin: ${adminData.user.isAdmin})`);
    const adminToken = adminData.token;

    // ---------------------------------------------------------
    // 4. LIST & APPROVE Document
    // ---------------------------------------------------------
    console.log('\n📝 4. Admin Reviewing Document...');

    const approveRes = await fetch(`${API_URL}/admin/kyc/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id: docId, status: 'APPROVED' })
    });

    if (!approveRes.ok) throw new Error(`Approval failed: ${await approveRes.text()}`);
    console.log('✅ Document APPROVED by Admin');

    // ---------------------------------------------------------
    // 5. CHECK User Status
    // ---------------------------------------------------------
    console.log('\n🔍 5. Verifying User Final Status...');

    // Refresh user profile
    const profileRes = await fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const profile = await profileRes.json();

    // Also check DB directly via list script strictly speaking if needed, 
    // but profile endpoint is the source of truth for frontend
    console.log(`Final KYC Status: ${profile.user.kycStatus}`);

    // Note: Our logic requires specific number of approved docs to flip user status to APPROVED.
    // The code said: if (otherDocs.length >= 1) ... we just uploaded 1.
    // Let's see if it flipped.
    if (profile.user.kycStatus === 'APPROVED') {
        console.log('🎉 SUCCESS: User is fully verified!');
    } else {
        console.log('⚠️ User has one approved doc, status might still be pending additional docs (ID Back/Address).');
        console.log('Uploading one more doc to trigger full approval...');

        // Upload 2nd doc
        const formData2 = new FormData();
        formData2.append('documentType', 'ADDRESS');
        formData2.append('file', blob, 'ikametgah.txt');

        const up2 = await fetch(`${API_URL}/kyc/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${userToken}` },
            body: formData2
        });
        const up2Data = await up2.json();

        // Approve 2nd doc
        await fetch(`${API_URL}/admin/kyc/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ id: up2Data.document.id, status: 'APPROVED' })
        });

        // Check again
        const res3 = await fetch(`${API_URL}/auth/profile`, { headers: { 'Authorization': `Bearer ${userToken}` } });
        const p3 = await res3.json();
        console.log(`Corrected KYC Status: ${p3.user.kycStatus}`);
    }
}

runTest().catch(console.error);
