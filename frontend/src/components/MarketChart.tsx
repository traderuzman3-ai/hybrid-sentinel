'use client';

import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

interface ChartProps {
    data: { time: string; open: number; high: number; low: number; close: number }[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        upColor?: string;
        downColor?: string;
    };
}

export const MarketChart = ({
    data,
    colors: {
        backgroundColor = 'transparent',
        textColor = '#64748b', // Slate 500
        upColor = '#10b981',    // Emerald 500
        downColor = '#ef4444',  // Red 500
    } = {},
}: ChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            grid: {
                vertLines: { color: 'rgba(0, 0, 0, 0.05)' }, // Darker grid for light mode
                horzLines: { color: 'rgba(0, 0, 0, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 480, // Taller chart
            timeScale: {
                borderVisible: false,
                borderColor: '#e2e8f0',
            },
            rightPriceScale: {
                borderVisible: false,
                borderColor: '#e2e8f0',
            }
        });

        // Candlestick Series
        const mainSeries = chart.addCandlestickSeries({
            upColor,
            downColor,
            borderUpColor: upColor,
            borderDownColor: downColor,
            wickUpColor: upColor,
            wickDownColor: downColor,
        });

        mainSeries.setData(data);

        // Bollinger Bands Calculation (based on close price)
        const closeData = data.map(d => ({ time: d.time, value: d.close }));
        const period = 20;
        const bbData = closeData.map((d, i) => {
            if (i < period) return null;
            const slice = closeData.slice(i - period, i);
            const avg = slice.reduce((acc, curr) => acc + curr.value, 0) / period;
            const stdDev = Math.sqrt(slice.reduce((acc, curr) => acc + Math.pow(curr.value - avg, 2), 0) / period);
            return { time: d.time, upper: avg + stdDev * 2, lower: avg - stdDev * 2 };
        }).filter(Boolean) as any[];

        if (bbData.length > 0) {
            const upperBandSeries = chart.addLineSeries({
                color: 'rgba(15, 23, 42, 0.2)', // Darker line for light mode
                lineWidth: 1,
                title: 'Upper BB'
            });
            const lowerBandSeries = chart.addLineSeries({
                color: 'rgba(15, 23, 42, 0.2)',
                lineWidth: 1,
                title: 'Lower BB'
            });

            upperBandSeries.setData(bbData.map(d => ({ time: d.time, value: d.upper })));
            lowerBandSeries.setData(bbData.map(d => ({ time: d.time, value: d.lower })));
        }

        chart.timeScale().fitContent();
        chartRef.current = chart;

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
    }, [data, backgroundColor, textColor, upColor, downColor]);

    return <div ref={chartContainerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};

// Default export for backward compatibility
export default MarketChart;
