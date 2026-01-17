'use client';

import { Calendar, Globe, AlertTriangle } from 'lucide-react';

export default function EconomicCalendar() {
    // Simulated realistic calendar data
    // In a real app, this would fetch from an API like investing.com/economic-calendar
    const events = [
        { id: 1, time: '10:00', country: 'TR', event: 'TÜFE (Yıllık)', impact: 'HIGH', actual: '64.8%', forecast: '65.0%', prev: '61.9%' },
        { id: 2, time: '14:00', country: 'TR', event: 'TCMB Faiz Kararı', impact: 'HIGH', actual: '45.0%', forecast: '45.0%', prev: '42.5%' },
        { id: 3, time: '15:30', country: 'US', event: 'Tarım Dışı İstihdam', impact: 'HIGH', actual: '--', forecast: '180K', prev: '216K' },
        { id: 4, time: '15:30', country: 'US', event: 'İşsizlik Oranı', impact: 'HIGH', actual: '--', forecast: '3.8%', prev: '3.7%' },
        { id: 5, time: '17:00', country: 'US', event: 'ISM İmalat PMI', impact: 'MEDIUM', actual: '--', forecast: '47.2', prev: '47.4' },
        { id: 6, time: '21:00', country: 'US', event: 'FOMC Tutanakları', impact: 'MEDIUM', actual: '--', forecast: '', prev: '' },
    ];

    return (
        <div className="flex flex-col h-full bg-background-paper border-l border-border w-full">
            <div className="p-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">Ekonomik Takvim</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-[10px] bg-background-light px-2 py-0.5 rounded text-text-secondary">Bugün</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col">
                    {events.map((e) => (
                        <div key={e.id} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs text-text-secondary">{e.time}</span>
                                    <div className={`w-1 h-1 rounded-full ${e.country === 'US' ? 'bg-blue-500' : 'bg-red-500'
                                        }`} />
                                    <span className="font-bold text-xs">{e.country}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className={`w-1 h-2 rounded-sm ${e.impact === 'HIGH' ? 'bg-red-500' :
                                                e.impact === 'MEDIUM' && i < 2 ? 'bg-yellow-500' :
                                                    e.impact === 'LOW' && i < 1 ? 'bg-green-500' : 'bg-gray-700'
                                            }`} />
                                    ))}
                                </div>
                            </div>

                            <div className="text-xs font-medium text-text-primary mb-2 group-hover:text-primary transition-colors">
                                {e.event}
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-[10px]">
                                <div className="flex flex-col">
                                    <span className="text-text-secondary mb-0.5">Gerçekleşen</span>
                                    <span className="font-mono text-primary font-bold">{e.actual}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-text-secondary mb-0.5">Beklenti</span>
                                    <span className="font-mono">{e.forecast}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-text-secondary mb-0.5">Önceki</span>
                                    <span className="font-mono text-text-disabled">{e.prev}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-2 border-t border-border bg-background-light/30">
                <div className="flex items-center justify-center gap-2 text-[10px] text-text-secondary">
                    <Globe className="w-3 h-3" />
                    <span>Tüm veriler TSİ ile gösterilmektedir.</span>
                </div>
            </div>
        </div>
    );
}
