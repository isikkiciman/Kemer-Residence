# 🚀 DEPLOY KONTROL LİSTESİ

## Önemli Dosyalar

### ✅ 1. .env.local (GİZLİ - Git'e eklemeyin!)
```bash
# .env.local
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="https://www.sizdomain.com"
```

### ✅ 2. .gitignore (Kontrol edin)
```
# Database
*.db
*.db-journal
prisma/dev.db

# Environment
.env
.env*.local

# Uploads
/public/uploads/*
```

### ✅ 3. Prisma Production Setup

**Vercel'de SQLite yerine PostgreSQL kullanın (önerilir):**

#### Option A: Vercel Postgres (Ücretsiz)
```bash
# Vercel Dashboard → Storage → Create → Postgres
# Otomatik DATABASE_URL verir

# Sonra Prisma schema'yı güncelle:
datasource db {
  provider = "postgresql"  // sqlite yerine
  url      = env("DATABASE_URL")
}

# Migration çalıştır:
npx prisma migrate deploy
npx prisma generate
```

#### Option B: SQLite Devam (Geçici)
```bash
# Build sonrası database silinir, demo için uygundur
# Production için önerilmez
```

---

## 🔧 Package.json Scripts (Kontrol)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  }
}
```

---

## 🌐 Vercel Ortam Değişkenleri

Deploy sonrası Vercel Dashboard'da ekle:

```
DATABASE_URL = postgresql://...  (Vercel Postgres connection string)
NEXT_PUBLIC_SITE_URL = https://www.ornekdomain.com
NODE_ENV = production
```

---

## 📊 Build Komutu Testi

Şimdi test edelim:

```bash
# 1. Dependencies yükle
npm install

# 2. Prisma generate
npx prisma generate

# 3. Build test
npm run build

# 4. Production çalıştır
npm start
```

Hata yoksa deploy'a hazırsınız! ✅

---

## 🚨 DEPLOY SONRASI YAPILACAKLAR

1. **Google Search Console**
   - Domain ekle: `https://www.ornekdomain.com`
   - Sitemap göster: `https://www.ornekdomain.com/sitemap.xml`

2. **robots.txt Güncelle**
   - Base URL'yi domain'inizle değiştirin
   ```txt
   Sitemap: https://www.ornekdomain.com/sitemap.xml
   ```

3. **OG Images Yükle**
   - 8 adet OG görsel `/public/` klasörüne ekle
   - Bakın: `/public/OG-IMAGES-README.md`

4. **Test Edin**
   - Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - Lighthouse: Chrome DevTools → Lighthouse → SEO

---

## 💾 VERİTABANI YÖNETİMİ

### Vercel Postgres Kurulumu (Önerilir):

```bash
# 1. Vercel Dashboard → Storage → Postgres → Create
# 2. DATABASE_URL'yi kopyala
# 3. Local'de .env'ye ekle

# 4. Schema'yı PostgreSQL için güncelle
# prisma/schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 5. Migration oluştur
npx prisma migrate dev --name init

# 6. Deploy
vercel --prod

# 7. Production'da migrate
vercel env pull .env.production.local
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

### Mevcut SQLite Verileri Aktar:

```bash
# 1. Mevcut veriyi export et
npx prisma db pull
npx prisma db push --schema=./prisma/schema.prisma

# 2. Seed script oluştur
# prisma/seed.ts
# Vercel Postgres'e veri yükle
```

---

## 🎯 HIZLI DEPLOY KOMUTU

```bash
# Tek komutla deploy:
git add . && git commit -m "Production ready" && git push

# Vercel otomatik deploy eder (GitHub connected ise)
```

---

**Sorularınız için hazırım! 🚀**
