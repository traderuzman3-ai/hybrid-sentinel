'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
    user: any;
    balance: number;
    loading: boolean;
    refreshUserData: () => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const refreshUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setBalance(0);
            setLoading(false);
            return;
        }

        try {
            // Get Profile (Use Proxy)
            const profileRes = await fetch('/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setUser(profileData.user || profileData);
            } else {
                logout();
                return;
            }

            // Get Balance (Use Proxy)
            const ledgerRes = await fetch('/api/ledger/wallets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (ledgerRes.ok) {
                const ledgerData = await ledgerRes.json();
                // TRY cüzdanını bul
                const tryWallet = ledgerData.wallets?.find((w: any) => w.currency === 'TRY');
                setBalance(tryWallet ? parseFloat(tryWallet.balance) : 0);
            }
        } catch (error) {
            console.error('User data refresh failed', error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setBalance(0);
        window.location.href = '/auth/login';
    };

    useEffect(() => {
        refreshUserData();
    }, []);

    return (
        <UserContext.Provider value={{ user, balance, loading, refreshUserData, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
