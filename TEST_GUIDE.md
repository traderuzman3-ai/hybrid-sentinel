# 🧪 Test Rehberi - Adım Adım

## Durum: ✅ Bağımlılıklar Yüklendi

- Backend: 111 paket ✅
- Frontend: 308 paket ✅

---

## 📝 Test Adımları

### Adım 1: PostgreSQL Kontrolü

PostgreSQL kurulu mu kontrol ediyoruz...

**Eğer kurulu DEĞİLSE:**
1. [PostgreSQL İndir](https://www.postgresql.org/download/windows/)
2. Kurulum sırasında şifre belirleyin (örn: `postgres`)
3. Port: 5432 (varsayılan)

**Eğer kurulu İSE:**
Devam ediyoruz! ✅

---

### Adım 2: Veritabanı Oluşturma

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanı oluştur
CREATE DATABASE trading_platform;

# Çıkış
\q
```

---

### Adım 3: Backend .env Dosyasını Kontrol Et

Dosya: `backend/.env`

```env
PORT=3001
DATABASE_URL="postgresql://postgres:ŞIFRENIZ@localhost:5432/trading_platform?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
```

**ÖNEMLİ:** `ŞIFRENIZ` kısmını PostgreSQL şifrenizle değiştirin!

---

### Adım 4: Prisma Migration (Veritabanı Tablolarını Oluştur)

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

**Beklenen Çıktı:**
```
✔ Generated Prisma Client
✔ Database migration completed
```

---

### Adım 5: Backend'i Başlat

```bash
# Hala backend klasöründeyken
npm run dev
```

**Beklenen Çıktı:**
```
🚀 Backend server running on http://localhost:3001
```

**Test Et:**
Tarayıcıda `http://localhost:3001/health` adresine git.
Şunu görmelisin:
```json
{"status":"ok","timestamp":"..."}
```

---

### Adım 6: Frontend'i Başlat (Yeni Terminal)

```bash
cd frontend
npm run dev
```

**Beklenen Çıktı:**
```
- Local: http://localhost:3000
```

---

### Adım 7: Manuel Test

1. **Ana Sayfa:** `http://localhost:3000`
   - "Giriş Yap" ve "Kayıt Ol" butonlarını görmelisin

2. **Kayıt Ol:** `http://localhost:3000/auth/register`
   - Email: `test@test.com`
   - Şifre: `123456`
   - Formu doldur ve gönder

3. **Giriş Yap:** `http://localhost:3000/auth/login`
   - Kayıt olduğun bilgilerle giriş yap
   - Başarılı olursa Dashboard'a yönlendirileceksin

4. **Dashboard:** `http://localhost:3000/dashboard`
   - "Hoş Geldiniz! 🚀" mesajını görmelisin

---

## ✅ Başarı Kriterleri

- [ ] Backend çalışıyor (port 3001)
- [ ] Frontend çalışıyor (port 3000)
- [ ] Kayıt işlemi başarılı
- [ ] Giriş işlemi başarılı
- [ ] Dashboard'a erişim sağlandı
- [ ] Token localStorage'a kaydedildi

---

## 🐛 Olası Hatalar ve Çözümler

### Hata: "Cannot connect to database"
**Çözüm:** 
- PostgreSQL servisinin çalıştığından emin ol
- `.env` dosyasındaki şifreyi kontrol et

### Hata: "Port 3001 already in use"
**Çözüm:**
- Başka bir uygulama portu kullanıyor
- `.env` dosyasında PORT'u değiştir (örn: 3002)

### Hata: "Module not found"
**Çözüm:**
```bash
# Backend için
cd backend
npm install

# Frontend için
cd frontend
npm install
```

---

## 🎯 Sonraki Adım

Test başarılıysa, **Faz 2**'ye geçebiliriz:
- Piyasa verisi entegrasyonu
- Grafik sistemi
- Emir motoru
