'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import { useUser } from '../../../context/UserContext';
import { Eye, Check, X, Loader2 } from 'lucide-react';

interface KycDocument {
    id: string;
    userId: string;
    user: {
        email: string;
        firstName: string;
        lastName: string;
    };
    documentType: string;
    fileUrl: string;
    status: string;
    uploadedAt: string;
    ocrData?: string;
}

export default function AdminKycPage() {
    const { user } = useUser();
    const [docs, setDocs] = useState<KycDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<KycDocument | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/kyc/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDocs(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        if (!confirm(status === 'APPROVED' ? 'Onaylamak istiyor musunuz?' : 'Reddetmek istiyor musunuz?')) return;

        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/kyc/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, status })
            });

            if (res.ok) {
                // Listeyi güncelle
                setDocs(docs.map(d => d.id === id ? { ...d, status } : d));
                if (selectedDoc?.id === id) setSelectedDoc(null);
            } else {
                alert('İşlem başarısız');
            }
        } catch (error) {
            alert('Hata oluştu');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto pt-24 px-6">
                <h1 className="text-2xl font-bold mb-6 text-slate-800">KYC Onay Bekleyenler</h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="p-4">Tarih</th>
                                <th className="p-4">Kullanıcı</th>
                                <th className="p-4">Belge Tipi</th>
                                <th className="p-4">Durum</th>
                                <th className="p-4 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {docs.map(doc => (
                                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">{new Date(doc.uploadedAt).toLocaleString('tr-TR')}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{doc.user?.firstName} {doc.user?.lastName}</div>
                                        <div className="text-xs text-slate-400">{doc.user?.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                            {doc.documentType}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${doc.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                            doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedDoc(doc)}
                                            className="btn btn-secondary btn-sm inline-flex items-center gap-1"
                                        >
                                            <Eye size={14} /> İncele
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {docs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        Bekleyen belge yok.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Document Modal */}
            {selectedDoc && (
                <div className="fixed inset-0 z-[1100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-bold text-lg">{selectedDoc.documentType}</h3>
                                <p className="text-sm text-slate-500">{selectedDoc.user?.email}</p>
                            </div>
                            <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-4 bg-slate-900 flex items-center justify-center">
                            {selectedDoc.fileUrl.endsWith('.pdf') ? (
                                <iframe src={`${process.env.NEXT_PUBLIC_API_URL}${selectedDoc.fileUrl}`} className="w-full h-full min-h-[500px]" />
                            ) : (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${selectedDoc.fileUrl}`}
                                    alt="Doc"
                                    className="max-w-full max-h-full object-contain shadow-lg"
                                />
                            )}
                        </div>

                        {/* Analysis Panel */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    🤖 Yapay Zeka Analizi (OCR)
                                </h4>
                                {selectedDoc.ocrData ? (
                                    <div className="text-xs space-y-1">
                                        {(() => {
                                            try {
                                                const ocr = JSON.parse(selectedDoc.ocrData);
                                                return Object.entries(ocr).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between border-b border-slate-50 last:border-0 py-1">
                                                        <span className="text-slate-500 capitalize">{k}:</span>
                                                        <span className="font-medium text-slate-800">{String(v)}</span>
                                                    </div>
                                                ));
                                            } catch (e) {
                                                return <div className="text-red-500">Veri okunamadı</div>;
                                            }
                                        })()}
                                    </div>
                                ) : (
                                    <div className="text-slate-400 text-sm italic">OCR verisi bulunamadı.</div>
                                )}
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    🛡️ Risk Değerlendirmesi
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className={`text-2xl font-bold ${(selectedDoc.user as any).riskScore > 70 ? 'text-red-600' :
                                        (selectedDoc.user as any).riskScore > 30 ? 'text-orange-600' : 'text-green-600'
                                        }`}>
                                        {(selectedDoc.user as any).riskScore || 0}
                                        <span className="text-xs font-normal text-slate-400 ml-1">/ 100</span>
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {(selectedDoc.user as any).riskScore > 70 ? 'Yüksek Risk' :
                                            (selectedDoc.user as any).riskScore > 30 ? 'Orta Risk' : 'Düşük Risk'}
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-slate-400">
                                    Otomatik AML/CFT taraması sonucunda hesaplanmıştır.
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => handleStatusUpdate(selectedDoc.id, 'REJECTED')}
                                className="btn bg-red-100 text-red-700 hover:bg-red-200 border-none flex items-center gap-2"
                                disabled={actionLoading || selectedDoc.status !== 'PENDING'}
                            >
                                <X size={16} /> Reddet
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedDoc.id, 'APPROVED')}
                                className="btn btn-primary flex items-center gap-2"
                                disabled={actionLoading || selectedDoc.status !== 'PENDING'}
                            >
                                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                Onayla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
