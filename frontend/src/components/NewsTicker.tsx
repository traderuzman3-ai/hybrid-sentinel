'use client';

import { useEffect, useState } from 'react';
import { useMarket } from '@/context/MarketContext';

export default function NewsTicker() {
    const { intelligence } = useMarket();
    const [news, setNews] = useState<any[]>([]);

    useEffect(() => {
        if (intelligence && intelligence.news) {
            setNews(intelligence.news);
        }
    }, [intelligence]);

    if (!news || news.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-background-paper border-t border-border h-8 flex items-center z-50 overflow-hidden">
            <div className="flex items-center px-4 bg-primary/10 h-full border-r border-border shrink-0">
                <span className="text-primary text-xs font-bold uppercase tracking-wider">LATEST WIRE</span>
            </div>

            <div className="overflow-hidden relative w-full h-full flex items-center">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-8 pl-4">
                    {news.map((item: any, i) => (
                        <div key={item.id + i} className="flex items-center gap-2 text-xs">
                            <span className={`font-mono font-bold ${item.impact === 'HIGH' ? 'text-red-400' : 'text-text-secondary'
                                }`}>
                                [{item.source}]
                            </span>
                            <span className="text-text-primary">
                                {item.headline}
                            </span>
                            <span className="text-text-secondary opacity-50 text-[10px]">
                                {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    ))}
                    {/* Duplicate for infinite loop illusion */}
                    {news.map((item: any, i) => (
                        <div key={item.id + i + 'dup'} className="flex items-center gap-2 text-xs">
                            <span className={`font-mono font-bold ${item.impact === 'HIGH' ? 'text-red-400' : 'text-text-secondary'
                                }`}>
                                [{item.source}]
                            </span>
                            <span className="text-text-primary">
                                {item.headline}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
