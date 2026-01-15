'use client';

import Link from 'next/link';

export default function BrandHeader() {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container-custom mx-auto h-20 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 no-underline">
                        <div className="bg-primary-navy text-white px-3 py-2 rounded-md font-bold text-xl tracking-wider">
                            LOGO
                        </div>
                        <div className="h-8 w-[1px] bg-gray-300 mx-2"></div>
                        <span className="text-text-secondary font-medium tracking-tight">
                            Güvenilir Finansal Çözümler
                        </span>
                    </Link>
                </div>

                {/* Optional Top Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="btn-tactile text-sm">
                        Oturum Aç
                    </button>
                </div>
            </div>
        </header>
    );
}
