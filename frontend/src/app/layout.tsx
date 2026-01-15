import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import { UserProvider } from '../context/UserContext';
import { MarketProvider } from '../context/MarketContext';
import BrandHeader from '../components/BrandHeader';
import InfoSidebar from '../components/InfoSidebar';
import AssetTicker from '../components/AssetTicker';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
    title: 'Hybrid Sentinel - Professional Trading',
    description: 'Enterprise Grade Market Terminal',
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: '#ffffff',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased text-text-primary bg-bg-primary`}>
                <UserProvider>
                    <MarketProvider>
                        {children}
                    </MarketProvider>
                </UserProvider>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    if ('serviceWorker' in navigator) {
                        window.addEventListener('load', function() {
                            navigator.serviceWorker.register('/sw.js');
                        });
                    }
                `}} />
            </body>
        </html>
    );
}
