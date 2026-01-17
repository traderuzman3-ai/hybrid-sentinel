// Native fetch used


const API_URL = 'http://localhost:3001';

async function testFlow() {
    console.log('🔄 Test akışı başlıyor...');

    // 1. Login
    console.log('1. Login deneniyor...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'traderuzman3@gmail.com',
            password: '123456' // Eğer şifre buysa
        })
    });

    if (!loginRes.ok) {
        console.error('❌ Login başarısız:', await loginRes.text());
        return;
    }

    const loginData = await loginRes.json();
    console.log('✅ Login başarılı! Token alındı.');
    const token = loginData.token;

    // 2. Profile
    console.log('\n2. Profil çekiliyor...');
    const profileRes = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!profileRes.ok) {
        console.error('❌ Profil başarısız:', await profileRes.text());
    } else {
        const profile = await profileRes.json();
        console.log('✅ Profil:', profile.email, profile.firstName);
    }

    // 3. Balance
    console.log('\n3. Bakiye çekiliyor...');
    const ledgerRes = await fetch(`${API_URL}/ledger/history`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!ledgerRes.ok) {
        console.error('❌ Bakiye başarısız:', await ledgerRes.text());
    } else {
        const ledger = await ledgerRes.json();
        console.log('✅ Bakiye:', ledger.balance);
    }
}

testFlow();
