'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, Zap, Eye, BarChart3, Globe, ShieldCheck } from 'lucide-react';

export default function SingularityDashboard() {
    const [metrics, setMetrics] = useState<any>(null);

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        fetch(`${baseUrl}/singularity/god-mode`)
            .then(res => res.json())
            .then(data => setMetrics(data));
    }, []);

    if (!metrics) return <div className="p-10 text-center">Singularity Engine Başlatılıyor...</div>;

    return (
        <div className="container" style={{ padding: '24px', minHeight: '100vh', background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)' }}>
            <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', background: 'linear-gradient(to right, #4cc9f0, #4361ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        SENTINEL SINGULARITY
                    </h1>
                    <p className="text-gray-400">Tanrı Modu Giriş: {metrics.systemControl}</p>
                </div>
                <div className="flex gap-4">
                    <span className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">V{metrics.evolution.iteration}</span>
                    <span className="px-4 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm">ACTİVE</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Core Evolution */}
                <div className="glass-card p-6 border-l-4 border-blue-500">
                    <div className="flex items-center gap-3 mb-4">
                        <Cpu className="text-blue-500" />
                        <h3 className="font-bold">Otonom Çekirdek</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">Gecikme Etkisi: <span className="text-blue-400">{metrics.evolution.latencyImpact}</span></p>
                    <div className="bg-black/50 p-3 rounded font-mono text-xs text-blue-300">
                        {metrics.evolution.optimization}
                    </div>
                </div>

                {/* Global Macro Intelligence */}
                <div className="glass-card p-6 border-l-4 border-purple-500">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="text-purple-500" />
                        <h3 className="font-bold">Makro Zeka</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">Piyasa Korku/Açgözlülük: <span className="text-purple-400">{metrics.macroForecast.globalSentiment}</span></p>
                    <ul className="text-xs space-y-2 mt-4">
                        {metrics.macroForecast.macroAlerts.map((alert: any, i: number) => (
                            <li key={i} className="flex gap-2 text-gray-300">
                                <span className="text-purple-500">❯</span> {alert.insight}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Planetary Impact */}
                <div className="glass-card p-6 border-l-4 border-green-500">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap className="text-green-500" />
                        <h3 className="font-bold">Gezegen Etkisi</h3>
                    </div>
                    <p className="text-sm text-gray-400">Karbon Ofseti: <span className="text-green-400">{metrics.planetaryImpact.footprint}</span></p>
                    <p className="text-sm text-gray-400 mt-2">Dikilen Ağaç Sayısı: <span className="text-green-400">{metrics.planetaryImpact.treesPlanted}</span></p>
                    <div className="mt-4 p-2 bg-green-500/10 rounded flex items-center gap-2">
                        <ShieldCheck size={16} className="text-green-500" />
                        <span className="text-xs text-green-300 italic">Net Sıfır Ticaret Sertifikalı</span>
                    </div>
                </div>
            </div>

            <div className="mt-10 glass-card p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Eye className="text-primary" /> Küresel Akış Gözlemcisi
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border border-white/5 rounded">
                        <p className="text-xs text-gray-500 mb-1">Q-Latency</p>
                        <p className="text-lg font-mono text-primary">0.0001ms</p>
                    </div>
                    <div className="text-center p-4 border border-white/5 rounded">
                        <p className="text-xs text-gray-500 mb-1">ZKP Proofs</p>
                        <p className="text-lg font-mono text-primary">Generated</p>
                    </div>
                    <div className="text-center p-4 border border-white/5 rounded">
                        <p className="text-xs text-gray-500 mb-1">CBDC Liquidity</p>
                        <p className="text-lg font-mono text-primary">Global</p>
                    </div>
                    <div className="text-center p-4 border border-white/5 rounded">
                        <p className="text-xs text-gray-500 mb-1">Autonomous</p>
                        <p className="text-lg font-mono text-primary">ENABLED</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
        }
      `}</style>
        </div>
    );
}
