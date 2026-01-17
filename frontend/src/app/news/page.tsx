'use client';

import { useState, useEffect } from 'react';
import {
    Newspaper, TrendingUp, TrendingDown, Clock, ExternalLink,
    Building2, AlertCircle, Filter, Search, RefreshCw
} from 'lucide-react';

interface NewsItem {
    id: string;
    title: string;
    summary: string;
    source: string;
    symbol?: string;
    publishedAt: string;
    url?: string;
    type: 'news' | 'kap';
    sentiment?: 'positive' | 'negative' | 'neutral';
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'news' | 'kap'>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        // Simüle edilmiş haber verisi
        const mockNews: NewsItem[] = [
            {
                id: '1',
                title: 'BIST 100 Endeksi Güne Yükselişle Başladı',
                summary: 'Borsa İstanbul\'da BIST 100 endeksi, güne yüzde 0.85 artışla 9.850 puan seviyesinden başladı. Bankacılık sektörü öncülük ediyor.',
                source: 'Bloomberg HT',
                publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                type: 'news',
                sentiment: 'positive'
            },
            {
                id: '2',
                title: 'ASELS - Önemli Gelişme Bildirimi',
                summary: 'ASELSAN, Savunma Sanayii Başkanlığı ile 2.5 milyar TL tutarında yeni bir sözleşme imzaladı.',
                source: 'KAP',
                symbol: 'ASELS.IS',
                publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                type: 'kap',
                sentiment: 'positive'
            },
            {
                id: '3',
                title: 'Merkez Bankası Faiz Kararı Açıklandı',
                summary: 'TCMB, politika faizini 50 baz puan artırarak yüzde 45\'e yükseltti. Piyasalar karışık seyrediyor.',
                source: 'Reuters',
                publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
                type: 'news',
                sentiment: 'neutral'
            },
            {
                id: '4',
                title: 'THYAO - Yolcu Sayısı Açıklaması',
                summary: 'Türk Hava Yolları, Aralık ayında 7.2 milyon yolcu taşıdığını açıkladı. Geçen yılın aynı dönemine göre %15 artış.',
                source: 'KAP',
                symbol: 'THYAO.IS',
                publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
                type: 'kap',
                sentiment: 'positive'
            },
            {
                id: '5',
                title: 'Dolar/TL 35 Seviyesini Test Etti',
                summary: 'Amerikan doları, TL karşısında 35 seviyesini test etti. Piyasa uzmanları temkinli yaklaşıyor.',
                source: 'Ekonomi Servisi',
                publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
                type: 'news',
                sentiment: 'negative'
            },
            {
                id: '6',
                title: 'GARAN - Sermaye Artırımı Kararı',
                summary: 'Garanti BBVA, bedelli sermaye artırımı kararı aldı. Artırım oranı %25 olarak belirlendi.',
                source: 'KAP',
                symbol: 'GARAN.IS',
                publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
                type: 'kap',
                sentiment: 'neutral'
            },
            {
                id: '7',
                title: 'Altın Fiyatları Rekor Kırdı',
                summary: 'Gram altın 2.950 TL ile tüm zamanların en yüksek seviyesine ulaştı.',
                source: 'Habertürk',
                publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
                type: 'news',
                sentiment: 'positive'
            },
            {
                id: '8',
                title: 'EREGL - Finansal Sonuçlar',
                summary: 'Erdemir, 2025 yılı 3. çeyrek finansal sonuçlarını açıkladı. Net kar beklentilerin üzerinde geldi.',
                source: 'KAP',
                symbol: 'EREGL.IS',
                publishedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
                type: 'kap',
                sentiment: 'positive'
            }
        ];

        setTimeout(() => {
            setNews(mockNews);
            setLoading(false);
        }, 500);
    };

    const getTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes} dk önce`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} saat önce`;
        return `${Math.floor(hours / 24)} gün önce`;
    };

    const getSentimentIcon = (sentiment?: string) => {
        if (sentiment === 'positive') return <TrendingUp size={16} className="text-emerald-500" />;
        if (sentiment === 'negative') return <TrendingDown size={16} className="text-danger" />;
        return null;
    };

    const filteredNews = news.filter(item => {
        const matchesFilter = filter === 'all' || item.type === filter;
        const matchesSearch = !search ||
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.summary.toLowerCase().includes(search.toLowerCase()) ||
            (item.symbol && item.symbol.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const kapCount = news.filter(n => n.type === 'kap').length;
    const newsCount = news.filter(n => n.type === 'news').length;

    return (
        <div className="min-h-screen bg-bg-app p-4 lg:p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-primary-navy">Haberler & KAP</h1>
                        <p className="text-sm text-text-secondary">Piyasa haberleri ve şirket duyurularını takip edin.</p>
                    </div>
                    <button
                        onClick={fetchNews}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-border-subtle rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                        <RefreshCw size={16} /> Yenile
                    </button>
                </div>

                {/* İstatistik */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="card-matte p-4 text-center">
                        <div className="text-2xl font-bold text-primary-navy">{news.length}</div>
                        <div className="text-xs text-text-muted">Toplam</div>
                    </div>
                    <div className="card-matte p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{newsCount}</div>
                        <div className="text-xs text-text-muted">Haber</div>
                    </div>
                    <div className="card-matte p-4 text-center">
                        <div className="text-2xl font-bold text-amber-600">{kapCount}</div>
                        <div className="text-xs text-text-muted">KAP Bildirimi</div>
                    </div>
                </div>

                {/* Arama ve Filtre */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Haber veya sembol ara..."
                            className="w-full pl-12 pr-4 py-3 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex gap-2">
                        {[
                            { key: 'all', label: 'Tümü' },
                            { key: 'news', label: 'Haberler' },
                            { key: 'kap', label: 'KAP' }
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.key
                                        ? 'bg-primary text-white'
                                        : 'bg-white border border-border-subtle text-text-secondary hover:bg-gray-50'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Haber Listesi */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="card-matte p-12 text-center">
                            <RefreshCw size={32} className="mx-auto text-primary animate-spin mb-4" />
                            <p className="text-text-secondary">Haberler yükleniyor...</p>
                        </div>
                    ) : filteredNews.length > 0 ? (
                        filteredNews.map(item => (
                            <div key={item.id} className="card-matte p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    {/* İkon */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'kap' ? 'bg-amber-100' : 'bg-blue-100'
                                        }`}>
                                        {item.type === 'kap' ?
                                            <Building2 size={20} className="text-amber-600" /> :
                                            <Newspaper size={20} className="text-blue-600" />
                                        }
                                    </div>

                                    {/* İçerik */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className="font-bold text-primary-navy">{item.title}</h3>
                                            {getSentimentIcon(item.sentiment)}
                                        </div>
                                        <p className="text-sm text-text-secondary line-clamp-2 mb-2">{item.summary}</p>
                                        <div className="flex items-center gap-3 text-xs text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} /> {getTimeAgo(item.publishedAt)}
                                            </span>
                                            <span>{item.source}</span>
                                            {item.symbol && (
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded font-medium">
                                                    {item.symbol.replace('.IS', '')}
                                                </span>
                                            )}
                                            {item.type === 'kap' && (
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                                                    KAP
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Link */}
                                    {item.url && (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-text-muted hover:text-primary hover:bg-gray-100 rounded-lg"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card-matte p-12 text-center">
                            <Newspaper size={48} className="mx-auto text-text-muted opacity-30 mb-4" />
                            <p className="text-text-secondary">Aradığınız kriterlere uygun haber bulunamadı.</p>
                        </div>
                    )}
                </div>

                {/* Alt Bilgi */}
                <div className="mt-6 text-center text-xs text-text-muted">
                    <p>Haberler bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir.</p>
                </div>
            </div>
        </div>
    );
}
