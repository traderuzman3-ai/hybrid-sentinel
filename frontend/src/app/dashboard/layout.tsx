'use client';

import InfoSidebar from '../../components/InfoSidebar';
import NewsTicker from '@/components/NewsTicker';
import BrandHeader from '../../components/BrandHeader';
import AIAssistant from '@/components/AIAssistant';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-background text-text-primary overflow-hidden flex-col">
            <BrandHeader />
            <div className="flex flex-1 overflow-hidden relative">
                <InfoSidebar />
                <main className="flex-1 overflow-auto pb-8 relative w-full">
                    {children}
                    <NewsTicker />
                    <AIAssistant />
                </main>
            </div>
        </div>
    )
}
