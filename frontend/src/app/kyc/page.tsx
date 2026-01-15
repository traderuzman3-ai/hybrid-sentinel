'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KycPage() {
    const router = useRouter();
    const [documentType, setDocumentType] = useState('ID_CARD');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    documentType,
                    fileContent: "base64_simulated_content"
                })
            });

            if (!res.ok) throw new Error('Yükleme başarısız');

            setSuccess(true);
            setTimeout(() => router.push('/dashboard'), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '60px' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '16px' }}>Kimlik Doğrulaması (KYC)</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    İşlem yapmaya başlamak için kimlik belgenizi yüklemeniz gerekmektedir.
                </p>

                {success ? (
                    <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius)', textAlign: 'center', border: '1px solid var(--success)' }}>
                        <h2 style={{ color: 'var(--success)', marginBottom: '12px' }}>Tebrikler! ✅</h2>
                        <p>Belgeleriniz incelemeye alındı. 3 saniye içinde yönlendirileceksiniz.</p>
                    </div>
                ) : (
                    <form onSubmit={handleUpload}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Belge Türü</label>
                            <select
                                className="input"
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                style={{ appearance: 'none' }}
                            >
                                <option value="ID_CARD">Kimlik Kartı / Pasaport</option>
                                <option value="SELFIE">Selfie Doğrulaması</option>
                                <option value="ADDRESS_PROOF">İkametgah Belgesi</option>
                            </select>
                        </div>

                        <div style={{
                            border: '2px dashed var(--border)',
                            borderRadius: 'var(--radius)',
                            padding: '40px',
                            textAlign: 'center',
                            marginBottom: '32px',
                            cursor: 'pointer'
                        }}>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Dosyayı buraya sürükleyin veya <span style={{ color: 'var(--primary)' }}>seçin</span>
                            </p>
                            <input type="file" style={{ display: 'none' }} />
                        </div>

                        {error && <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Yükleniyor...' : 'Belgeyi Gönder'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
