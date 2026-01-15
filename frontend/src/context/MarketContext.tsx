'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type MarketData = {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    volume: number;
};

type OrderBook = {
    bids: { price: number; amount: number }[];
    asks: { price: number; amount: number }[];
};

type MarketContextType = {
    isConnected: boolean;
    marketData: Record<string, MarketData>; // Check O(1) by symbol
    ticker: MarketData[]; // Array for lists
    getDepth: (symbol: string) => OrderBook | null;
    lastUpdate: number;
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
    const [ticker, setTicker] = useState<MarketData[]>([]);
    const [depthData, setDepthData] = useState<Record<string, OrderBook>>({});
    const [lastUpdate, setLastUpdate] = useState(0);

    useEffect(() => {
        let ws: WebSocket;
        let reconnectTimer: NodeJS.Timeout;

        const connect = () => {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const wsUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');

            // Avoid duplicate connections (React Strict Mode etc.)
            if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

            console.log('Connecting to Market WS:', `${wsUrl}/market/ws`);
            ws = new WebSocket(`${wsUrl}/market/ws`);

            ws.onopen = () => {
                console.log('✅ Market WS Connected');
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data);

                    if (payload.type === 'MARKET_UPDATE' && Array.isArray(payload.data)) {
                        // Batch update state
                        const newMarketData: Record<string, MarketData> = {};
                        const newDepthData: Record<string, OrderBook> = {};

                        payload.data.forEach((item: any) => {
                            newMarketData[item.symbol] = {
                                symbol: item.symbol,
                                price: item.price,
                                change: item.change,
                                changePercent: item.changePercent,
                                high: item.high,
                                low: item.low,
                                volume: item.volume
                            };

                            if (item.orderBook) {
                                newDepthData[item.symbol] = item.orderBook;
                            }
                        });

                        setMarketData(prev => ({ ...prev, ...newMarketData }));
                        setTicker(Object.values(newMarketData)); // Update array for lists
                        setDepthData(prev => ({ ...prev, ...newDepthData }));
                        setLastUpdate(Date.now());
                    }
                } catch (err) {
                    console.error('WS Parse Error:', err);
                }
            };

            ws.onclose = () => {
                console.log('⚠️ Market WS Disconnected');
                setIsConnected(false);
                reconnectTimer = setTimeout(connect, 3000); // Auto reconnect
            };

            ws.onerror = (err) => {
                console.error('❌ Market WS Error:', err);
                ws.close();
            };
        };

        connect();

        return () => {
            if (ws) ws.close();
            clearTimeout(reconnectTimer);
        };
    }, []);

    const getDepth = (symbol: string) => depthData[symbol] || null;

    return (
        <MarketContext.Provider value={{ isConnected, marketData, ticker, getDepth, lastUpdate }}>
            {children}
        </MarketContext.Provider>
    );
}

export function useMarket() {
    const context = useContext(MarketContext);
    if (context === undefined) {
        throw new Error('useMarket must be used within a MarketProvider');
    }
    return context;
}
