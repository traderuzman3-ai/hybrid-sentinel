
import axios from 'axios';

async function test() {
    try {
        console.log('Sending registration request...');
        const res = await axios.post('http://localhost:3001/auth/register', {
            email: `manual_test_${Date.now()}@test.com`,
            password: 'Password123!',
            firstName: 'Manual',
            lastName: 'Test',
            accountType: 'DEMO'
        });
        console.log('Status:', res.status);
        console.log('Data:', res.data);
    } catch (e: any) {
        console.error('Error:', e.response?.data || e.message);
    }
}

test();
