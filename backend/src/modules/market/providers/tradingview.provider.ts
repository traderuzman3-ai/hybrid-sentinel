import axios from 'axios';
import * as cheerio from 'cheerio';
import { MarketProvider } from './provider.interface';
import { MarketData } from '../sentinel.service';

export class TradingViewProvider implements MarketProvider {
    name = 'TradingView';
    priority = 1;

    async getPrice(symbol: string): Promise<Partial<MarketData> | null> {
        try {
            // Mapping: ASELS.IS -> ASELS (TradingView symbols are usually raw)
            // Need a mapper service later, for now try direct
            const cleanSymbol = symbol.replace('.IS', '');
            const url = `https://www.tradingview.com/symbols/BIST-${cleanSymbol}/`;

            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            });

            const $ = cheerio.load(data);

            // Selectors are brittle and change. This is a best-guess based on current TV layout.
            // Seeking the main price class. Usually large font with `last-` class.
            const priceText = $('.js-symbol-last').text() || $('span[class*="last-"]').first().text();
            const changeText = $('span[class*="change-"]').first().text();

            if (!priceText) return null;

            const price = parseFloat(priceText.trim());
            const change = parseFloat(changeText.trim() || '0');

            return {
                source: 'TRADINGVIEW',
                price,
                change,
                updatedAt: Date.now()
            };

        } catch (error) {
            // console.error('TV Fetch Error:', error.message);
            return null;
        }
    }
}
