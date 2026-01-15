'use client';
import { useState, useEffect } from 'react';
import NewsTicker from '@/components/NewsTicker';
import SentimentWidget from '@/components/SentimentWidget';
import MarketScanner from '@/components/MarketScanner';
import MarketWatchlist from '@/components/MarketWatchlist';
import MarketHeatmap from '@/components/MarketHeatmap';
import PortfolioAnalytics from '@/components/PortfolioAnalytics';
import PortfolioDistribution from '@/components/PortfolioDistribution';
import WatchlistManager from '@/components/WatchlistManager';
import { useUser } from '@/context/UserContext';

export default function DashboardPage() {
    const [intel, setIntel] = useState<any>(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:3001/market/ws`);
        ws.onmessage = (e) => {
            const payload = JSON.parse(e.data);
            if (payload.intelligence) setIntel(payload.intelligence);
        };
        return () => ws.close();
    }, []);

    return (
        <div className="container" style={{ paddingBottom: '60px' }}>
            {intel && <NewsTicker news={intel.news} />}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100px' }}>
                        <h1 style={{ marginBottom: '8px', fontSize: '36px' }}>Piyasa Radarı</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                            Yapay zeka sinyalleri ve global haber akışıyla bir adım önde olun.
                        </p>
                    </div>
                    <WatchlistManager /> {/* Replaced MarketWatchlist with WatchlistManager */}
                    {intel && <MarketHeatmap data={intel.heatmap} />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <PortfolioAnalytics />
                    {intel && <SentimentWidget sentiment={intel.sentiment} />}
                    {intel && <MarketScanner scanData={intel.scan} />}
                </div>
            </div>
        </div>
    );
}
