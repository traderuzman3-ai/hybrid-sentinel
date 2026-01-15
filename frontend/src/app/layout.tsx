import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { UserProvider } from '../context/UserContext';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Hybrid Sentinel - Professional Trading',
    description: 'Enterprise Grade Market Terminal',
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: '#4cc9f0',
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
            <body className={inter.className}>
                <UserProvider>
                    <Navbar />
                    <main style={{ paddingTop: '80px' }}>
                        {children}
                    </main>
                    <MobileNav />
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
