# 🏨 Kemer Residence - Admin Paneli Kullanım Rehberi

## 🎨 Logo Değiştirme

### Admin Panelinden (Önerilen) ⭐

1. **Admin Paneline Giriş**
   - Tarayıcıda `http://localhost:3001/admin` adresine gidin
   - (Production'da: `https://your-domain.com/admin`)

2. **Site Ayarlarına Git**
   - Sol menüden **"Site Ayarları"** linkine tıklayın

3. **Logo URL'sini Girin**
   - **Logo** bölümünü bulun
   - Logo URL kutusuna logo yolunu girin:
     - Yerel: `/logo.svg` veya `/logo.png` veya `/images/my-logo.png`
     - URL: `https://cdn.example.com/logo.png`
   - Önizleme otomatik olarak gösterilecek

4. **Kaydet**
   - En alttaki **"Kaydet"** butonuna tıklayın
   - Başarı mesajını bekleyin
   - Ana siteyi yenileyin - yeni logo görünecek!

### Logo Dosyası Yükleme

Logo dosyanızı `/public/` klasörüne kopyalayın:

```bash
# Terminalden:
cp ~/Desktop/benim-logom.png /Users/isikkiciman/kemer-residence/public/logo.png

# SVG için
cp ~/Desktop/benim-logom.svg /Users/isikkiciman/kemer-residence/public/logo.svg
```

Sonra admin panelinden URL'yi `/logo.png` veya `/logo.svg` olarak güncelleyin.

## 📝 Diğer Site Ayarları

Admin panelindeki **Site Ayarları** sayfasından şunları da değiştirebilirsiniz:

### 🌐 Çok Dilli İçerikler

- **Site İsmi** (5 dilde)
- **Site Açıklaması** (5 dilde)
- **İletişim Adresi** (5 dilde)

### 📧 İletişim Bilgileri

- E-posta
- Telefon
- Adres

### 📱 Sosyal Medya

- Facebook URL
- Instagram URL
- Twitter URL

## 🗂️ İçerik Yönetimi

### Odalar
`/admin/rooms` - Oda ekleme, düzenleme, silme

### Blog
`/admin/blog` - Blog yazısı yönetimi (5 dilde)

### Galeri
`/admin/gallery` - Galeri resimleri yönetimi

### Çeviriler
`/admin/translations` - 580+ çeviri yönetimi

## 🔧 Teknik Detaylar

### Logo Sistemi

- **Kaynak:** Site ayarları veritabanından (`SiteSettings` tablosu)
- **Varsayılan:** `/logo.svg`
- **Format:** PNG, SVG, JPG, WebP
- **Boyut Önerisi:** 150x60 px veya benzer oran
- **Önizleme:** Admin panelinde anlık önizleme

### API Endpoint

```bash
# Logo URL'sini çekmek için:
GET /api/admin/settings
Response: { logoUrl: "/logo.svg", ... }

# Logo URL'sini güncellemek için:
POST /api/admin/settings
Body: { logoUrl: "/new-logo.png", ... }
```

### Component

Logo `Header.tsx` component'inde kullanılır:
- Settings API'den logo URL çeker
- Next.js Image component ile optimize eder
- Priority loading (hızlı görünüm)

## 💡 İpuçları

1. **SVG Kullanın:** Ölçeklenebilir ve küçük dosya boyutu
2. **Şeffaf Arka Plan:** PNG veya SVG tercih edin
3. **Optimize Edin:** Dosya boyutunu düşük tutun (max 100KB)
4. **Test Edin:** Farklı ekran boyutlarında kontrol edin
5. **CDN Kullanın:** Büyük logolar için CDN URL'si kullanabilirsiniz

## 🚀 Hızlı Başlangıç

```bash
# 1. Admin paneline git
http://localhost:3001/admin

# 2. Site Ayarları > Logo
# 3. URL gir: /logo.svg
# 4. Kaydet
# 5. Ana siteyi yenile
```

## 📦 Logo Örnekleri

Varsayılan logo: `/public/logo.svg`
- Mavi otel ikonu
- "Kemer RESIDENCE" yazısı
- 150x60 piksel
- SVG format

Kendi logonuzu kullanmak için bu dosyayı değiştirin veya yeni bir dosya ekleyip admin panelden URL'sini güncelleyin.

## 🆘 Sorun Giderme

**Logo görünmüyor?**
- URL'nin doğru olduğundan emin olun
- Dosyanın `/public/` klasöründe olduğunu kontrol edin
- Tarayıcıyı yenileyin (Cmd+R)
- Console'da hata olup olmadığını kontrol edin

**Logo çok büyük/küçük?**
- Admin panelde CSS class'ları düzenlenebilir
- Veya dosyayı yeniden boyutlandırın

**Değişiklikler yansımıyor?**
- Sayfayı hard refresh yapın (Cmd+Shift+R)
- Site ayarlarını kaydettiğinizden emin olun
- Development server'ı yeniden başlatın

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. `LOGO-GUIDE.md` dosyasına bakın
2. Console'da hata mesajlarını kontrol edin
3. `/api/admin/settings` endpoint'ini test edin
