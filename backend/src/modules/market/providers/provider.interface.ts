import { MarketData } from '../sentinel.service';

export interface MarketProvider {
    name: string;
    priority: number;
    getPrice(symbol: string): Promise<Partial<MarketData> | null>;
}
