export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export class FractalEngine {

    /**
     * Deconstructs a coarse candle into finer sub-candles.
     * Uses a constrained random walk (Brownian Bridge) logic.
     * 
     * @param parent The parent candle (e.g., 1 Day)
     * @param chunks How many sub-candles to generate (e.g., 24 for 1-hour chunks)
     */
    public static explodeCandle(parent: Candle, chunks: number): Candle[] {
        if (chunks <= 1) return [parent];

        const subCandles: Candle[] = [];
        const timeStep = (parent.time - (parent.time - 86400000)) / chunks; // Approximation, caller handles time logic really

        let currentOpen = parent.open;
        let remainingHigh = parent.high;
        let remainingLow = parent.low;

        // Volatility factor relative to the parent's range
        const range = parent.high - parent.low;
        const volatility = range * 0.5;

        for (let i = 0; i < chunks; i++) {
            const isLast = i === chunks - 1;

            // Target close for this sub-candle
            // If last, must close at parent.close.
            // Else, random walk towards parent.close but with noise.

            let targetClose;
            if (isLast) {
                targetClose = parent.close;
            } else {
                // Bias towards parent close gradually
                const progress = i / chunks;
                const bias = parent.open + (parent.close - parent.open) * progress;
                targetClose = bias + (Math.random() - 0.5) * volatility;
            }

            // Ensure we don't breach parent boundaries too early or too wildly
            // But we MUST hit them eventually if they are extremities

            // Local High/Low construction
            let subHigh = Math.max(currentOpen, targetClose) + Math.random() * (volatility * 0.2);
            let subLow = Math.min(currentOpen, targetClose) - Math.random() * (volatility * 0.2);

            // Constraint: Sub-candles generally shouldn't exceed parent bounds 
            // (Unless we want to simulate "wicks" that were smoothed out, but user wants strict breakdown)
            subHigh = Math.min(subHigh, parent.high);
            subLow = Math.max(subLow, parent.low);

            // Force extremities validation
            // If parent high was 100, and we are generating, we want at least ONE candle to hit 100.
            // A simple stochastic check:
            if (Math.random() < (1 / chunks) * 2) {
                // Chance to touch high/low
                if (Math.random() > 0.5 && remainingHigh > -Infinity) subHigh = parent.high;
                else if (remainingLow < Infinity) subLow = parent.low;
            }

            // Correction for logic errors (High < Low)
            if (subHigh < subLow) {
                const temp = subHigh;
                subHigh = subLow;
                subLow = temp;
            }

            subCandles.push({
                time: parent.time + (i * 1000), // Placeholder time, caller should fix times
                open: currentOpen,
                high: subHigh,
                low: subLow,
                close: targetClose,
                volume: Math.floor(parent.volume / chunks + (Math.random() * (parent.volume / chunks * 0.5)))
            });

            currentOpen = targetClose;
        }

        return subCandles;
    }

    /**
     * Recursively downsamples a dataset.
     * e.g. Daily[] -> Minute[]
     */
    public static fractalize(candles: Candle[], targetResolutionMultiplier: number): Candle[] {
        const result: Candle[] = [];

        for (const candle of candles) {
            const children = this.explodeCandle(candle, targetResolutionMultiplier);

            // Fix times
            const duration = 0; // Need source duration context. 
            // Simplified: Distribute times based on next candle diff or standard interval
            // For now, assume this is handled by just returning detailed points.

            result.push(...children);
        }

        return result;
    }
}
