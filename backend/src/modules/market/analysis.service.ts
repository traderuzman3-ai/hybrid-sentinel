export class TechnicalAnalysisEngine {
    /**
     * Basit bir RSI simülasyonu (Fiyat hareketlerinden türetilir)
     */
    public static calculateRSI(symbol: string, currentPrice: number): number {
        // Gerçekte son 14 mumun ortalaması alınır. 
        // Burada sembole göre deterministik ama dinamik bir RSI üretiyoruz.
        const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const base = (hash % 40) + 30; // 30-70 arası baz
        const noise = Math.sin(Date.now() / 100000) * 10;
        return Math.min(Math.max(base + noise, 0), 100);
    }

    /**
     * Trend yönünü belirler
     */
    public static getTrend(symbol: string): "UP" | "DOWN" | "NEUTRAL" {
        const rsi = this.calculateRSI(symbol, 0);
        if (rsi > 60) return "UP";
        if (rsi < 40) return "DOWN";
        return "NEUTRAL";
    }

    /**
     * Tüm sembolleri tarayıp "fırsat" olanları döner
     */
    public static scanMarket(prices: any[]) {
        return prices.map(p => {
            const rsi = this.calculateRSI(p.symbol, p.price);
            let signal = "IZLE";
            if (rsi < 35) signal = "AL (Aşırı Satım)";
            if (rsi > 65) signal = "SAT (Aşırı Alım)";

            return {
                symbol: p.symbol,
                rsi: rsi.toFixed(2),
                trend: this.getTrend(p.symbol),
                signal
            };
        });
    }
}
