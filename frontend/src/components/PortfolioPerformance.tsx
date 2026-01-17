'use client';

import { createChart, ColorType } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export default function PortfolioPerformance() {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#9ca3af',
            },
            width: chartContainerRef.current.clientWidth,
            height: 250,
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            rightPriceScale: {
                borderVisible: false,
            },
            timeScale: {
                borderVisible: false,
            },
        });

        const newSeries = chart.addAreaSeries({
            lineColor: '#10b981',
            topColor: 'rgba(16, 185, 129, 0.4)',
            bottomColor: 'rgba(16, 185, 129, 0.0)',
            lineWidth: 2,
        });

        // Simulated P&L Data (Growth)
        const data = [];
        let value = 100000;
        const now = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            value = value * (1 + (Math.random() - 0.4) * 0.05); // Random growth
            data.push({
                time: date.toISOString().split('T')[0],
                value: value
            });
        }

        newSeries.setData(data);
        chart.timeScale().fitContent();

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return (
        <div className="bg-background-paper border border-border rounded-lg p-6 h-full flex flex-col">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                    Portföy Gelişimi (30 Gün)
                </div>
                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-xs">+%12.4</span>
            </h3>
            <div ref={chartContainerRef} className="flex-1 w-full" />
        </div>
    );
}
