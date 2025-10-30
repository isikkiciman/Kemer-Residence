"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const languages = [
  { code: "tr", name: "Türkçe" },
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
  { code: "pl", name: "Polski" },
] as const;

type LanguageCode = (typeof languages)[number]["code"];

type LocalizedContent = Record<LanguageCode, string>;

type RoomResponse = {
  id: string;
  name?: Record<string, unknown>;
  description?: Record<string, unknown>;
  image?: string;
  images?: unknown;
  price?: number | string;
  capacity?: string;
  size?: string;
  amenities?: Record<string, unknown> | string[];
  order?: number | string;
  active?: boolean;
};

function createEmptyLocalized(): LocalizedContent {
  return languages.reduce<LocalizedContent>((acc, lang) => {
    acc[lang.code] = "";
    return acc;
  }, {} as LocalizedContent);
}

function normalizeLocalized(value: unknown): LocalizedContent {
  const base = createEmptyLocalized();

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return base;
  }

  for (const lang of languages) {
    const text = (value as Record<string, unknown>)[lang.code];
    if (typeof text === "string") {
      base[lang.code] = text;
    }
  }

  return base;
}

function extractAmenities(value: RoomResponse["amenities"]): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const lang of languages) {
      const list = record[lang.code];
      if (Array.isArray(list) && list.length > 0) {
        return list.filter((item): item is string => typeof item === "string");
      }
    }
  }

  return [];
}

function extractImages(value: RoomResponse["images"], fallback?: string): string[] {
  const list: string[] = [];

  const add = (candidate: unknown) => {
    if (typeof candidate === "string" && candidate.trim()) {
      list.push(candidate.trim());
      return;
    }

    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      const record = candidate as Record<string, unknown>;
      if (typeof record.url === "string" && record.url.trim()) {
        list.push(record.url.trim());
      }
    }
  };

  if (Array.isArray(value)) {
    value.forEach((item) => add(item));
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (Array.isArray(record.list)) {
      record.list.forEach((item) => add(item));
    } else if (Array.isArray(record.images)) {
      record.images.forEach((item) => add(item));
    } else {
      Object.values(record).forEach((item) => add(item));
    }
  }

  if (fallback) {
    add(fallback);
  }

  return Array.from(new Set(list)).slice(0, 10);
}

export default function EditRoomPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: createEmptyLocalized(),
    description: createEmptyLocalized(),
    price: "",
    capacity: "",
    size: "",
    amenities: [] as string[],
    order: "0",
    active: true,
  });
  const [coverImage, setCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState("");
  const [amenityInput, setAmenityInput] = useState("");

  const roomId = useMemo(() => params?.id ?? "", [params?.id]);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/admin/rooms/${roomId}`);
        if (!response.ok) {
          throw new Error("Room fetch failed");
        }

        const data: RoomResponse = await response.json();
        const priceValue =
          typeof data.price === "number"
            ? String(data.price)
            : data.price ?? "";
        const orderValue =
          typeof data.order === "number"
            ? String(data.order)
            : data.order ?? "0";

        const images = extractImages(data.images, data.image);

        setFormData({
          name: normalizeLocalized(data.name),
          description: normalizeLocalized(data.description),
          price: priceValue,
          capacity: data.capacity ?? "",
          size: data.size ?? "",
          amenities: extractAmenities(data.amenities),
          order: orderValue,
          active: data.active !== false,
        });
        setCoverImage(images[0] ?? "");
        setGalleryImages(images.slice(1));
      } catch (error) {
        console.error("Error fetching room:", error);
        toast.error("Oda bilgileri yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    }
  };

  const removeAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const addGalleryImage = () => {
    const value = galleryInput.trim();
    if (!value) {
      return;
    }

    const totalCount = (coverImage.trim() ? 1 : 0) + galleryImages.length;
    if (totalCount >= 10) {
      toast.error("En fazla 10 görsel ekleyebilirsiniz.");
      return;
    }

    if (value === coverImage.trim() || galleryImages.includes(value)) {
      toast.error("Aynı görseli tekrar ekleyemezsiniz.");
      setGalleryInput("");
      return;
    }

    setGalleryImages((prev) => [...prev, value]);
    setGalleryInput("");
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!roomId) {
      toast.error("Geçersiz oda bilgisi");
      return;
    }

    if (!coverImage.trim()) {
      toast.error("Kapak görseli zorunludur.");
      return;
    }

    setSubmitting(true);

    try {
      const amenitiesPayload = languages.reduce<Record<string, string[]>>(
        (acc, lang) => {
          acc[lang.code] = formData.amenities;
          return acc;
        },
        {} as Record<string, string[]>
      );

      const imageList = [coverImage, ...galleryImages]
        .map((url) => url.trim())
        .filter((url) => Boolean(url))
        .reduce<string[]>((acc, url) => {
          if (!acc.includes(url)) {
            acc.push(url);
          }
          return acc;
        }, [])
        .slice(0, 10);

      if (imageList.length === 0) {
        toast.error("En az bir görsel ekleyin.");
        setSubmitting(false);
        return;
      }

      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: imageList[0],
          images: imageList,
          amenities: amenitiesPayload,
        }),
      });

      if (response.ok) {
        toast.success("Oda başarıyla güncellendi!");
        router.push("/admin/rooms");
      } else {
        toast.error("Oda güncellenemedi!");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Bir hata oluştu!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/rooms"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Geri Dön
        </Link>
        <h1 className="text-2xl font-bold">Odayı Düzenle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Oda İsmi (Çok Dilli)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <div key={lang.code}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name[lang.code]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: { ...prev.name, [lang.code]: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Örn: Suite Room (${lang.name})`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Açıklama (Çok Dilli)</h2>
          <div className="space-y-4">
            {languages.map((lang) => (
              <div key={lang.code}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang.name}
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description[lang.code]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: {
                        ...prev.description,
                        [lang.code]: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Oda açıklaması (${lang.name})`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Temel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kapak Görseli URL
              </label>
              <input
                type="url"
                required
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/cover.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Bu görsel odanın listelemelerde görünen ilk görselidir.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat (₺)
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kapasite
              </label>
              <input
                type="text"
                required
                value={formData.capacity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, capacity: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2 Kişi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alan (m²)
              </label>
              <input
                type="text"
                required
                value={formData.size}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, size: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="45 m²"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sıralama
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, order: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, active: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Aktif
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Galeri Görselleri (opsiyonel)
              </label>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="url"
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addGalleryImage();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/gallery.jpg"
                />
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Görsel Ekle
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maksimum 10 görsel ekleyebilirsiniz. Kapak görseli dahil edilmiştir.
              </p>

              {galleryImages.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {galleryImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="flex items-center justify-between gap-3 border border-gray-200 rounded px-3 py-2"
                    >
                      <span className="text-sm break-all flex-1">{image}</span>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Kaldır
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Özellikler</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAmenity();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Özellik ekle (örn: WiFi, Klima, TV)"
            />
            <button
              type="button"
              onClick={addAmenity}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ekle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map((amenity, index) => (
              <span
                key={`${amenity}-${index}`}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => removeAmenity(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/rooms"
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Kaydediliyor..." : "Odayı Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
