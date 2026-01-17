'use client';

import { Headset, Mail, MessageCircle, FileQuestion, ChevronRight, AlertTriangle } from 'lucide-react';
import BrandHeader from '@/components/BrandHeader';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col">
            <BrandHeader />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                        <Headset className="w-10 h-10 text-primary" />
                        7/24 Canlı Destek Merkezi
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Profesyonel ekibimiz her türlü sorunuz için hazır.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Live Support */}
                    <div className="bg-background-paper border border-border p-6 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                            <MessageCircle size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Canlı Sohbet</h3>
                        <p className="text-text-secondary text-sm mb-4">
                            Yatırım uzmanlarımızla anında görüşün. Ortalama yanıt süresi: &lt; 1 dk.
                        </p>
                        <button className="text-primary font-bold text-sm flex items-center gap-1">
                            Sohbeti Başlat <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Email Support */}
                    <div className="bg-background-paper border border-border p-6 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform">
                            <Mail size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">E-Posta Desteği</h3>
                        <p className="text-text-secondary text-sm mb-4">
                            Hesap onayı, teknik sorunlar ve kurumsal talepleriniz için.
                        </p>
                        <button className="text-blue-500 font-bold text-sm flex items-center gap-1">
                            Talep Oluştur <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* FAQ */}
                    <div className="bg-background-paper border border-border p-6 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 text-amber-500 group-hover:scale-110 transition-transform">
                            <FileQuestion size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Sıkça Sorulanlar</h3>
                        <p className="text-text-secondary text-sm mb-4">
                            Para yatırma/çekme, KYC ve işlem limitleri hakkında bilgiler.
                        </p>
                        <button className="text-amber-500 font-bold text-sm flex items-center gap-1">
                            Rehbere Git <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Status Monitor */}
                <div className="bg-background-paper border border-border rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-green-500" size={20} />
                        Sistem Durumu
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatusItem label="Borsa Motoru" status="Operational" />
                        <StatusItem label="API Bağlantıları" status="Operational" />
                        <StatusItem label="Para Yatırma/Çekme" status="Operational" />
                        <StatusItem label="Web Arayüzü" status="Operational" />
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatusItem({ label, status }: { label: string, status: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs text-text-secondary">{label}</span>
            <span className="text-sm font-bold text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {status}
            </span>
        </div>
    );
}
