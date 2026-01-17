'use client';

import { useState, useEffect } from 'react';

export function useDeviceType() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            // Hem ekran genişliğine hem de User Agent'a bakar
            const widthCheck = window.innerWidth < 1024;
            const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            setIsMobile(widthCheck || userAgentCheck);
        };

        // İlk açılışta kontrol et
        checkDevice();

        // Ekran boyutu değişirse tekrar kontrol et
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    return { isMobile, isDesktop: !isMobile };
}
