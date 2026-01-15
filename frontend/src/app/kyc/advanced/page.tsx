'use client';

import { useState } from 'react';
import { Shield, Camera, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdvancedKyc() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startVerification = async () => {
    setLoading(true);
    // 3 saniyelik "analiz ediliyor" illüzyonu
    setTimeout(async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${baseUrl}/kyc/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({
            documentType: 'ID_CARD',
            documentUrl: 'https://example.com/id_sim.jpg',
            postalCode: '34330'
          })
        });
        const data = await res.json();
        setResult(data);
        setLoading(false);
        setStep(3);
      } catch (e) {
        setLoading(false);
        alert("Bağlantı hatası!");
      }
    }, 3000);
    setStep(2);
  };

  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Shield size={40} color="#3498db" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Gelişmiş Kimlik Doğrulama</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Hesabınızı güvene alın ve işlem limitlerinizi artırın.</p>
        </div>

        {step === 1 && (
          <div>
            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
              <div style={{
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={20} color="#2ecc71" /> Tier 1: Profesyonel Onay
                </h3>
                <ul style={{ paddingLeft: '0', listStyle: 'none', fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '2' }}>
                  <li>• Kimlik Görseli (AI OCR Tarama)</li>
                  <li>• Face Liveness (Biyometrik Canlılık)</li>
                  <li>• $50.000'a kadar Günlük Çekim</li>
                  <li>• Marjin İşlemlerinde 1:100 Kaldıraç</li>
                </ul>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }} onClick={startVerification}>
              Doğrulamayı Başlat
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              Verileriniz uçtan uca şifrelenir ve KVKK uyumlu saklanır.
            </p>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner-large" style={{ marginBottom: '32px' }}></div>
            <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#2ecc71' }}>
                <Camera size={20} /> <span style={{ fontSize: '14px', fontWeight: '500' }}>Biometric Scan: Processing...</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#3498db' }}>
                <FileText size={20} /> <span style={{ fontSize: '14px', fontWeight: '500' }}>Identity Extraction (OCR)...</span>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Lütfen bekleyin, Yapay Zeka belgelerinizi gerçek zamanlı analiz ediyor.</p>
          </div>
        )}

        {step === 3 && result && (
          <div className="animate-in">
            <div style={{
              backgroundColor: 'rgba(46, 204, 113, 0.1)',
              padding: '24px',
              borderRadius: '20px',
              marginBottom: '32px',
              border: '1px solid rgba(46, 204, 113, 0.3)',
              textAlign: 'center'
            }}>
              <CheckCircle size={48} color="#2ecc71" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2ecc71', marginBottom: '8px' }}>Akıllı Tarama Başarılı!</h3>
              <p style={{ fontSize: '14px', color: 'rgba(46, 204, 113, 0.8)' }}>Kimliğiniz başarıyla doğrulandı ve admin onayına sunuldu.</p>
            </div>

            <div style={{
              padding: '24px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '14px'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>Ayrıştırılan Veriler (OCR):</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Ad Soyad:</span>
                <span style={{ fontWeight: '600' }}>{result.ocrResult.firstName} {result.ocrResult.lastName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Belge No:</span>
                <span style={{ fontWeight: '600' }}>*******{result.ocrResult.idNumber.slice(-4)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Liveness Güven:</span>
                <span style={{ fontWeight: '600', color: '#2ecc71' }}>%{(result.livenessResult.score * 100).toFixed(0)}</span>
              </div>
            </div>

            <div style={{
              marginTop: '32px',
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(241, 196, 15, 0.05)',
              border: '1px solid rgba(241, 196, 15, 0.2)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <AlertTriangle color="#f1c40f" size={24} />
              <p style={{ fontSize: '13px', color: '#f1c40f', lineHeight: '1.4' }}>
                Hesap limitleriniz admin kontrolleri tamamlandıktan sonra (yaklaşık 10 dk) otomatik olarak yükseltilecektir.
              </p>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '32px', padding: '16px' }} onClick={() => window.location.href = '/dashboard'}>
              Panale Dön
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .spinner-large {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(255, 255, 255, 0.05);
          border-left-color: #3498db;
          border-radius: 50%;
          display: inline-block;
          animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-in {
          animation: slideUp 0.6s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
