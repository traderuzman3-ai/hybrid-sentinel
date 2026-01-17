import axios from 'axios';
import * as cheerio from 'cheerio';
import { MarketProvider } from './provider.interface';
import { MarketData } from '../sentinel.service';

export class InvestingProvider implements MarketProvider {
    name = 'Investing.com';
    priority = 2;

    async getPrice(symbol: string): Promise<Partial<MarketData> | null> {
        try {
            // Investing URL format is specific. E.g. /equities/turkish-airlines
            // We need a search step or a mapper. For now, assuming a generic search or mapped URL.
            // This is a placeholder logic as Investing requires correct slug.

            // Search API to get slug
            const searchUrl = `https://api.investing.com/api/search/v2/search?q=${symbol.replace('.IS', '')}`;
            // Investing API often requires specific headers/tokens which are hard to forge.
            // Fallback to HTML search if possible or direct mapping if we had a DB.

            // For this phase, we will return NULL until we have the Mapping Database.
            // Scrapers without mapping are ineffective on Investing.com.
            return null;

        } catch (error) {
            return null;
        }
    }
}
