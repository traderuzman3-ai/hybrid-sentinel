'use client';

import { useState, useEffect } from 'react';
import AdminGuard from '@/components/AdminGuard';

export default function AdminKycPage() {
    const [kycList, setKycList] = useState<any[]>([]);

    useEffect(() => { fetchKyc(); }, []);

    const fetchKyc = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/kyc/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setKycList(data);
        } catch (err) { }
    };

    const handleStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/kyc/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, status })
            });
            fetchKyc();
        } catch (err) { }
    };

    return (
        <AdminGuard>
            <div className="container" style={{ paddingTop: '40px' }}>
                <h1 style={{ marginBottom: '24px' }}>Admin - KYC Onay Paneli</h1>
                <div className="card">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '12px' }}>Kullanıcı</th>
                                <th style={{ padding: '12px' }}>Belge Türü</th>
                                <th style={{ padding: '12px' }}>Tarih</th>
                                <th style={{ padding: '12px' }}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kycList.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '12px' }}>
                                        {item.user.firstName} {item.user.lastName}<br />
                                        <small style={{ color: 'var(--text-secondary)' }}>{item.user.email}</small>
                                    </td>
                                    <td style={{ padding: '12px' }}>{item.documentType}</td>
                                    <td style={{ padding: '12px' }}>{new Date(item.uploadedAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px' }}>
                                        {item.status === 'PENDING' ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleStatus(item.id, 'APPROVED')}>Onayla</button>
                                                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={() => handleStatus(item.id, 'REJECTED')}>Reddet</button>
                                            </div>
                                        ) : (
                                            <span style={{ color: item.status === 'APPROVED' ? 'var(--success)' : 'var(--danger)' }}>{item.status}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminGuard>
    );
}
