'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MarketChart } from '@/components/MarketChart';
import { useUser } from '@/context/UserContext';

import TimeAndSales from '@/components/TimeAndSales';

export default function TradePage() {
    const params = useParams();
    const symbol = params?.symbol || 'BTCUSDT';
    const { balance, refreshUserData } = useUser();
    const [marketData, setMarketData] = useState<any>(null);
    const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);
    const [tape, setTape] = useState<any[]>([]);
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');
    const [orderType, setOrderType] = useState('MARKET');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const wsUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
        const ws = new WebSocket(`${wsUrl}/market/ws`);

        ws.onmessage = (event) => {
            const payload = JSON.parse(event.data);
            if (payload.type === 'MARKET_UPDATE') {
                const data = payload.data.find((p: any) => p.symbol === symbol);
                if (data) {
                    setMarketData(data);
                    setTape(prev => [...data.tape, ...prev].slice(0, 30));
                    setChartData(prev => {
                        const now = new Date();
                        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                        const newData = [...prev, { time: timeStr, value: data.price }];
                        return newData.slice(-50);
                    });
                }
            }
        };

        return () => ws.close();
    }, [symbol]);

    const handleOrder = async (side: 'BUY' | 'SELL') => {
        if (!amount || parseFloat(amount) <= 0) return;
        if (orderType === 'LIMIT' && (!price || parseFloat(price) <= 0)) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/trade/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    symbol: symbol,
                    side,
                    type: orderType,
                    quantity: parseFloat(amount),
                    price: orderType === 'LIMIT' ? parseFloat(price) : null
                })
            });

            const data = await response.json();
            if (data.success) {
                // Simüle edilmiş başarı mesajı
                const order = data.order;
                const lastPrice = marketData?.price || 0; // Get current market price if available
                const newTrade = {
                    time: new Date().toLocaleTimeString(),
                    price: order.price || lastPrice,
                    amount: order.quantity,
                    side: order.side
                };
                // Tape'e ekle (simülasyon)
                // setTrades(prev => [newTrade, ...prev].slice(0, 20));
                alert(`Order placed successfully! Order ID: ${order.id}`);
                refreshUserData(); // Refresh user balance and positions
            } else {
                alert(`Order failed: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Order failed", error);
            alert("Order failed due to network or server error.");
        } finally {
            setLoading(false);
        }
    };

    if (!marketData) return <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>Market verisi bekleniyor...</div>;

    return (
        <div className="container" style={{ paddingBottom: '60px' }}>
            {/* HEADER BİLGİSİ */}
            <div className="glass" style={{ padding: '16px 24px', borderRadius: 'var(--radius)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h1 style={{ fontSize: '24px', margin: 0 }}>{symbol?.toString().replace('-USD', '').replace('.IS', '')}</h1>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--primary)' }}>
                            {marketData.price.toLocaleString()} {symbol?.toString().includes('.IS') ? '₺' : '$'}
                        </span>
                        <span style={{ color: marketData.changePercent >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '14px' }}>
                            {marketData.changePercent >= 0 ? '+' : ''}{marketData.changePercent.toFixed(2)}%
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '32px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>24s Yüksek</div>
                        <div style={{ fontWeight: '500' }}>{marketData.high.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>24s Düşük</div>
                        <div style={{ fontWeight: '500' }}>{marketData.low.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>24s Hacim</div>
                        <div style={{ fontWeight: '500' }}>{marketData.volume.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px 300px', gap: '20px' }}>

                {/* SOL: GRAFİK */}
                <div className="card" style={{ padding: '0', overflow: 'hidden', height: '500px' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>Fiyat Grafiği (Canlı)</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Source: {marketData.source}</span>
                    </div>
                    <div style={{ height: 'calc(100% - 50px)' }}>
                        <MarketChart data={chartData} />
                    </div>
                </div>

                {/* ORTA: DERİNLİK VE TAPE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card" style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>Derinlik (Order Book)</h3>
                        <div style={{ fontSize: '12px' }}>
                            <div style={{ marginBottom: '8px' }}>
                                {marketData.orderBook.asks.slice(0, 10).reverse().map((ask: any, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', height: '18px' }}>
                                        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(255, 71, 87, 0.08)', width: `${(ask.amount / 100) * 100}%` }}></div>
                                        <span style={{ color: 'var(--danger)', zIndex: 1 }}>{ask.price.toLocaleString()}</span>
                                        <span style={{ color: 'var(--text-secondary)', zIndex: 1 }}>{ask.amount.toFixed(3)}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', padding: '10px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', fontWeight: 'bold', fontSize: '16px', margin: '4px 0' }}>
                                {marketData.price.toLocaleString()}
                            </div>
                            <div>
                                {marketData.orderBook.bids.slice(0, 10).map((bid: any, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', height: '18px' }}>
                                        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(46, 213, 115, 0.08)', width: `${(bid.amount / 100) * 100}%` }}></div>
                                        <span style={{ color: 'var(--success)', zIndex: 1 }}>{bid.price.toLocaleString()}</span>
                                        <span style={{ color: 'var(--text-secondary)', zIndex: 1 }}>{bid.amount.toFixed(3)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <TimeAndSales trades={tape} />
                </div>

                {/* SAĞ: EMİR PANELİ */}
                <div className="card">
                    <h3 style={{ marginBottom: '24px' }}>Emir Paneli</h3>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '24px', backgroundColor: 'var(--border)', padding: '2px', borderRadius: '8px' }}>
                        <button className="btn" style={{ flex: 1, borderRadius: '6px', fontSize: '13px', backgroundColor: 'transparent', color: 'var(--success)' }}>ALIM</button>
                        <button className="btn" style={{ flex: 1, borderRadius: '6px', fontSize: '13px', backgroundColor: 'transparent', color: 'var(--text-secondary)' }}>SATIM</button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Emir Türü</label>
                        <select className="input" style={{ fontSize: '13px' }} value={orderType} onChange={e => setOrderType(e.target.value)}>
                            <option value="MARKET">Piyasa (Market)</option>
                            <option value="LIMIT">Limit</option>
                            <option value="STOP">Stop</option>
                        </select>
                    </div>

                    {orderType !== 'MARKET' && (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Fiyat</label>
                            <div style={{ position: 'relative' }}>
                                <input className="input" type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} />
                                <span style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    {symbol?.toString().includes('.IS') ? '₺' : '$'}
                                </span>
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Miktar</label>
                        <div style={{ position: 'relative' }}>
                            <input className="input" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
                            <span style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                {symbol?.toString().split('-')[0]}
                            </span>
                        </div>
                    </div>

                    <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Toplam</span>
                            <span style={{ fontWeight: '600' }}>
                                {((parseFloat(amount) || 0) * (orderType === 'LIMIT' ? parseFloat(price) : (marketData?.price || 0))).toLocaleString()} ₺
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Bakiye</span>
                            <span style={{ color: 'var(--primary)' }}>{balance.toLocaleString()} ₺</span>
                        </div>
                    </div>

                    <button
                        className={`btn ${loading ? 'btn-secondary' : 'btn-primary'}`}
                        disabled={loading}
                        style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 'bold' }}
                        onClick={() => handleOrder('BUY')}
                    >
                        {loading ? 'İŞLENİYOR...' : `${symbol?.toString().split('-')[0]} SATIN AL`}
                    </button>
                </div>

            </div>
        </div>
    );
}
