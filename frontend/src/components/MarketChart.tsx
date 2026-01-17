'use client';

import { createChart, ColorType, IChartApi, ISeriesApi, Time, CandlestickData } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

interface ChartProps {
    // time can be either YYYY-MM-DD string (daily+) or Unix timestamp number (intraday)
    data: { time: string | number; open: number; high: number; low: number; close: number }[];
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
            localization: {
                locale: 'tr-TR',
                dateFormat: 'dd MMM yyyy',
                // Hem tarih hem saati zorla göster
                timeFormatter: (time: number | string) => {
                    const date = new Date(typeof time === 'number' ? time * 1000 : time);
                    if (isNaN(date.getTime())) return String(time);

                    // Tarih ve Saati beraber döndür: "17 Oca 2026 14:30"
                    return date.toLocaleString('tr-TR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            },
            timeScale: {
                borderVisible: false,
                borderColor: '#e2e8f0',
                // Allow scrolling
                fixLeftEdge: false,
                fixRightEdge: false,
                // Prevents gaps for weekends/holidays in stock data
                timeVisible: true,
                secondsVisible: false,
            },
            handleScroll: {
                mouseWheel: true,
                pressedMouseMove: true,
                horzTouchDrag: true,
                vertTouchDrag: true,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true,
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

        // Defensive programming: Sort and Deduplicate data to prevent "Assertion failed"
        const sortedData = [...data]
            .sort((a, b) => {
                if (typeof a.time === 'string' && typeof b.time === 'string') {
                    return a.time.localeCompare(b.time);
                }
                return (a.time as unknown as number) - (b.time as unknown as number);
            });

        const uniqueData: typeof data = [];
        const seenTimes = new Set();

        for (const item of sortedData) {
            if (!seenTimes.has(item.time)) {
                seenTimes.add(item.time);
                uniqueData.push(item);
            }
        }

        mainSeries.setData(uniqueData as CandlestickData<Time>[]);

        // Bollinger Bands Removed per user request

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
