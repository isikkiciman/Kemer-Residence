"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Upload, Star, Link as LinkIcon, Trash2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

interface ImageData {
  id: string;
  url: string;
  alt: {
    tr: string;
    en: string;
    de: string;
    ru: string;
    pl: string;
  };
  isMain: boolean;
}

const languages = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
];

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tr");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [images, setImages] = useState<ImageData[]>([]);

  const [formData, setFormData] = useState({
    title: { tr: "", en: "", de: "", ru: "", pl: "" },
    excerpt: { tr: "", en: "", de: "", ru: "", pl: "" },
    content: { tr: "", en: "", de: "", ru: "", pl: "" },
    slug: { tr: "", en: "", de: "", ru: "", pl: "" },
    seoTitle: { tr: "", en: "", de: "", ru: "", pl: "" },
    seoDescription: { tr: "", en: "", de: "", ru: "", pl: "" },
    seoKeywords: { tr: "", en: "", de: "", ru: "", pl: "" },
    externalLink: "",
    externalLinkTitle: { tr: "", en: "", de: "", ru: "", pl: "" },
    externalLinkButton: { tr: "Kaynağa git", en: "Visit resource", de: "Zur Quelle", ru: "Перейти к источнику", pl: "Przejdź do źródła" },
    author: "",
    category: "",
    readTime: 5,
    active: true,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece PNG, JPG ve WebP!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Maksimum 5MB!');
      return;
    }

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      const newImage: ImageData = {
        id: Date.now().toString(),
        url: data.url,
        alt: { tr: "", en: "", de: "", ru: "", pl: "" },
        isMain: images.length === 0, // İlk resim otomatik ana resim
      };

      setImages([...images, newImage]);
      toast.success('Resim yüklendi!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hata oluştu!');
    } finally {
      setUploadingImage(false);
    }
  };

  const setMainImage = (id: string) => {
    setImages(images.map(img => ({
      ...img,
      isMain: img.id === id
    })));
    toast.success('Ana resim seçildi!');
  };

  const deleteImage = (id: string) => {
    const filtered = images.filter(img => img.id !== id);
    // Eğer ana resim silindiyse, ilk resmi ana resim yap
    if (filtered.length > 0 && !filtered.some(img => img.isMain)) {
      filtered[0].isMain = true;
    }
    setImages(filtered);
    toast.success('Resim silindi!');
  };

  const updateImageAlt = (id: string, lang: string, value: string) => {
    setImages(images.map(img => 
      img.id === id 
        ? { ...img, alt: { ...img.alt, [lang]: value } }
        : img
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const mainImage = images.find(img => img.isMain);
    if (!mainImage) {
      toast.error('En az bir ana resim seçmelisiniz!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image: mainImage.url,
          images: images,
        }),
      });

      if (response.ok) {
        toast.success("Blog yazısı başarıyla eklendi!");
        setTimeout(() => {
          router.push("/admin/blog");
        }, 1000);
      } else {
        const data = await response.json();
        toast.error(data.error || "Blog yazısı eklenirken bir hata oluştu!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/blog"
          className="text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Yeni Blog Yazısı</h1>
          <p className="text-sm text-gray-500 mt-1">SEO optimize edilmiş blog yazısı oluşturun</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Language Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveTab(lang.code)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === lang.code
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Title (H1) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Başlık <span className="text-xs text-gray-500">(H1 etiketi)</span>
              </label>
              <input
                type="text"
                required
                value={formData.title[activeTab as keyof typeof formData.title]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: { ...formData.title, [activeTab]: e.target.value },
                  })
                }
                placeholder="Blog yazısının ana başlığı"
                className="w-full px-4 py-3 text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Excerpt (Italic) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Kısa Açıklama <span className="text-xs text-gray-500 italic">(İtalik görünür)</span>
              </label>
              <textarea
                required
                rows={2}
                value={formData.excerpt[activeTab as keyof typeof formData.excerpt]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    excerpt: { ...formData.excerpt, [activeTab]: e.target.value },
                  })
                }
                placeholder="Blog yazısının özeti (1-2 cümle)"
                className="w-full px-4 py-2 italic border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Content (Long) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                İçerik <span className="text-xs text-gray-500">(Ana metin)</span>
              </label>
              <textarea
                required
                rows={12}
                value={formData.content[activeTab as keyof typeof formData.content]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, [activeTab]: e.target.value },
                  })
                }
                placeholder="Blog yazısının detaylı içeriği..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-sans"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                URL Slug <span className="text-xs text-gray-500">(SEO-friendly URL)</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug[activeTab as keyof typeof formData.slug]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: { ...formData.slug, [activeTab]: e.target.value.toLowerCase().replace(/\s+/g, '-') },
                  })
                }
                placeholder="ornek-blog-yazisi"
                className="w-full px-4 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* SEO Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                SEO Title <span className="text-xs text-gray-500">(50-60 karakter)</span>
              </label>
              <input
                type="text"
                value={formData.seoTitle[activeTab as keyof typeof formData.seoTitle]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seoTitle: { ...formData.seoTitle, [activeTab]: e.target.value },
                  })
                }
                placeholder="Arama motorları için başlık"
                maxLength={60}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.seoTitle[activeTab as keyof typeof formData.seoTitle] || '').length}/60 karakter
              </p>
            </div>

            {/* SEO Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                SEO Description <span className="text-xs text-gray-500">(150-160 karakter)</span>
              </label>
              <textarea
                rows={3}
                value={formData.seoDescription[activeTab as keyof typeof formData.seoDescription]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seoDescription: { ...formData.seoDescription, [activeTab]: e.target.value },
                  })
                }
                placeholder="Arama motorları için açıklama"
                maxLength={160}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.seoDescription[activeTab as keyof typeof formData.seoDescription] || '').length}/160 karakter
              </p>
            </div>

            {/* SEO Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                SEO Meta Keywords <span className="text-xs text-gray-500">(Virgülle ayırın)</span>
              </label>
              <input
                type="text"
                value={formData.seoKeywords[activeTab as keyof typeof formData.seoKeywords]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seoKeywords: { ...formData.seoKeywords, [activeTab]: e.target.value },
                  })
                }
                placeholder="otel, konaklama, blog, seyahat"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* External Link Title (H2) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Dış Link Başlığı <span className="text-xs text-gray-500">(H2 etiketi - opsiyonel)</span>
              </label>
              <input
                type="text"
                value={formData.externalLinkTitle[activeTab as keyof typeof formData.externalLinkTitle]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    externalLinkTitle: { ...formData.externalLinkTitle, [activeTab]: e.target.value },
                  })
                }
                placeholder="İlgili kaynak başlığı"
                className="w-full px-4 py-2 text-base font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* External Link Button Label */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Dış Link Buton Metni <span className="text-xs text-gray-500">(Butonda görünecek)</span>
              </label>
              <input
                type="text"
                value={formData.externalLinkButton[activeTab as keyof typeof formData.externalLinkButton]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    externalLinkButton: {
                      ...formData.externalLinkButton,
                      [activeTab]: e.target.value,
                    },
                  })
                }
                placeholder="Buton metni"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* External Link (Tek seferlik) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            <LinkIcon className="inline mr-2" size={16} />
            Dış Link URL <span className="text-xs text-gray-500">(Opsiyonel)</span>
          </label>
          <input
            type="url"
            value={formData.externalLink}
            onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
            placeholder="https://example.com"
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              <ImageIcon className="inline mr-2" size={20} />
              Resimler <span className="text-sm text-gray-500">({images.length}/6)</span>
            </h2>
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                <Upload size={16} />
                {uploadingImage ? 'Yükleniyor...' : 'Resim Yükle'}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage || images.length >= 6}
                className="hidden"
              />
            </label>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <ImageIcon className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-500">Henüz resim yüklenmedi</p>
              <p className="text-xs text-gray-400 mt-1">En az 1, en fazla 6 resim yükleyebilirsiniz</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {images.map((image) => (
                <div key={image.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image.url}
                      alt={image.alt[activeTab as keyof typeof image.alt] || 'Blog image'}
                      fill
                      className="object-cover"
                    />
                    {image.isMain && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                        <Star size={12} fill="white" />
                        Ana Resim
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Alt Text for Active Language */}
                  <input
                    type="text"
                    value={image.alt[activeTab as keyof typeof image.alt]}
                    onChange={(e) => updateImageAlt(image.id, activeTab, e.target.value)}
                    placeholder={`Alt text (${languages.find(l => l.code === activeTab)?.name})`}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {!image.isMain && (
                    <button
                      type="button"
                      onClick={() => setMainImage(image.id)}
                      className="w-full px-3 py-1.5 text-xs border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Ana Resim Yap
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* General Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Genel Bilgiler</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Yazar</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Yazar adı"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Kategori</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Seyahat, Otel, vb."
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Okuma Süresi (dk)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Yayınla (Aktif)</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <Link
            href="/admin/blog"
            className="px-6 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading || images.length === 0}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            {loading ? "Kaydediliyor..." : "Kaydet ve Yayınla"}
          </button>
        </div>
      </form>
    </div>
  );
}
