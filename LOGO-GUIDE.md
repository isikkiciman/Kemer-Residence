# Logo Değiştirme Rehberi

## 📋 Logo Nasıl Değiştirilir?

Logo'yu iki şekilde değiştirebilirsiniz:

### ⭐ 1. Yöntem: Admin Panelinden (ÖNERİLEN)

**En kolay yöntem!** Admin panelinden logo URL'sini değiştirebilirsiniz.

**Adımlar:**

1. Admin paneline giriş yapın: http://localhost:3001/admin
2. Soldaki menüden **"Site Ayarları"** seçeneğine tıklayın
3. **"Logo"** bölümünde logo URL'sini girin:
   - Yerel dosya: `/logo.svg` veya `/logo.png`
   - Harici URL: `https://example.com/my-logo.png`
4. Önizleme bölümünde logoyu görebilirsiniz
5. **"Kaydet"** butonuna tıklayın
6. Logo otomatik olarak sitede görünecek!

### 2. Yöntem: Dosya Yükleyerek

**Adımlar:**

1. Logo dosyanızı hazırlayın (PNG, SVG veya JPG)
   - Önerilen boyut: 150x60 px veya benzer oran
   - Şeffaf arka plan için PNG veya SVG kullanın

2. Dosyayı `/public/` klasörüne kopyalayın:
   ```bash
   # Örnek:
   cp ~/Desktop/benim-logom.png public/logo.png
   # veya
   cp ~/Desktop/benim-logom.svg public/logo.svg
   ```

3. Değişiklik otomatik olarak yansıyacaktır!

### 2. Yöntem: Mevcut Logo'yu Düzenleyin

SVG logo `/public/logo.svg` dosyasındadır. Bu dosyayı:
- Figma
- Adobe Illustrator
- Inkscape
- veya online SVG editörlerle düzenleyebilirsiniz

### 3. Yöntem: Text Logo Kullanın

Resim logo yerine text logo kullanmak isterseniz:

`/src/components/Header.tsx` dosyasında değişiklik yapın:

```tsx
// Mevcut Image component'ini değiştirin:
<Link href="/" className="flex items-center gap-2">
  <span className="text-2xl md:text-3xl font-serif font-bold text-blue-600">
    Kemer Residence
  </span>
</Link>
```

## 📁 Dosya Konumları

- **Logo Dosyası:** `/public/logo.svg` veya `/public/logo.png`
- **Header Component:** `/src/components/Header.tsx` (satır 34-43)

## 🎨 Logo Özellikleri

Mevcut ayarlar:
- Format: SVG
- Boyut: 150x60 piksel
- Renk: Mavi (#2563eb) ve gri tonları
- Mobilde: 40px yükseklik
- Desktop'ta: 48px yükseklik

## 💡 İpuçları

1. **SVG Kullanın:** Ölçeklenebilir ve küçük dosya boyutu
2. **Şeffaf Arka Plan:** PNG veya SVG ile
3. **Optimize Edin:** Dosya boyutunu düşük tutun (max 50KB)
4. **Responsive:** Farklı ekran boyutlarında test edin

## 🔄 Değişiklikleri Görme

Geliştirme modunda değişiklikler otomatik yansır:
```bash
npm run dev
```

Tarayıcıda http://localhost:3001 adresini ziyaret edin.
