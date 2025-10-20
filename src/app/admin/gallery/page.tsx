"use client";

import { useState } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  url: string;
  alt: { tr: string };
  category: string;
  order: number;
}

export default function GalleryPage() {
  const [images] = useState<GalleryImage[]>([]);
  const [category, setCategory] = useState("all");

  const categories = [
    { value: "all", label: "Tümü" },
    { value: "rooms", label: "Odalar" },
    { value: "restaurant", label: "Restoran" },
    { value: "facilities", label: "Tesisler" },
    { value: "exterior", label: "Dış Mekan" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Galeri</h1>
          <p className="text-gray-600">Galeri resimlerini yönetin</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <Plus size={20} />
          Resim Yükle
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori Filtrele
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            Henüz galeri resmi eklenmemiş. Yeni resim yüklemek için yukarıdaki butonu kullanın.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow overflow-hidden group relative"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={image.url}
                  alt={image.alt.tr}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">{image.category}</p>
                <p className="text-sm text-gray-900">{image.alt.tr}</p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
