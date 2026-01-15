export class IntelligenceService {
    private static NEWS_SOURCES = [
        "🚀 BIST 100 endeksi günü rekor seviyede kapattı.",
        "📉 Fed faiz kararı sonrası dolar karşısında emtia fiyatları hareketlendi.",
        "🐳 Büyük bir kripto balinası 5000 BTC'yi soğuk cüzdana taşıdı.",
        "📈 Apple (AAPL) yeni yapay zeka özelliklerini duyurdu, hisseler yükselişte.",
        "⚡ Bitcoin %3'lük bir sıçrama ile direnç seviyesini zorluyor.",
        "🇹🇷 TCMB enflasyon raporu açıklandı, piyasa beklentileri karşılandı.",
        "🚗 Tesla (TSLA) üretim hedeflerini %10 artırdığını açıkladı.",
        "💎 Gram altın fiyatları ons bazlı yükselişle tarihi zirvesinde."
    ];

    public static getSentiment() {
        // Fear & Greed Index simülasyonu (0-100)
        // Gerçekte bu, sosyal medya ve haber verilerinden NLP ile türetilir.
        return {
            value: Math.floor(Math.random() * 30) + 40, // 40-70 arası "Greed" ağırlıklı
            label: "GREED",
            color: "var(--success)"
        };
    }

    public static getLiveNews() {
        // Rastgele 3 haber seç
        return this.NEWS_SOURCES.sort(() => 0.5 - Math.random()).slice(0, 3).map(content => ({
            id: Math.random().toString(36).substr(2, 9),
            content,
            timestamp: new Date().toLocaleTimeString('tr-TR')
        }));
    }
}
