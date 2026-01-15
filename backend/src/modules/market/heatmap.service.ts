export class HeatmapService {
    /**
     * Tüm market verilerini ısı haritası için karelere dönüştürür.
     * Büyük kareler = Yüksek hacim
     * Renk tonu = Değişim yüzdesi
     */
    public static getHeatmapData(prices: any[]) {
        // Toplam hacmi bul (Ağırlıklandırma için)
        const totalVolume = prices.reduce((acc, p) => acc + p.volume, 0);

        return prices.map(p => {
            // Hacim ağırlığı (0.5 ile 2.0 arası bir katsayı)
            const weight = (p.volume / (totalVolume / prices.length)) * 0.5 + 0.5;

            // Renk yoğunluğu (Değişim yüzdesine göre -%5 ile +%5 odak noktası)
            const absChange = Math.min(Math.abs(p.changePercent), 5) / 5;
            const color = p.changePercent >= 0
                ? `rgba(46, 213, 115, ${0.1 + absChange * 0.9})`
                : `rgba(255, 71, 87, ${0.1 + absChange * 0.9})`;

            return {
                symbol: p.symbol.replace('-USD', '').replace('.IS', ''),
                changePercent: p.changePercent,
                weight: Math.min(weight, 2.5), // Çok büyük olmasın
                color
            };
        });
    }
}
