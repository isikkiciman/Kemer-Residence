"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface Room {
  id: string;
  name: { tr: string; en: string; de: string; ru: string; pl: string };
  description: { tr: string; en: string; de: string; ru: string; pl: string };
  image: string;
  images: string[];
  price: number;
  capacity: string;
  size: string;
  amenities: Record<string, string[]>;
  order: number;
  active: boolean;
}

const LANGUAGES = ["tr", "en", "de", "ru", "pl"] as const;

type LocalizedContent = Record<(typeof LANGUAGES)[number], string>;

function createEmptyLocalized(): LocalizedContent {
  return LANGUAGES.reduce<LocalizedContent>((acc, lang) => {
    acc[lang] = "";
    return acc;
  }, {} as LocalizedContent);
}

function normalizeLocalized(value: unknown): LocalizedContent {
  const base = createEmptyLocalized();

  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const lang of LANGUAGES) {
      const text = (value as Record<string, unknown>)[lang];
      if (typeof text === "string") {
        base[lang] = text;
      }
    }
  }

  return base;
}

function normalizeAmenities(value: unknown): Record<string, string[]> {
  if (!value) {
    return LANGUAGES.reduce<Record<string, string[]>>((acc, lang) => {
      acc[lang] = [];
      return acc;
    }, {});
  }

  if (Array.isArray(value)) {
    return LANGUAGES.reduce<Record<string, string[]>>((acc, lang) => {
      acc[lang] = value.filter((item): item is string => typeof item === "string");
      return acc;
    }, {});
  }

  if (typeof value === "object") {
    return LANGUAGES.reduce<Record<string, string[]>>((acc, lang) => {
      const list = (value as Record<string, unknown>)[lang];
      acc[lang] = Array.isArray(list)
        ? list.filter((item): item is string => typeof item === "string")
        : [];
      return acc;
    }, {});
  }

  return LANGUAGES.reduce<Record<string, string[]>>((acc, lang) => {
    acc[lang] = [];
    return acc;
  }, {});
}

function normalizeImages(value: unknown, fallback?: string): string[] {
  const rawList: string[] = [];

  const addImage = (candidate: unknown) => {
    if (typeof candidate === "string" && candidate.trim()) {
      rawList.push(candidate.trim());
      return;
    }

    if (candidate && typeof candidate === "object") {
      const record = candidate as Record<string, unknown>;
      if (typeof record.url === "string" && record.url.trim()) {
        rawList.push(record.url.trim());
      }
    }
  };

  if (Array.isArray(value)) {
    value.forEach((item) => addImage(item));
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const possible = record.list ?? record.images ?? record.items;
    if (Array.isArray(possible)) {
      possible.forEach((item) => addImage(item));
    } else {
      Object.values(record).forEach((item) => addImage(item));
    }
  } else if (typeof value === "string") {
    addImage(value);
  }

  if (fallback) {
    addImage(fallback);
  }

  return Array.from(new Set(rawList)).slice(0, 10);
}

function mapRoomResponse(room: unknown): Room {
  const record =
    room && typeof room === "object" ? (room as Record<string, unknown>) : {};

  const images = normalizeImages(
    record.images,
    typeof record.image === "string" ? record.image : undefined
  );
  const coverImage = images[0] ?? (typeof record.image === "string" ? record.image : "");

  return {
    id: String(record.id ?? ""),
    name: normalizeLocalized(record.name),
    description: normalizeLocalized(record.description),
    image: coverImage,
    images,
    price:
      typeof record.price === "number"
        ? record.price
        : Number.parseFloat(String(record.price ?? 0)) || 0,
    capacity:
      typeof record.capacity === "string"
        ? record.capacity
        : String(record.capacity ?? ""),
    size:
      typeof record.size === "string" ? record.size : String(record.size ?? ""),
    amenities: normalizeAmenities(record.amenities),
    order: Number.parseInt(String(record.order ?? 0), 10) || 0,
    active: record.active !== false,
  };
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/admin/rooms");
      const data = await response.json();
      setRooms(
        Array.isArray(data)
          ? data.map((item: unknown) => mapRoomResponse(item))
          : []
      );
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Odalar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu odayı silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/rooms/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Oda başarıyla silindi!");
        fetchRooms();
      } else {
        toast.error("Oda silinemedi!");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Bir hata oluştu!");
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const room = rooms.find((r) => r.id === id);
      if (!room) return;

      const response = await fetch(`/api/admin/rooms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...room, active: !currentActive }),
      });

      if (response.ok) {
        toast.success(
          `Oda ${!currentActive ? "aktif" : "pasif"} hale getirildi!`
        );
        fetchRooms();
      } else {
        toast.error("Durum değiştirilemedi!");
      }
    } catch (error) {
      console.error("Error toggling active:", error);
      toast.error("Bir hata oluştu!");
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Oda Yönetimi</h1>
        <Link
          href="/admin/rooms/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Yeni Oda Ekle
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Henüz oda eklenmemiş.</p>
          <Link
            href="/admin/rooms/create"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            <Plus size={20} />
            İlk Odayı Ekle
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kapasite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sıra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={room.images[0] ?? room.image}
                        alt={room.name.tr}
                        className="h-10 w-16 object-cover rounded mr-3"
                      />
                      <div className="text-sm font-medium text-gray-900">
                        {room.name.tr}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{room.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {room.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {room.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {room.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(room.id, room.active)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        room.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {room.active ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(room.id, room.active)}
                        className="text-gray-600 hover:text-gray-900"
                        title={room.active ? "Pasif yap" : "Aktif yap"}
                      >
                        {room.active ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <Link
                        href={`/admin/rooms/edit/${room.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Düzenle"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
