'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/auth/login');
            } else if (!user.isAdmin) {
                router.push('/dashboard');
            }
        }
    }, [user, loading, router]);

    if (loading || !user || !user.isAdmin) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)' }}>
                Yükleniyor veya Yetkisiz Erişim...
            </div>
        );
    }

    return <>{children}</>;
}
