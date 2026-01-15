'use client';

import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

interface ChartProps {
    data: { time: string; value: number }[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

export const MarketChart = ({
    data,
    colors: {
        backgroundColor = 'transparent',
        lineColor = '#4cc9f0',
        textColor = '#94a3b8',
        areaTopColor = 'rgba(76, 201, 240, 0.3)',
        areaBottomColor = 'rgba(76, 201, 240, 0.0)',
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
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            timeScale: {
                borderVisible: false,
            },
            rightPriceScale: {
                borderVisible: false,
            }
        });

        const areaSeries = chart.addAreaSeries({
            lineColor: '#2962FF',
            topColor: '#2962FF',
            bottomColor: 'rgba(41, 98, 255, 0.28)',
        });

        // BOLLINGER BANDS (Faz 4.2)
        const upperBandSeries = chart.addLineSeries({ color: 'rgba(255, 255, 255, 0.2)', lineWidth: 1, title: 'Upper BB' });
        const lowerBandSeries = chart.addLineSeries({ color: 'rgba(255, 255, 255, 0.2)', lineWidth: 1, title: 'Lower BB' });

        areaSeries.setData(data);

        // Simple BB Calculation
        const period = 20;
        const bbData = data.map((d, i) => {
            if (i < period) return null;
            const slice = data.slice(i - period, i);
            const avg = slice.reduce((acc, curr) => acc + curr.value, 0) / period;
            const stdDev = Math.sqrt(slice.reduce((acc, curr) => acc + Math.pow(curr.value - avg, 2), 0) / period);
            return { time: d.time, upper: avg + stdDev * 2, lower: avg - stdDev * 2 };
        }).filter(Boolean) as any[];

        upperBandSeries.setData(bbData.map(d => ({ time: d.time, value: d.upper })));
        lowerBandSeries.setData(bbData.map(d => ({ time: d.time, value: d.lower })));

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
    }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    return <div ref={chartContainerRef} style={{ width: '100%', position: 'relative' }} />;
};

// Default export for backward compatibility
export default MarketChart;
