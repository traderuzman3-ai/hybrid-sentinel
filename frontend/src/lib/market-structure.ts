// Bu liste Backend ile senkronize olmalı. Şimdilik frontend tarafında statik tanımlıyoruz.
export const MARKET_STRUCTURE = {
    US: {
        flag: '🇺🇸',
        name: 'Amerika',
        exchanges: {
            NASDAQ: {
                name: 'NASDAQ',
                indices: {
                    'NDX': { name: 'Nasdaq 100', symbols: ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META'] },
                    'COMP': { name: 'Nasdaq Composite', symbols: ['NFLX', 'AMD', 'INTC', 'CSCO', 'AVGO'] }
                }
            },
            NYSE: {
                name: 'NYSE',
                indices: {
                    'SPX': { name: 'S&P 500', symbols: ['JPM', 'V', 'WMT', 'KO', 'DIS', 'BA', 'XOM'] },
                    'DJI': { name: 'Dow Jones', symbols: ['GS', 'IBM', 'MMM', 'CAT', 'CVX'] }
                }
            }
        }
    },
    TR: {
        flag: '🇹🇷',
        name: 'Türkiye',
        exchanges: {
            BIST: {
                name: 'Borsa İstanbul',
                indices: {
                    'XU100': { name: 'BIST 100', symbols: ['THYAO.IS', 'ASELS.IS', 'GARAN.IS', 'EREGL.IS', 'SASA.IS', 'SISE.IS', 'KCHOL.IS', 'AKBNK.IS'] },
                    'XU30': { name: 'BIST 30', symbols: ['TUPRS.IS', 'FROTO.IS', 'BIMAS.IS', 'KOZAL.IS', 'EKGYO.IS', 'PETKM.IS'] }
                }
            }
        }
    },
    CRYPTO: {
        flag: '₿',
        name: 'Kripto',
        exchanges: {
            BINANCE: {
                name: 'Binance',
                indices: {
                    'TOP10': { name: 'Top 10', symbols: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD'] },
                    'DEFI': { name: 'DeFi', symbols: ['UNI-USD', 'AAVE-USD', 'LINK-USD'] }
                }
            }
        }
    },
    COMMODITY: {
        flag: '🪙',
        name: 'Emtia',
        exchanges: {
            GLOBAL: {
                name: 'Global',
                indices: {
                    'METALS': { name: 'Metaller', symbols: ['GC=F', 'SI=F', 'HG=F', 'PL=F'] },
                    'ENERGY': { name: 'Enerji', symbols: ['CL=F', 'NG=F'] }
                }
            }
        }
    },
    FOREX: {
        flag: '💱',
        name: 'Forex',
        exchanges: {
            FX: {
                name: 'Global FX',
                indices: {
                    'MAJORS': { name: 'Majörler', symbols: ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'USDCHF=X'] },
                    'TRY': { name: 'TRY Çaprazları', symbols: ['USDTRY=X', 'EURTRY=X', 'GBPTRY=X'] }
                }
            }
        }
    }
};
