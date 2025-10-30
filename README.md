# Kemer Residence - Modern Otel Web Sitesi

Modern, responsive ve SEO uyumlu bir otel web sitesi. Next.js 14+, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- ⚡ **Next.js 14+** - App Router ve Server Components
- 🎨 **Tailwind CSS** - Modern ve responsive tasarım
- 📱 **Tam Responsive** - Mobil, tablet ve desktop uyumlu
- 🔍 **SEO Uyumlu** - Metadata ve optimizasyon
- ⚡ **Turbopack** - Hızlı geliştirme deneyimi
- 🎯 **TypeScript** - Tip güvenliği
- 🎨 **Lucide Icons** - Modern ikonlar

## 📄 Sayfalar

1. **Ana Sayfa** - Hero, özellikler, öne çıkan odalar, blog ve CTA
2. **Odalar** - Tüm oda türleri ve detayları
3. **Blog** - Seyahat ipuçları ve otel haberleri
4. **Galeri** - Otel fotoğrafları
5. **Hakkımızda** - Otel hikayesi, değerler ve ekip
6. **İletişim** - İletişim bilgileri ve form

## 🛠️ Kurulum

### Gereksinimler

- Node.js 18.x veya üzeri
- npm

### Adımlar

1. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

2. Tarayıcınızda açın:
```
http://localhost:3000
```

## 📦 Komutlar

```bash
# Geliştirme sunucusu (Turbopack ile)
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Lint kontrolü
npm run lint
```

## 🎨 Tasarım

- **Renk Paleti:**
  - Primary: #8b7355 (Bronz/Kahve)
  - Primary Dark: #6d5a44
  - Secondary: #f5f5f0 (Açık Bej)
  - Accent: #d4af37 (Altın)

- **Fontlar:**
  - Başlıklar: Playfair Display (Serif)
  - Metin: Inter (Sans-serif)

## 📁 Proje Yapısı

```
kemer-residence/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Ana layout
│   │   ├── page.tsx            # Ana sayfa
│   │   ├── globals.css         # Global stiller
│   │   ├── odalar/            # Odalar sayfası
│   │   ├── blog/              # Blog sayfası
│   │   ├── galeri/            # Galeri sayfası
│   │   ├── hakkimizda/        # Hakkımızda sayfası
│   │   └── iletisim/          # İletişim sayfası
│   └── components/
│       ├── Header.tsx          # Navbar
│       ├── Footer.tsx          # Footer
│       ├── Hero.tsx            # Hero bölümü
│       ├── Features.tsx        # Özellikler
│       ├── FeaturedRooms.tsx   # Öne çıkan odalar
│       ├── LatestBlog.tsx      # Son blog yazıları
│       └── CTASection.tsx      # Call-to-action
├── public/                     # Statik dosyalar
└── package.json
```

## 🔧 Özelleştirme

### Renkleri Değiştirme

`src/app/globals.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
  --primary: #8b7355;
  --primary-dark: #6d5a44;
  --secondary: #f5f5f0;
  --accent: #d4af37;
}
```

### İçerik Güncelleme

- Oda bilgileri: `src/app/odalar/page.tsx`
- Blog yazıları: `src/app/blog/page.tsx`
- Galeri resimleri: `src/app/galeri/page.tsx`
- İletişim bilgileri: `src/app/iletisim/page.tsx`

## 📸 Görseller

Görseller Unsplash'ten alınmıştır. Kendi görsellerinizi kullanmak için `public/images/` klasörüne ekleyin ve bileşenlerdeki URL'leri güncelleyin.

### Admin panelinden görsel yükleme

Prod ortamında yüklenen dosyaların kalıcı olması için [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) kullanılır. Geliştirme ortamında token tanımlı değilse dosyalar yerel `public/uploads` klasörüne kaydedilir.

1. `@vercel/blob` için bir **Read/Write Token** oluşturun.
2. `.env.local` (veya Vercel dashboard) içine şu değişkeni ekleyin:

  ```bash
  BLOB_READ_WRITE_TOKEN="<token>"
  ```

3. Admin panelinden yüklenen görseller otomatik olarak Vercel Blob’a yüklenecek ve URL’ler veritabanına kaydedilecektir.

## 🚀 Production

Production için build almak:

```bash
npm run build
npm start
```

Vercel, Netlify veya benzeri platformlara deploy edebilirsiniz.

---

⭐ Bu proje Next.js 14+ ile oluşturulmuştur.
