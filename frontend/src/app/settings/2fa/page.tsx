'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function TwoFASetup() {
  const [step, setStep] = useState(1);
  const [qrData, setQrData] = useState<any>(null);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const startSetup = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/auth/2fa/setup`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    const data = await res.json();
    setQrData(data);
    setStep(2);
  };

  const handleEnable = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/auth/2fa/enable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ token, secret: qrData.secret })
    });
    const data = await res.json();
    if (data.success) {
      setMessage({ type: 'success', text: '2FA Başarıyla Aktif Edildi!' });
      setStep(3);
    } else {
      setMessage({ type: 'danger', text: data.error || 'Geçersiz kod.' });
    }
  };

  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      <div className="card" style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '24px' }}>🛡️ 2FA Güvenlik Ayarı</h2>

        {step === 1 && (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
              Hesabınızı Google Authenticator ile koruyun. Giriş yaparken ekstra bir güvenlik kodu gerekecektir.
              Bu, hesabınızın ele geçirilme riskini %99 oranında azaltır.
            </p>
            <button className="btn btn-primary" onClick={startSetup}>Kuruluma Başla</button>
          </div>
        )}

        {step === 2 && qrData && (
          <div>
            <p style={{ fontSize: '14px', marginBottom: '20px', color: 'var(--text-secondary)' }}>
              Google Authenticator uygulamasını açın ve bu QR kodu taratın:
            </p>
            <div style={{ padding: '20px', backgroundColor: 'white', display: 'inline-block', borderRadius: '12px', marginBottom: '24px' }}>
              <QRCodeSVG value={`otpauth://totp/TradingPlatform?secret=${qrData.secret}&issuer=TradingPlatform`} size={200} />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>6 Haneli Doğrulama Kodu</label>
              <input
                className="input"
                placeholder="000000"
                maxLength={6}
                value={token}
                onChange={e => setToken(e.target.value)}
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
              />
            </div>

            {message.text && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: message.type === 'success' ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {message.text}
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }} onClick={handleEnable}>Aktif Et</button>
          </div>
        )}

        {step === 3 && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px', color: 'var(--success)' }}>✅</div>
            <h3 style={{ marginBottom: '16px' }}>Harika!</h3>
            <p style={{ marginBottom: '32px', color: 'var(--text-secondary)' }}>
              2FA koruması başarıyla aktif edildi. Bir sonraki girişinizde uygulama kodunuz sorulacaktır.
            </p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/dashboard'}>Panele Dön</button>
          </div>
        )}
      </div>
    </div>
  );
}
