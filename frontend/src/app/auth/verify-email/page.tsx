'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const verify = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await fetch(`${baseUrl}/auth/verify-email?token=${token}`);

                if (res.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (err) {
                setStatus('error');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            {status === 'loading' && (
                <div>
                    <h2 style={{ marginBottom: '16px' }}>Doğrulanıyor...</h2>
                    <div className="loading-spinner"></div>
                </div>
            )}

            {status === 'success' && (
                <div>
                    <div style={{ fontSize: '48px', marginBottom: '20px', color: 'var(--success)' }}>✅</div>
                    <h2 style={{ marginBottom: '16px' }}>Hesap Doğrulandı!</h2>
                    <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
                        E-posta adresiniz başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.
                    </p>
                    <Link href="/auth/login">
                        <button className="btn btn-primary" style={{ width: '100%' }}>Giriş Yap</button>
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div>
                    <div style={{ fontSize: '48px', marginBottom: '20px', color: 'var(--danger)' }}>❌</div>
                    <h2 style={{ marginBottom: '16px' }}>Doğrulama Başarısız</h2>
                    <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
                        Doğrulama linki geçersiz veya süresi dolmuş olabilir.
                    </p>
                    <Link href="/auth/login">
                        <button className="btn btn-secondary" style={{ width: '100%' }}>Giriş Ekranına Dön</button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <Suspense fallback={<div>Yükleniyor...</div>}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
