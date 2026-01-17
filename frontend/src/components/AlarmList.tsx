'use client';

import { useState, useEffect } from 'react';
import { Bell, Trash2, PlusCircle } from 'lucide-react';

export default function AlarmList({ symbol, currentPrice }: { symbol: string, currentPrice: number }) {
    const [alarms, setAlarms] = useState<any[]>([]);
    const [targetPrice, setTargetPrice] = useState('');
    const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch Alarms
        // Mock for now until API is ready
        setAlarms([]);
    }, [symbol]);

    const handleAddAlarm = async () => {
        if (!targetPrice) return;

        // Optimistic UI
        const newAlarm = {
            id: Date.now().toString(),
            symbol,
            targetPrice: parseFloat(targetPrice),
            condition,
            isActive: true
        };
        setAlarms([...alarms, newAlarm]);
        setTargetPrice('');

        // TODO: Call API
    };

    const handleDelete = (id: string) => {
        setAlarms(alarms.filter(a => a.id !== id));
        // TODO: Call API
    };

    return (
        <div className="card-matte p-3 mt-2 border border-border-subtle rounded-md bg-white">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-primary-navy flex items-center gap-1">
                    <Bell size={12} /> Fiyat Alarmları
                </h3>
            </div>

            {/* Add Alarm Form */}
            <div className="flex gap-1 mb-3">
                <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as 'ABOVE' | 'BELOW')}
                    className="text-xs border rounded px-1 bg-gray-50"
                >
                    <option value="ABOVE">Viv</option>
                    <option value="BELOW">Alt</option>
                </select>
                <input
                    type="number"
                    placeholder="Hedef Fiyat"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="flex-1 text-xs border rounded px-1"
                />
                <button
                    onClick={handleAddAlarm}
                    className="bg-primary text-white p-1 rounded hover:bg-primary-hover"
                >
                    <PlusCircle size={14} />
                </button>
            </div>

            {/* Alarm List */}
            <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                {alarms.map(alarm => (
                    <div key={alarm.id} className="flex items-center justify-between text-xs p-1.5 bg-gray-50 rounded border border-gray-100">
                        <span className="font-mono-data">
                            {alarm.condition === 'ABOVE' ? '≥' : '≤'} {alarm.targetPrice} ₺
                        </span>
                        <button onClick={() => handleDelete(alarm.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
                {alarms.length === 0 && (
                    <div className="text-[10px] text-text-muted text-center py-2">
                        Alarm kurulu değil.
                    </div>
                )}
            </div>
        </div>
    );
}
