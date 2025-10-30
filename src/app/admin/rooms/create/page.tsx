"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const languages = [
  { code: "tr", name: "Türkçe" },
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
  { code: "pl", name: "Polski" },
];

export default function CreateRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: { tr: "", en: "", de: "", ru: "", pl: "" },
    description: { tr: "", en: "", de: "", ru: "", pl: "" },
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coverImage.trim()) {
      toast.error("Kapak görseli zorunludur.");
      return;
    }

    setLoading(true);

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
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: imageList[0],
          images: imageList,
          amenities: amenitiesPayload,
        }),
      });

      if (response.ok) {
        toast.success("Oda başarıyla oluşturuldu!");
        router.push("/admin/rooms");
      } else {
        toast.error("Oda oluşturulamadı!");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold">Yeni Oda Ekle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Multi-language Name */}
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
                  value={formData.name[lang.code as keyof typeof formData.name]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: { ...formData.name, [lang.code]: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Örn: Deluxe Room (${lang.name})`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Multi-language Description */}
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
                  value={
                    formData.description[
                      lang.code as keyof typeof formData.description
                    ]
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: {
                        ...formData.description,
                        [lang.code]: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Oda açıklaması (${lang.name})`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Temel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kapak Görseli
              </label>
              <input
                type="url"
                required
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-2">
                Kapak görseli oda kartlarında ilk görünen fotoğraf olur.
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
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2500"
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
                  setFormData({ ...formData, capacity: e.target.value })
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
                  setFormData({ ...formData, size: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="35 m²"
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
                  setFormData({ ...formData, order: e.target.value })
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
                    setFormData({ ...formData, active: e.target.checked })
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
          <h2 className="text-lg font-semibold mb-2">Galeri Görselleri</h2>
          <p className="text-sm text-gray-500 mb-4">
            Kapak dahil en fazla 10 görsel ekleyebilirsiniz. Sıralama ekleme
            sırasına göre belirlenir.
          </p>
          <div className="flex gap-2 mb-4">
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
          {galleryImages.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {galleryImages.map((url, index) => (
                <div key={`${url}-${index}`} className="relative w-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Galeri görseli ${index + 1}`}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    aria-label="Görseli kaldır"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Henüz ek görsel eklenmedi.</p>
          )}
        </div>

        {/* Amenities */}
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
                key={index}
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

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/rooms"
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Oda Ekle"}
          </button>
        </div>
      </form>
    </div>
  );
}
