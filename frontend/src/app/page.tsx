import Link from 'next/link';

export default function Home() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '500px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '48px', marginBottom: '16px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Trading Platform
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '18px' }}>
                    BIST, ABD Borsaları ve Kripto için profesyonel alım-satım platformu
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/auth/login">
                        <button className="btn btn-primary">Giriş Yap</button>
                    </Link>
                    <Link href="/auth/register">
                        <button className="btn btn-secondary">Kayıt Ol</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
