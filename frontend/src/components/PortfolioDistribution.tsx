'use client';

export default function PortfolioDistribution({ wallets }: { wallets: any[] }) {
    // Group by type (Crypto, Stock, Fiat)
    // Simulation: We define types based on currency for now
    const distribution = [
        { label: 'Hisse Senedi (BIST)', value: 45, color: '#3b82f6' }, // Blue
        { label: 'Kripto Varlıklar', value: 30, color: '#f59e0b' },   // Amber
        { label: 'Nakit (TRY/USD)', value: 25, color: '#10b981' },    // Emerald
    ];

    // Calculate conic gradient string
    let gradient = '';
    let currentDeg = 0;
    distribution.forEach((item) => {
        const deg = (item.value / 100) * 360;
        gradient += `${item.color} ${currentDeg}deg ${currentDeg + deg}deg, `;
        currentDeg += deg;
    });
    gradient = gradient.slice(0, -2); // Remove last comma

    return (
        <div className="bg-background-paper border border-border rounded-lg p-6 h-full flex flex-col">
            <h3 className="text-sm font-bold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full"></span>
                Varlık Dağılımı
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-around gap-8 flex-1">
                {/* Pie Chart */}
                <div
                    className="w-48 h-48 rounded-full relative shrink-0 shadow-lg"
                    style={{ background: `conic-gradient(${gradient})` }}
                >
                    {/* Inner hole for Donut effect */}
                    <div className="absolute inset-4 bg-background-paper rounded-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-[10px] text-text-secondary uppercase tracking-widest">TOPLAM</div>
                            <div className="text-xl font-bold text-text-primary">₺1.2M</div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-4 w-full">
                    {distribution.map((item) => (
                        <div key={item.label} className="flex items-center justify-between group cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{item.label}</span>
                            </div>
                            <span className="font-mono font-bold text-sm">%{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
