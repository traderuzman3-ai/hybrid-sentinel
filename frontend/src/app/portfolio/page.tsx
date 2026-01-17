'use client';

import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PortfolioDistribution from '../../components/PortfolioDistribution';
import PortfolioPerformance from '../../components/PortfolioPerformance';
import { Wallet, TrendingUp, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function PortfolioPage() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                <BriefcaseIcon className="w-8 h-8 text-primary" />
                Varlık Yönetimi
            </h1>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    label="Toplam Varlık"
                    value="₺1,245,670.00"
                    trend="+2.4%"
                    positive={true}
                    icon={Wallet}
                />
                <StatCard
                    label="Günlük Kâr/Zarar"
                    value="+₺12,450.00"
                    trend="+1.1%"
                    positive={true}
                    icon={TrendingUp}
                />
                <StatCard
                    label="Açık Pozisyonlar"
                    value="8"
                    sub="Aktif İşlem"
                    icon={ArrowUpRight}
                />
                <StatCard
                    label="Nakit Oranı"
                    value="%25"
                    sub="Kullanılabilir Bakiye"
                    icon={History}
                />
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                <PortfolioPerformance />
                <PortfolioDistribution wallets={user.wallets || []} />
            </div>

            {/* Asset List (Table) */}
            <div className="bg-background-paper border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border font-bold text-sm">Varlık Detayları</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-background-light text-text-secondary text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Varlık</th>
                                <th className="px-6 py-3">Miktar</th>
                                <th className="px-6 py-3">Ort. Maliyet</th>
                                <th className="px-6 py-3">Anlık Değer</th>
                                <th className="px-6 py-3">PNL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {/* Simulated Rows */}
                            <AssetRow symbol="THYAO.IS" amount="5,000" avg="240.50" current="275.00" pnl="+14.3%" />
                            <AssetRow symbol="ASELS.IS" amount="2,000" avg="45.00" current="52.20" pnl="+16.0%" />
                            <AssetRow symbol="BTC" amount="0.45" avg="$42,000" current="$62,000" pnl="+47.6%" />
                            <AssetRow symbol="USD" amount="10,000" avg="32.50" current="34.10" pnl="+4.9%" />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, positive, sub, icon: Icon }: any) {
    return (
        <div className="bg-background-paper p-5 rounded-lg border border-border flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-text-secondary text-xs font-bold uppercase">{label}</span>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon size={18} />
                </div>
            </div>
            <div>
                <div className="text-2xl font-bold text-text-primary font-mono">{value}</div>
                {trend && (
                    <div className={`text-xs font-bold mt-1 flex items-center gap-1 ${positive ? 'text-green-500' : 'text-red-500'}`}>
                        {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trend}
                        <span className="text-text-muted font-normal ml-1">vs dün</span>
                    </div>
                )}
                {sub && <div className="text-xs text-text-muted mt-1">{sub}</div>}
            </div>
        </div>
    );
}

function AssetRow({ symbol, amount, avg, current, pnl }: any) {
    const isPos = pnl.includes('+');
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 font-bold">{symbol}</td>
            <td className="px-6 py-4 font-mono">{amount}</td>
            <td className="px-6 py-4 font-mono text-text-secondary">{avg}</td>
            <td className="px-6 py-4 font-mono">{current}</td>
            <td className={`px-6 py-4 font-mono font-bold ${isPos ? 'text-green-500' : 'text-red-500'}`}>{pnl}</td>
        </tr>
    );
}

function BriefcaseIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
    )
}
