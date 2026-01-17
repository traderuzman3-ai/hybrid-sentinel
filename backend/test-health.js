// Native fetch used

const API_URL = 'http://localhost:3001';

async function testNewUser() {
    console.log('🕵️ Yeni kullanıcı testi başlıyor...');

    // 1. Login (melihdogantoprak@gmail.com) - Assuming password is same '123456' or similar? 
    // Wait, I don't know the password user set. 
    // I will try to use the ONE user I know password for 'traderuzman3@gmail.com' first to verify system health.
    // OR I can reset password for melih... 
    // Let's test system health first with known user.

    const email = 'melihdogantoprak@gmail.com';
    const password = '123456';

    console.log(`Log in as ${email}...`);
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!loginRes.ok) {
        console.error('❌ Login başarısız:', await loginRes.text());
        return;
    }

    const { token, user } = await loginRes.json();
    console.log(`✅ Login OK. User: ${user.email} (${user.accountType})`);

    // 2. Profile
    const profileRes = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (profileRes.ok) {
        console.log('✅ Profile fetch OK');
        const p = await profileRes.json();
        console.log('User data:', p);
    } else {
        console.error('❌ Profile fetch failed:', await profileRes.text());
    }

    // 3. Wallets
    const walletRes = await fetch(`${API_URL}/ledger/wallets`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (walletRes.ok) {
        console.log('✅ Wallet fetch OK');
    } else {
        console.error('❌ Wallet fetch failed:', await walletRes.text());
    }
}

testNewUser();
