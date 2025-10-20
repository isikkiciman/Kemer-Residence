# App Router Yapısı

## ⚠️ ÖNEMLİ: Bu klasörde `page.tsx` dosyası OLMAMALI!

Bu proje multi-language (çok dilli) bir Next.js uygulamasıdır ve `next-intl` kullanır.

### Doğru Yapı:
```
/src/app/
  ├── [locale]/          ← Tüm sayfalar burada!
  │   ├── page.tsx       ← Ana sayfa
  │   ├── odalar/
  │   ├── blog/
  │   └── ...
  ├── admin/             ← Admin sayfaları (dil yok)
  ├── api/               ← API routes
  └── layout.tsx         ← Root layout
```

### ❌ Yanlış:
```
/src/app/
  ├── page.tsx          ← BU OLMAMALI!
  ├── [locale]/
  │   └── page.tsx
```

### Neden?

1. **Multi-language routing**: Tüm sayfalar `/tr`, `/en`, `/de`, `/ru`, `/pl` gibi dil prefix'leriyle erişilir
2. **`page.tsx` duplicasyonu**: Hem root'ta hem `[locale]` içinde olursa TypeScript karışır
3. **Import sorunları**: Root `page.tsx` varsa, TypeScript component import'larını bulamaz

### Eğer `page.tsx` yanlışlıkla oluşturulursa:

```bash
rm src/app/page.tsx
```

Veya VS Code'da dosyayı silip, TypeScript server'ı yenileyin.

---

**Ana sayfa lokasyonu:** `/src/app/[locale]/page.tsx` ✅
