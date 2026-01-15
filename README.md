# 🐉 Hybrid Sentinel - Kurulum ve Çalıştırma Kılavuzu

Bu platform, 15 Fazlık devasa bir finansal teknoloji ekosistemidir. Aşağıdaki adımları takip ederek sistemi kendi bilgisayarınızda eksiksiz bir şekilde çalıştırabilirsiniz.

## 📋 Gereksinimler
- **Node.js**: v18 veya üzeri
- **npm / npx**: Paket yönetimi için
- **SQLite**: (Dahili olarak gelir, ek kurulum gerekmez)

## 🚀 Hızlı Başlangıç

### 1. Backend Kurulumu
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```
*Backend varsayılan olarak `http://localhost:3001` adresinde çalışacaktır.*

### 2. Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```
*Frontend varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.*

## 💎 Önemli Modüller ve Erişim
- **Dashboard**: `http://localhost:3000/dashboard`
- **Tanrı Modu (Singularity)**: `http://localhost:3000/admin/singularity`
- **Cüzdan & Ledger**: `http://localhost:3000/wallet`
- **KYC Merkezi**: `http://localhost:3000/kyc/tiers`

## ⚡ Gelişmiş Özelliklerin Test Edilmesi
Sistem; Web3, AI Tahmini, Kuantum Güvenliği ve Galaktik İstihbarat servislerini simüle eder. Gerçek API anahtarlarını eklemek için `backend/.env` dosyasını yapılandırabilirsiniz.

---
**Hybrid Sentinel - Geleceğin Finansal İşletim Sistemi**
🐉🌌👑🏛️🌐⚡📊📱🛡️✅🍏
