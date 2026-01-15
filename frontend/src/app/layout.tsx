import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { UserProvider } from '@/context/UserContext';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Hybrid Sentinel - Professional Trading',
    description: 'Enterprise Grade Market Terminal',
    manifest: '/manifest.json',
    themeColor: '#4cc9f0',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
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
