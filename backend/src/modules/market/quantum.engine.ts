
export class QuantumEngine {
    // volatilite katsayısı (Daha canlı veya daha sakin piyasa için)
    private static VOLATILITY_FACTOR = 0.0008;

    /**
     * Gerçek fiyata (anchorPrice) dayalı kuantum gürültüsü ekler.
     * Bu metod, fiyatı çapa etrafında rastgele ama mantıklı şekilde salındırır.
     */
    public static fluctuatePrice(anchorPrice: number, currentPrice: number, volatility: number = 0.0008): number {
        // Rastgele yön belirleme (Piyasa gürültüsü)
        // -0.5 ile 0.5 arası bir değer
        const noise = Math.random() - 0.5;

        // Değişim miktarı (Fiyatın %0.08'i kadar maksimum sapma)
        const delta = anchorPrice * volatility * noise;

        // Yeni potansiyel fiyat
        let newPrice = currentPrice + delta;

        // EMNİYET SÜBABI: Eğer fiyat çapa fiyattan %1'den fazla uzaklaşırsa, zorla geri çek.
        // Bu, simülasyonun gerçeklikten kopmasını engeller.
        const maxDeviation = anchorPrice * 0.01;
        if (Math.abs(newPrice - anchorPrice) > maxDeviation) {
            // Ortalamaya dönüş (Mean Reversion)
            newPrice = anchorPrice + (noise * maxDeviation * 0.5);
        }

        // Kripto için 2, BIST için 2 basamak hassasiyet (string dönüşümü gerekirse burada yapılır ama number dönüyoruz)
        return newPrice;
    }

    /**
     * Hacim simülasyonu: Fiyat hareketine göre yapay hacim üretir.
     */
    public static generateVolume(baseVolume: number): number {
        // Hacim her saniye %0.01 ile %0.05 arası artar
        const growth = baseVolume * (Math.random() * 0.0005);
        return baseVolume + growth;
    }
}
