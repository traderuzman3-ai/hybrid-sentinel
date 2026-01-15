
const argon2 = require('argon2');

async function test() {
    try {
        console.log('Testing argon2...');
        const hash = await argon2.hash('password');
        console.log('Hash success:', hash);
        const valid = await argon2.verify(hash, 'password');
        console.log('Verify success:', valid);
    } catch (err) {
        console.error('Argon2 failed:', err);
    }
}

test();
