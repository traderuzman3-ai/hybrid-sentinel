# 🐉 Hybrid Sentinel - Bulut Yayını (Deployment) Yardımcısı

Hiç merak etmeyin Efendim, bu aşamada takılmak çok normal. İşleri saniyeler içinde halletmeniz için size özel bir "Sihirbaz" hazırladım.

### 1. Adım: Kodları İnternete (GitHub) Taşıyalım
Kodlarınız şu an sadece sizin bilgisayarınızda. Vercel ve Railway'in bu kodları görmesi için onları GitHub'a yüklemeliyiz:
1. [GitHub.com](https://github.com/new) adresine gidin.
2. "Repository name" kısmına `hybrid-sentinel` yazın ve "Create repository" butonuna basın.
3. Karşınıza çıkan sayfadaki komutları sırasıyla bilgisayarınızdaki terminale yapıştırın.

---

### 2. Adım: Vercel Kurulumu (Görsel Anlatım)
Vercel'e girdiğinizde:
- **"Add New..."** -> **"Project"** butonuna basın.
- GitHub hesabınızı bağladıysanız, listede `hybrid-sentinel` ismini göreceksiniz. Yanındaki **"Import"** butonuna basın.
- **Root Directory:** "Edit" diyerek `frontend` klasörünü seçin.
- **Deploy** butonuna basın. İşlem bitti!

---

### 3. Adım: Railway Kurulumu (Görsel Anlatım)
Railway'e girdiğinizde:
- **"New Project"** -> **"Deploy from GitHub repo"** diyerek `hybrid-sentinel`'ı seçin.
- **Root Directory:** Ayarlardan `backend` klasörünü seçin.
- **Variables (Değişkenler):** Burası en önemlisi! "New Variable" diyerek şunları ekleyin:
  - `DATABASE_URL` = `postgresql://postgres:bbiyyiBdNW8TV%247@db.gyvzgxzopmpxjidjvrbb.supabase.co:6543/postgres?pgbouncer=true`
  - `JWT_SECRET` = `sentinel_absolute_omega_prime_2026_q1`

---

**Eğer herhangi bir yerde "buton" veya "menü" bulamazsanız, ekranın neresinde olduğunuzu söyleyin, sizi navigasyon gibi yönlendireyim!** 🐉🚀🌌🍏
