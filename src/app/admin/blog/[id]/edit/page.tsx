"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Save,
  ArrowLeft,
  Upload,
  Star,
  Link as LinkIcon,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface MultilingualField {
  tr: string;
  en: string;
  de: string;
  ru: string;
  pl: string;
  [key: string]: string;
}

interface ImageData {
  id: string;
  url: string;
  alt: MultilingualField;
  isMain: boolean;
}

interface BlogFormState {
  title: MultilingualField;
  excerpt: MultilingualField;
  content: MultilingualField;
  slug: MultilingualField;
  seoTitle: MultilingualField;
  seoDescription: MultilingualField;
  seoKeywords: MultilingualField;
  externalLink: string;
  externalLinkTitle: MultilingualField;
  author: string;
  category: string;
  readTime: number;
  active: boolean;
}

const languages = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
] as const;

type LocaleCode = (typeof languages)[number]["code"];

type PartialLocales = Partial<Record<LocaleCode, string>>;

const emptyLocales = (): MultilingualField => ({
  tr: "",
  en: "",
  de: "",
  ru: "",
  pl: "",
});

const ensureLocales = (value?: PartialLocales | null): MultilingualField => {
  const base = emptyLocales();
  languages.forEach(({ code }) => {
    base[code] = value?.[code] ?? "";
  });
  return base;
};

const parseReadTime = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const match = value.match(/\d+/);
    if (match) {
      return Number.parseInt(match[0], 10) || 5;
    }
  }
  return 5;
};

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = params?.id;

  const initialForm = useMemo<BlogFormState>(
    () => ({
      title: emptyLocales(),
      excerpt: emptyLocales(),
      content: emptyLocales(),
      slug: emptyLocales(),
      seoTitle: emptyLocales(),
      seoDescription: emptyLocales(),
      seoKeywords: emptyLocales(),
      externalLink: "",
      externalLinkTitle: emptyLocales(),
      author: "",
      category: "",
      readTime: 5,
      active: true,
    }),
    []
  );

  const [formData, setFormData] = useState<BlogFormState>(initialForm);
  const [activeTab, setActiveTab] = useState<LocaleCode>("tr");
  const [images, setImages] = useState<ImageData[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!postId) {
      toast.error("Blog yazısı bulunamadı");
      router.push("/admin/blog");
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/blog/${postId}`);
        if (!response.ok) {
          throw new Error("Blog yazısı getirilemedi");
        }

        const data = await response.json();

        setFormData({
          title: ensureLocales(data.title),
          excerpt: ensureLocales(data.excerpt),
          content: ensureLocales(data.content),
          slug: ensureLocales(data.slug),
          seoTitle: ensureLocales(data.seoTitle),
          seoDescription: ensureLocales(data.seoDescription),
          seoKeywords: ensureLocales(data.seoKeywords),
          externalLink: data.externalLink ?? "",
          externalLinkTitle: ensureLocales(data.externalLinkTitle),
          author: data.author ?? "",
          category: data.category ?? "",
          readTime: parseReadTime(data.readTime),
          active: data.active ?? true,
        });

        const normalizedImages: ImageData[] = (data.images ?? []).map((img: ImageData) => ({
          id: img.id ?? crypto.randomUUID(),
          url: img.url,
          alt: ensureLocales(img.alt),
          isMain: img.isMain ?? img.url === data.image,
        }));

        if (normalizedImages.length > 0 && !normalizedImages.some((img) => img.isMain)) {
          normalizedImages[0].isMain = true;
        }

        setImages(normalizedImages);
      } catch (error) {
        console.error("Blog yazısı yüklenirken hata oluştu", error);
        toast.error("Blog yazısı bulunamadı");
        router.push("/admin/blog");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [postId, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Sadece PNG, JPG ve WebP!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maksimum 5MB!");
      return;
    }

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      const newImage: ImageData = {
        id: Date.now().toString(),
        url: data.url,
        alt: emptyLocales(),
        isMain: images.length === 0,
      };

      setImages([...images, newImage]);
      toast.success("Resim yüklendi!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Hata oluştu!");
    } finally {
      setUploadingImage(false);
    }
  };

  const setMainImage = (id: string) => {
    setImages(
      images.map((img) => ({
        ...img,
        isMain: img.id === id,
      }))
    );
    toast.success("Ana resim seçildi!");
  };

  const deleteImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.isMain)) {
      filtered[0].isMain = true;
    }
    setImages(filtered);
    toast.success("Resim silindi!");
  };

  const updateImageAlt = (id: string, lang: LocaleCode, value: string) => {
    setImages(
      images.map((img) =>
        img.id === id
          ? {
              ...img,
              alt: {
                ...img.alt,
                [lang]: value,
              },
            }
          : img
      )
    );
  };

  const updateLocalizedField = (
    field: keyof BlogFormState,
    lang: LocaleCode,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field] as MultilingualField,
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;

    const mainImage = images.find((img) => img.isMain);
    if (!mainImage) {
      toast.error("En az bir ana resim seçmelisiniz!");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          readTime: formData.readTime,
          image: mainImage.url,
          images,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "" }));
        throw new Error(data.error || "Blog yazısı güncellenemedi");
      }

      toast.success("Blog yazısı güncellendi!");
      setTimeout(() => {
        router.push("/admin/blog");
      }, 800);
    } catch (error) {
      console.error("Blog yazısı güncellenirken hata oluştu", error);
      toast.error(
        error instanceof Error ? error.message : "Blog yazısı güncellenirken hata oluştu"
      );
    } finally {
      setSaving(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-6xl">
        <Toaster position="top-right" />
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-lg bg-gray-200 animate-pulse" />
          <div>
            <div className="h-5 w-48 rounded bg-gray-200 animate-pulse mb-2" />
            <div className="h-4 w-64 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-48 rounded-lg border border-gray-200 bg-gray-50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <Toaster position="top-right" />

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="text-gray-600 hover:text-gray-900 transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Blog Yazısını Düzenle</h1>
          <p className="text-sm text-gray-500 mt-1">Mevcut blog içeriğini güncelleyin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Başlık <span className="text-xs text-gray-500">(H1 etiketi)</span>
              </label>
              <input
                type="text"
                required
                value={formData.title[activeTab]}
                onChange={(e) => updateLocalizedField("title", activeTab, e.target.value)}
                placeholder="Blog yazısının ana başlığı"
                className="w-full px-4 py-3 text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Kısa Açıklama <span className="text-xs text-gray-500 italic">(İtalik görünür)</span>
              </label>
              <textarea
                required
                rows={2}
                value={formData.excerpt[activeTab]}
                onChange={(e) => updateLocalizedField("excerpt", activeTab, e.target.value)}
                placeholder="Blog yazısının özeti (1-2 cümle)"
                className="w-full px-4 py-2 italic border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                İçerik <span className="text-xs text-gray-500">(Ana metin)</span>
              </label>
              <textarea
                required
                rows={12}
                value={formData.content[activeTab]}
                onChange={(e) => updateLocalizedField("content", activeTab, e.target.value)}
                placeholder="Blog yazısının detaylı içeriği..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-sans"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                URL Slug <span className="text-xs text-gray-500">(SEO-friendly URL)</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug[activeTab]}
                onChange={(e) =>
                  updateLocalizedField(
                    "slug",
                    activeTab,
                    e.target.value.toLowerCase().replace(/\s+/g, "-")
                  )
                }
                placeholder="ornek-blog-yazisi"
                className="w-full px-4 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                SEO Title <span className="text-xs text-gray-500">(50-60 karakter)</span>
              </label>
              <input
                type="text"
                value={formData.seoTitle[activeTab]}
                onChange={(e) => updateLocalizedField("seoTitle", activeTab, e.target.value)}
                placeholder="Arama motorları için başlık"
                maxLength={60}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.seoTitle[activeTab] || "").length}/60 karakter
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                SEO Description <span className="text-xs text-gray-500">(150-160 karakter)</span>
              </label>
              <textarea
                rows={3}
                value={formData.seoDescription[activeTab]}
                onChange={(e) => updateLocalizedField("seoDescription", activeTab, e.target.value)}
                placeholder="Arama motorları için açıklama"
                maxLength={160}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(formData.seoDescription[activeTab] || "").length}/160 karakter
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                SEO Meta Keywords <span className="text-xs text-gray-500">(Virgülle ayırın)</span>
              </label>
              <input
                type="text"
                value={formData.seoKeywords[activeTab]}
                onChange={(e) => updateLocalizedField("seoKeywords", activeTab, e.target.value)}
                placeholder="otel, konaklama, blog, seyahat"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Dış Link Başlığı <span className="text-xs text-gray-500">(H2 etiketi - opsiyonel)</span>
              </label>
              <input
                type="text"
                value={formData.externalLinkTitle[activeTab]}
                onChange={(e) => updateLocalizedField("externalLinkTitle", activeTab, e.target.value)}
                placeholder="İlgili kaynak başlığı"
                className="w-full px-4 py-2 text-base font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

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

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              <ImageIcon className="inline mr-2" size={20} />
              Resimler <span className="text-sm text-gray-500">({images.length}/6)</span>
            </h2>
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                <Upload size={16} />
                {uploadingImage ? "Yükleniyor..." : "Resim Yükle"}
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
                      alt={image.alt[activeTab] || "Blog image"}
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

                  <input
                    type="text"
                    value={image.alt[activeTab]}
                    onChange={(e) => updateImageAlt(image.id, activeTab, e.target.value)}
                    placeholder={`Alt text (${languages.find((l) => l.code === activeTab)?.name})`}
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
                min={1}
                value={formData.readTime}
                onChange={(e) =>
                  setFormData({ ...formData, readTime: Number.parseInt(e.target.value, 10) || 1 })
                }
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

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <Link
            href="/admin/blog"
            className="px-6 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving || images.length === 0}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            {saving ? "Güncelleniyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
