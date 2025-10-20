# 🚀 GITHUB VE VERCEL DEPLOY KOMUTU

## 1️⃣ GITHUB'A YENİ REPO OLUŞTUR

### Web'den (Önerilen):
1. https://github.com/new adresine git
2. Repository name: `kemer-residence` (veya istediğin isim)
3. Description: `Hotel website with Next.js 15, Prisma, Multi-language & SEO optimized`
4. **Private** veya Public seç
5. **Initialize this repository** seçeneklerini IŞARETLEME (zaten commit var)
6. "Create repository" butonuna bas

### Sonra terminal'de:
```bash
cd /Users/isikkiciman/kemer-residence

# GitHub remote ekle (HTTPS)
git remote add origin https://github.com/SENIN-USERNAME/kemer-residence.git

# Veya SSH ile
# git remote add origin git@github.com:SENIN-USERNAME/kemer-residence.git

# Push yap:
git branch -M main
git push -u origin main
```

---

## 2️⃣ VERCEL'E DEPLOY

### A) Vercel Dashboard ile (En Kolay):

1. **Vercel'e Git:** https://vercel.com/signup
2. **GitHub ile Login:** "Continue with GitHub" butonuna tıkla
3. **Import Project:** 
   - "Add New" → "Project"
   - GitHub repo'nu seç: `kemer-residence`
   - "Import" butonuna bas

4. **Environment Variables Ekle:**
   ```
   DATABASE_URL = dosya yolu yerine Vercel Postgres kullanacağız (sonraki adım)
   ```

5. **Deploy:** "Deploy" butonuna bas (2-3 dakika sürer)

6. **Vercel Postgres Ekle:**
   - Dashboard → Storage → Create Database
   - "Postgres" seç → Create
   - `DATABASE_URL` otomatik eklenecek
   - "Redeploy" yap

---

### B) Vercel CLI ile (Hızlı):

```bash
# 1. Vercel CLI kur (tek seferlik)
npm i -g vercel

# 2. Login ol
vercel login

# 3. Deploy et
cd /Users/isikkiciman/kemer-residence
vercel

# İlk deploy (preview):
# Sorular gelecek:
# - Set up and deploy? → Y
# - Which scope? → Kendi hesabını seç
# - Link to existing project? → N
# - Project name? → kemer-residence
# - Directory? → ./ (Enter bas)

# 4. Production deploy
vercel --prod
```

---

## 3️⃣ VERCEL POSTGRES KURULUM

Deploy sonrası database eklemek için:

```bash
# Vercel Dashboard'dan:
# 1. Project → Storage → Create → Postgres
# 2. Database ismi: kemer-residence-db
# 3. Region: ams1 (Amsterdam - Türkiye'ye yakın)
# 4. Create

# DATABASE_URL otomatik environment variables'a eklenir
# Redeploy gerekir
```

---

## 4️⃣ PRİSMA MİGRATION ÇALIŞTIR

Database oluştuktan sonra:

```bash
# 1. .env dosyasını Vercel'den çek
vercel env pull .env.production.local

# 2. Production'da migration çalıştır (tek seferlik)
npx prisma migrate deploy

# 3. Seed data ekle (opsiyonel)
npx prisma db seed
```

---

## 5️⃣ GODADDY DOMAIN BAĞLA

Vercel deploy sonrası:

### Vercel Dashboard'da:
1. Project Settings → Domains
2. "Add Domain" → `www.ornekdomain.com` yaz
3. Vercel size DNS kayıtları verecek:
   ```
   A Record: 76.76.21.21
   CNAME: cname.vercel-dns.com
   ```

### GoDaddy'de:
1. My Products → Domains → Manage
2. DNS → DNS Records
3. Mevcut A ve CNAME kayıtlarını sil
4. Yeni ekle:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 600 seconds

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 600 seconds
   ```
5. Save
6. **24 saat içinde** SSL aktif olur

---

## 6️⃣ DEPLOY SONRASI KONTROL

```bash
# Site çalışıyor mu?
curl https://your-site.vercel.app

# Sitemap var mı?
curl https://your-site.vercel.app/sitemap.xml

# robots.txt var mı?
curl https://your-site.vercel.app/robots.txt
```

---

## 🎯 HIZLI ÖZET

```bash
# 1. GitHub'da repo oluştur (web'den)

# 2. Remote ekle ve push
git remote add origin https://github.com/USERNAME/kemer-residence.git
git push -u origin main

# 3. Vercel'e git ve Import Project
# https://vercel.com/new

# 4. Vercel Postgres ekle
# Dashboard → Storage → Create

# 5. Domain bağla (GoDaddy DNS ayarları)

# BITTI! 🚀
```

---

## 📞 SONRAKI ADIMLAR

1. **Google Search Console:** Domain ekle
2. **OG Images:** 8 adet görsel yükle
3. **Analytics:** Google Analytics 4 kur
4. **Test:** Lighthouse SEO score kontrol

---

**Sorularınız için hazırım! 🎉**
