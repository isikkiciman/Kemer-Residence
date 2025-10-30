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

export default function EditRoomPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: createEmptyLocalized(),
    description: createEmptyLocalized(),
    image: "",
    price: "",
    capacity: "",
    size: "",
    amenities: [] as string[],
    order: "0",
    active: true,
  });
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

        setFormData({
          name: normalizeLocalized(data.name),
          description: normalizeLocalized(data.description),
          image: data.image ?? "",
          price: priceValue,
          capacity: data.capacity ?? "",
          size: data.size ?? "",
          amenities: extractAmenities(data.amenities),
          order: orderValue,
          active: data.active !== false,
        });
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!roomId) {
      toast.error("Geçersiz oda bilgisi");
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

      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resim URL
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
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
