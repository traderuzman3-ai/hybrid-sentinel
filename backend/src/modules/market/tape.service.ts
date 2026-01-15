export class TapeService {
    /**
     * Piyasada gerçekleşen anlık işlemleri (Time & Sales) simüle eder.
     * Bu veriler fiyat hareketlerine göre dinamik üretilir.
     */
    public static getTapeData(symbol: string, currentPrice: number) {
        const trades = [];
        const count = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < count; i++) {
            const isBuyer = Math.random() > 0.5;
            const spread = currentPrice * 0.0001;
            const price = isBuyer ? currentPrice + spread : currentPrice - spread;
            const amount = Math.random() * 2 + 0.1;

            trades.push({
                id: Math.random().toString(36).substr(2, 9),
                time: new Date().toLocaleTimeString('tr-TR', { hour12: false }),
                price: parseFloat(price.toFixed(symbol.includes('USD') ? 2 : 4)),
                amount: parseFloat(amount.toFixed(4)),
                side: isBuyer ? 'BUY' : 'SELL'
            });
        }

        return trades;
    }
}
