'use client';

import { useState } from 'react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await fetch('http://localhost:3001/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>🔑 Şifremi Unuttum</h2>

                {!submitted ? (
                    <form onSubmit={handleSubmit}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                            E-posta adresinizi girin, şifre sıfırlama talimatlarını gönderelim.
                        </p>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>E-Posta</label>
                            <input
                                type="email"
                                className="input"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="ornek@mail.com"
                            />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📧</div>
                        <p style={{ marginBottom: '24px' }}>Talimatlar e-posta adresinize gönderildi. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.</p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/auth/login'}>Giriş Ekranına Dön</button>
                    </div>
                )}
            </div>
        </div>
    );
}
