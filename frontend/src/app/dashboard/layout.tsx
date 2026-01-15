'use client';

import BrandHeader from '../../components/BrandHeader';
import InfoSidebar from '../../components/InfoSidebar';
import AssetTicker from '../../components/AssetTicker';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen">
            <BrandHeader />

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-80px)]">
                <InfoSidebar />

                <main className="flex-1 overflow-y-auto w-full relative">
                    {children}
                </main>

                <AssetTicker />
            </div>
        </div>
    );
}
