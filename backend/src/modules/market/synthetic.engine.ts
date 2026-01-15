export interface OrderBookEntry {
    price: number;
    amount: number;
    total: number;
}

export interface OrderBook {
    symbol: string;
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
}

export class SyntheticEngine {
    /**
     * Gerçek fiyat ve hacim verisinden profesyonel görünümlü bir derinlik tablosu üretir.
     */
    public static generateOrderBook(symbol: string, currentPrice: number): OrderBook {
        const bids: OrderBookEntry[] = [];
        const asks: OrderBookEntry[] = [];

        const spread = currentPrice * 0.0005; // %0.05 spread
        const step = currentPrice * 0.0002;   // Her kademe arası fark

        let totalBid = 0;
        let totalAsk = 0;

        for (let i = 0; i < 15; i++) {
            // Bids (Alıcılar)
            const bidPrice = currentPrice - (spread / 2) - (i * step);
            const bidAmount = Math.random() * (100 / (i + 1)) + 1;
            totalBid += bidAmount;
            bids.push({
                price: parseFloat(bidPrice.toFixed(symbol.includes('USD') ? 2 : 4)),
                amount: parseFloat(bidAmount.toFixed(4)),
                total: parseFloat(totalBid.toFixed(4))
            });

            // Asks (Satıcılar)
            const askPrice = currentPrice + (spread / 2) + (i * step);
            const askAmount = Math.random() * (100 / (i + 1)) + 1;
            totalAsk += askAmount;
            asks.push({
                price: parseFloat(askPrice.toFixed(symbol.includes('USD') ? 2 : 4)),
                amount: parseFloat(askAmount.toFixed(4)),
                total: parseFloat(totalAsk.toFixed(4))
            });
        }

        return { symbol, bids, asks };
    }
}
