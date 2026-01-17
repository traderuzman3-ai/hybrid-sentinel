'use client';

import UserMonitor from '@/components/admin/UserMonitor';
import GodPriceControl from '@/components/admin/GodPriceControl';
import { ShieldCheck, Activity, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-red-600 text-white p-2 rounded-lg">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900">MEGATRON ADMIN</h1>
                        <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">God Mode Active</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <StatCard label="Online Users" value="12" icon={Users} color="text-green-600" />
                    <StatCard label="Total Volume" value="$4.2M" icon={Activity} color="text-blue-600" />
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: God Control */}
                <div className="lg:col-span-1">
                    <GodPriceControl />

                    {/* Quick Stats / Logs could go here */}
                    <div className="mt-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-sm text-gray-500 uppercase mb-3">Sistem Logları</h3>
                        <div className="text-xs font-mono space-y-2 text-gray-600">
                            <div className="flex justify-between">
                                <span>[10:42:01]</span>
                                <span>BoFA Bot Started</span>
                            </div>
                            <div className="flex justify-between text-red-500">
                                <span>[10:41:55]</span>
                                <span>User #419 Liquidated</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>[10:40:12]</span>
                                <span>Deposit: 50,000 TRY</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: User Monitor */}
                <div className="lg:col-span-2">
                    <UserMonitor />
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            <Icon size={20} className={color} />
            <div>
                <div className="text-[10px] text-gray-400 uppercase font-bold">{label}</div>
                <div className="font-bold text-gray-800">{value}</div>
            </div>
        </div>
    );
}
