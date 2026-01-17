'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export default function LoginPage() {
    const router = useRouter();
    const { refreshUserData } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Use local proxy /api/auth/login to avoid CORS and Env issues
            const loginUrl = '/api/auth/login';
            console.log('Sending login request to:', loginUrl);

            // Timeout ekle (15 saniye - Railway DB yavaş olabilir)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const res = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId); // İşlem başarılı, zamanlayıcıyı iptal et

            const data = await res.json();

            if (!res.ok) {
                // Backend'den gelen "error" alanı kod olabilir (örn: 'KYC_REQUIRED')
                // Bu yüzden mesaj yerine onu fırlatıyoruz ki catch bloğunda yakalayalım
                throw new Error(data.error || 'Giriş başarısız');
            }

            // Token'ları localStorage'a kaydet
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Context'i güncelle (Non-blocking - Beklemeden devam et)
            // Hata: await kullanınca bir şekilde takılıyor, bu yüzden fire-and-forget yapıyoruz
            console.log('Triggering user data refresh (async)...');
            refreshUserData().catch(e => console.error('Async refresh error:', e));

            // Dashboard'a yönlendir
            console.log('Redirecting to dashboard immediately...');
            window.location.href = '/dashboard';
        } catch (err: any) {
            console.error('Login error:', err);

            if (err.name === 'AbortError') {
                setError('Sunucu yanıt vermiyor (Zaman aşımı). Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.');
                return;
            }

            // Backend'den gelen özel hata kodlarını yakala
            if (err.message === 'KYC_REQUIRED') {
                router.push('/kyc/upload'); // Direkt KYC yüklemeye at
                return;
            }
            if (err.message === 'APPROVAL_PENDING') {
                setError('Hesabınız onay sürecindedir. Lütfen mail kutunuzu takip edin.');
                // İstersen burada özel bir "Bekleme Odası" sayfasına da atabilirsin
                return;
            }

            setError(err.message || 'Giriş başarısız oldu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>Giriş Yap</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', textAlign: 'center' }}>
                    Hesabınıza giriş yapın
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--danger)',
                        padding: '12px',
                        borderRadius: 'var(--radius)',
                        marginBottom: '20px',
                        color: 'var(--danger)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ornek@email.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Şifre</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '16px' }}
                        disabled={loading}
                    >
                        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Hesabınız yok mu?{' '}
                        <Link href="/auth/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                            Kayıt Ol
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
