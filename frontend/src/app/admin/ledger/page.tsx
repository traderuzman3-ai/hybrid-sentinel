'use client';

import { useState, useEffect } from 'react';

export default function AdminLedgerPage() {
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ledger/requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setRequests(data);
        } catch (err) { }
    };

    const handleProcess = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ledger/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, status })
            });
            fetchRequests();
        } catch (err) { }
    };

    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <h1 style={{ marginBottom: '24px' }}>Admin - Para Talepleri</h1>
            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '12px' }}>Kullanıcı</th>
                            <th style={{ padding: '12px' }}>Tür</th>
                            <th style={{ padding: '12px' }}>Miktar</th>
                            <th style={{ padding: '12px' }}>Ref No / Açıklama</th>
                            <th style={{ padding: '12px' }}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '12px' }}>
                                    {req.user.firstName} {req.user.lastName}<br />
                                    <small style={{ color: 'var(--text-secondary)' }}>{req.user.email}</small>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ color: req.type === 'DEPOSIT' ? 'var(--success)' : 'var(--danger)' }}>
                                        {req.type}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{req.amount.toLocaleString()} ₺</td>
                                <td style={{ padding: '12px', fontSize: '13px' }}>{req.referenceId || req.description || '-'}</td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleProcess(req.id, 'COMPLETED')}>Onayla</button>
                                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--danger)', border: '1px solid var(--danger)' }} onClick={() => handleProcess(req.id, 'REJECTED')}>Reddet</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {requests.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Bekleyen talep bulunamadı.</p>
                )}
            </div>
        </div>
    );
}
