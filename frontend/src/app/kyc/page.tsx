'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useUser } from '../../context/UserContext';
import { Upload, CheckCircle, AlertTriangle, FileText, ArrowRight, Loader2 } from 'lucide-react';
import MobileNav from '../../components/MobileNav';

export default function KYCPage() {
    const { user, refreshUserData } = useUser();
    const [step, setStep] = useState(1); // 1: Info, 2: ID Upload, 3: Address, 4: Success
    const [loading, setLoading] = useState(false);

    // File states
    const [idFront, setIdFront] = useState<File | null>(null);
    const [idBack, setIdBack] = useState<File | null>(null);
    const [addressProof, setAddressProof] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'pending' | 'success' | 'error' }>({});

    const handleFileUpload = async (file: File, docType: string) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', docType);

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');

            setUploadStatus(prev => ({ ...prev, [docType]: 'success' }));
        } catch (error) {
            console.error(error);
            setUploadStatus(prev => ({ ...prev, [docType]: 'error' }));
            alert('Dosya yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const submitAll = async () => {
        // Here we assume individual uploads are handled immediately or we could batch them.
        // For this flow, we upload one by one when selected or valid.
        // Let's verify we have everything.

        if (!idFront || !idBack || !addressProof) {
            alert('Lütfen tüm belgeleri yükleyiniz.');
            return;
        }

        setLoading(true);
        try {
            // Sequential upload if not already uploaded
            if (uploadStatus['ID_FRONT'] !== 'success') await handleFileUpload(idFront, 'ID_FRONT');
            if (uploadStatus['ID_BACK'] !== 'success') await handleFileUpload(idBack, 'ID_BACK');
            if (uploadStatus['ADDRESS'] !== 'success') await handleFileUpload(addressProof, 'ADDRESS');

            await refreshUserData();
            setStep(4);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
            <Navbar />

            <div className="max-w-3xl mx-auto pt-32 px-6">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Kimlik Doğrulama (KYC)</h1>
                        <p className="text-slate-500">Yasal düzenlemeler gereği kimliğinizi doğrulamamız gerekiyor.</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-center gap-4 mb-12">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`w-3 h-3 rounded-full transition-all ${step >= s ? 'bg-primary scale-125' : 'bg-slate-200'}`} />
                        ))}
                    </div>

                    {/* Step 1: Info Confirmation */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
                                <FileText className="text-blue-600 shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-1">Kişisel Bilgileriniz</h3>
                                    <p className="text-sm text-blue-800/80 mb-4">Lütfen bilgilerin güncel olduğundan emin olun.</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-xs text-blue-400 uppercase font-bold tracking-wider">Ad Soyad</div>
                                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-blue-400 uppercase font-bold tracking-wider">Email</div>
                                            <div className="font-medium">{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setStep(2)} className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2">
                                Doğrulamayı Başlat <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Step 2: ID Upload */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">Kimlik Yükleme</h3>
                                <p className="text-sm text-slate-500">Nüfus cüzdanınızın ön ve arka yüzünü yükleyiniz.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Front */}
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-slate-50">
                                    <div className="mb-4 flex justify-center">
                                        {idFront ? <CheckCircle className="text-green-500" size={40} /> : <div className="w-16 h-10 bg-slate-200 rounded mb-2 border-2 border-white shadow-sm"></div>}
                                    </div>
                                    <div className="text-sm font-medium mb-2">Ön Yüz</div>
                                    <input
                                        type="file"
                                        id="idFront"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setIdFront(e.target.files?.[0] || null)}
                                    />
                                    <label htmlFor="idFront" className="btn btn-secondary btn-sm cursor-pointer">
                                        {idFront ? 'Değiştir' : 'Dosya Seç'}
                                    </label>
                                    {idFront && <div className="text-xs text-slate-500 mt-2 truncate max-w-[150px] mx-auto">{idFront.name}</div>}
                                </div>

                                {/* Back */}
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-slate-50">
                                    <div className="mb-4 flex justify-center">
                                        {idBack ? <CheckCircle className="text-green-500" size={40} /> : <div className="w-16 h-10 bg-slate-200 rounded mb-2 border-2 border-white shadow-sm"></div>}
                                    </div>
                                    <div className="text-sm font-medium mb-2">Arka Yüz</div>
                                    <input
                                        type="file"
                                        id="idBack"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setIdBack(e.target.files?.[0] || null)}
                                    />
                                    <label htmlFor="idBack" className="btn btn-secondary btn-sm cursor-pointer">
                                        {idBack ? 'Değiştir' : 'Dosya Seç'}
                                    </label>
                                    {idBack && <div className="text-xs text-slate-500 mt-2 truncate max-w-[150px] mx-auto">{idBack.name}</div>}
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(3)}
                                disabled={!idFront || !idBack}
                                className="w-full btn btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Devam Et
                            </button>
                        </div>
                    )}

                    {/* Step 3: Address Proof */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">İkametgah Belgesi</h3>
                                <p className="text-sm text-slate-500">e-Devlet'ten alacağınız barkodlu ikametgah belgesini yükleyiniz.</p>
                            </div>

                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:border-primary/50 transition-colors bg-slate-50">
                                <div className="mb-4 flex justify-center">
                                    {addressProof ? <CheckCircle className="text-green-500" size={48} /> : <FileText className="text-slate-300" size={48} />}
                                </div>
                                <div className="text-sm font-medium mb-4">Belge Yükle (PDF veya Resim)</div>
                                <input
                                    type="file"
                                    id="addressProof"
                                    className="hidden"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setAddressProof(e.target.files?.[0] || null)}
                                />
                                <label htmlFor="addressProof" className="btn btn-secondary cursor-pointer">
                                    {addressProof ? 'Dosya Değiştir' : 'Dosya Seç'}
                                </label>
                                {addressProof && <div className="text-xs text-slate-500 mt-2">{addressProof.name}</div>}
                            </div>

                            <button
                                onClick={submitAll}
                                disabled={!addressProof || loading}
                                className="w-full btn btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin" size={20} />}
                                Onaya Gönder
                            </button>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center py-10 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="text-green-600 w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Belgeler Gönderildi!</h2>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                Belgeleriniz inceleme kuyruğuna alındı. Onaylandığında size bildirim göndereceğiz ve işlem limitleriniz artırılacak.
                            </p>
                            <a href="/dashboard" className="btn btn-primary px-8">Dashboard'a Dön</a>
                        </div>
                    )}

                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
                <MobileNav />
            </div>
        </div>
    );
}
