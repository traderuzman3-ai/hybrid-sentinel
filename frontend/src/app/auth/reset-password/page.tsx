'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Şifreler eşleşmiyor.');
            setStatus('error');
            return;
        }

        if (!token) {
            setMessage('Geçersiz token.');
            setStatus('error');
            return;
        }

        setStatus('loading');

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${baseUrl}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data.error || 'Bir hata oluştu.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Bir hata oluştu.');
        }
    };

    if (status === 'success') {
        return (
            <div className="card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', color: 'var(--success)' }}>✅</div>
                <h2 style={{ marginBottom: '16px' }}>Şifre Güncellendi!</h2>
                <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
                    Yeni şifrenizle giriş yapabilirsiniz.
                </p>
                <button className="btn btn-primary" onClick={() => window.location.href = '/auth/login'} style={{ width: '100%' }}>Giriş Yap</button>
            </div>
        );
    }

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>🔒 Yeni Şifre Belirle</h2>

            <form onSubmit={handleSubmit}>
                {status === 'error' && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255, 71, 87, 0.1)',
                        color: 'var(--danger)',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '13px'
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>Yeni Şifre</label>
                    <input
                        type="password"
                        className="input"
                        required
                        minLength={6}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="********"
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>Yeni Şifre (Tekrar)</label>
                    <input
                        type="password"
                        className="input"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="********"
                    />
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <Suspense fallback={<div>Yükleniyor...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </div>
    );
}
