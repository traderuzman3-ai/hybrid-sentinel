'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import {
    Settings, User, Shield, Bell, Eye, EyeOff, Key, Smartphone,
    Check, ChevronRight, AlertTriangle, Mail, Lock, Save
} from 'lucide-react';

export default function SettingsPage() {
    const { user, refreshUserData } = useUser();
    const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'notifications'>('profile');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Profile form
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    // Security
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Notifications
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [priceAlerts, setPriceAlerts] = useState(true);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [marketNews, setMarketNews] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        setSaving(true);
        setMessage(null);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ firstName, lastName })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profil bilgileriniz güncellendi!' });
                refreshUserData();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Güncelleme başarısız.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Bağlantı hatası.' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalı.' });
            return;
        }

        setSaving(true);
        setMessage(null);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi!' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Şifre değiştirme başarısız.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Bağlantı hatası.' });
        } finally {
            setSaving(false);
        }
    };

    const menuItems = [
        { key: 'profile', label: 'Profil Bilgileri', icon: User },
        { key: 'security', label: 'Güvenlik', icon: Shield },
        { key: 'notifications', label: 'Bildirimler', icon: Bell }
    ];

    return (
        <div className="min-h-screen bg-bg-app p-4 lg:p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-primary-navy">Ayarlar</h1>
                    <p className="text-sm text-text-secondary">Hesap ayarlarınızı yönetin.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sol Menü */}
                    <div className="lg:col-span-1">
                        <div className="card-matte p-2">
                            {menuItems.map(item => (
                                <button
                                    key={item.key}
                                    onClick={() => setActiveSection(item.key as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeSection === item.key
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-text-secondary hover:bg-gray-50'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                    <ChevronRight size={16} className="ml-auto opacity-50" />
                                </button>
                            ))}
                        </div>

                        {/* Hesap Durumu */}
                        <div className="card-matte p-4 mt-4">
                            <div className="text-xs text-text-muted mb-2">HESAP DURUMU</div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`w-2 h-2 rounded-full ${user?.isEmailVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <span className="text-sm">E-posta {user?.isEmailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`w-2 h-2 rounded-full ${user?.kycStatus === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <span className="text-sm">KYC {user?.kycStatus === 'APPROVED' ? 'Onaylı' : 'Beklemede'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${user?.isTwoFAEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                <span className="text-sm">2FA {user?.isTwoFAEnabled ? 'Aktif' : 'Pasif'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sağ İçerik */}
                    <div className="lg:col-span-3">
                        <div className="card-matte p-6">
                            {/* Profil */}
                            {activeSection === 'profile' && (
                                <div>
                                    <h2 className="text-lg font-bold text-primary-navy mb-6 flex items-center gap-2">
                                        <User size={20} /> Profil Bilgileri
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-text-secondary block mb-2">Ad</label>
                                                <input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full px-4 py-3 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-text-secondary block mb-2">Soyad</label>
                                                <input
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="w-full px-4 py-3 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-text-secondary block mb-2">E-posta</label>
                                            <input
                                                type="email"
                                                value={email}
                                                disabled
                                                className="w-full px-4 py-3 border border-border-subtle rounded-lg bg-gray-50 text-text-muted cursor-not-allowed"
                                            />
                                            <p className="text-xs text-text-muted mt-1">E-posta adresi değiştirilemez.</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-text-secondary block mb-2">Hesap Tipi</label>
                                            <div className="px-4 py-3 border border-border-subtle rounded-lg bg-gray-50">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${user?.accountType === 'REAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {user?.accountType === 'REAL' ? 'Gerçek Hesap' : 'Demo Hesap'}
                                                </span>
                                            </div>
                                        </div>

                                        {message && activeSection === 'profile' && (
                                            <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-danger'}`}>
                                                {message.text}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleProfileUpdate}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-navy disabled:opacity-50"
                                        >
                                            <Save size={18} />
                                            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Güvenlik */}
                            {activeSection === 'security' && (
                                <div>
                                    <h2 className="text-lg font-bold text-primary-navy mb-6 flex items-center gap-2">
                                        <Shield size={20} /> Güvenlik Ayarları
                                    </h2>

                                    {/* Şifre Değiştirme */}
                                    <div className="mb-8">
                                        <h3 className="font-medium text-primary-navy mb-4 flex items-center gap-2">
                                            <Key size={16} /> Şifre Değiştir
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-text-secondary block mb-2">Mevcut Şifre</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        className="w-full px-4 py-3 pr-12 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-text-secondary block mb-2">Yeni Şifre</label>
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full px-4 py-3 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-text-secondary block mb-2">Yeni Şifre (Tekrar)</label>
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full px-4 py-3 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={handlePasswordChange}
                                                disabled={saving || !currentPassword || !newPassword}
                                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-navy disabled:opacity-50"
                                            >
                                                <Lock size={18} />
                                                Şifreyi Değiştir
                                            </button>
                                        </div>
                                    </div>

                                    {/* 2FA */}
                                    <div className="border-t border-border-subtle pt-6">
                                        <h3 className="font-medium text-primary-navy mb-4 flex items-center gap-2">
                                            <Smartphone size={16} /> İki Faktörlü Doğrulama (2FA)
                                        </h3>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-medium">Google Authenticator</div>
                                                <div className="text-sm text-text-muted">Hesabınızı ekstra koruma altına alın.</div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${user?.isTwoFAEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                                                {user?.isTwoFAEnabled ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </div>
                                        {!user?.isTwoFAEnabled && (
                                            <button className="mt-3 flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5">
                                                <Shield size={16} /> 2FA Aktifleştir
                                            </button>
                                        )}
                                    </div>

                                    {message && activeSection === 'security' && (
                                        <div className={`mt-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-danger'}`}>
                                            {message.text}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Bildirimler */}
                            {activeSection === 'notifications' && (
                                <div>
                                    <h2 className="text-lg font-bold text-primary-navy mb-6 flex items-center gap-2">
                                        <Bell size={20} /> Bildirim Tercihleri
                                    </h2>

                                    <div className="space-y-4">
                                        {[
                                            { key: 'emailNotifications', label: 'E-posta Bildirimleri', desc: 'Önemli hesap güncellemeleri', value: emailNotifications, setter: setEmailNotifications },
                                            { key: 'priceAlerts', label: 'Fiyat Alarmları', desc: 'Belirlediğiniz fiyat seviyelerinde uyarı', value: priceAlerts, setter: setPriceAlerts },
                                            { key: 'orderUpdates', label: 'Emir Güncellemeleri', desc: 'Emirlerinizin durumu hakkında bildirimler', value: orderUpdates, setter: setOrderUpdates },
                                            { key: 'marketNews', label: 'Piyasa Haberleri', desc: 'Günlük piyasa özeti ve haberler', value: marketNews, setter: setMarketNews }
                                        ].map(item => (
                                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <div className="font-medium">{item.label}</div>
                                                    <div className="text-sm text-text-muted">{item.desc}</div>
                                                </div>
                                                <button
                                                    onClick={() => item.setter(!item.value)}
                                                    className={`w-12 h-6 rounded-full relative transition-colors ${item.value ? 'bg-primary' : 'bg-gray-300'}`}
                                                >
                                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${item.value ? 'left-7' : 'left-1'}`}></span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-navy">
                                        <Save size={18} />
                                        Tercihleri Kaydet
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
