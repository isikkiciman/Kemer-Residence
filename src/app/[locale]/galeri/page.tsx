import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Romee Hotel'in fotoğraf galerisi. Odalarımız, restoranımız ve otel olanaklarımızı görüntüleyin.",
  keywords: ["otel galerisi", "otel fotoğrafları", "oda görselleri", "otel iç mekan", "otel dış görünüm"],
  openGraph: {
    title: "Galeri - Romee Hotel",
    description: "Otelimizin fotoğraf galerisi",
    url: '/galeri',
    images: [
      {
        url: '/og-gallery.jpg',
        width: 1200,
        height: 630,
        alt: 'Romee Hotel Galeri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galeri - Romee Hotel',
    description: 'Otelimizin fotoğraf galerisi',
  },
  alternates: {
    canonical: '/tr/galeri',
    languages: {
      'tr': '/tr/galeri',
      'en': '/en/galeri',
      'de': '/de/galeri',
      'ru': '/ru/galeri',
      'pl': '/pl/galeri',
    },
  },
};

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
    alt: "Otel Dış Görünüm",
    category: "Otel",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070",
    alt: "Deluxe Oda",
    category: "Odalar",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074",
    alt: "Suite Oda",
    category: "Odalar",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070",
    alt: "Restoran",
    category: "Restoran",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
    alt: "Presidential Suite",
    category: "Odalar",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070",
    alt: "Spa & Wellness",
    category: "Spa",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080",
    alt: "Resepsiyon",
    category: "Otel",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070",
    alt: "Lounge",
    category: "Otel",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070",
    alt: "Lüks Yatak Odası",
    category: "Odalar",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070",
    alt: "Restaurant",
    category: "Restoran",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074",
    alt: "Aile Odası",
    category: "Odalar",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071",
    alt: "Bar",
    category: "Bar",
  },
];

const categories = ["Tümü", "Otel", "Odalar", "Restoran", "Spa", "Bar"];

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070"
          alt="Gallery"
          fill
          className="object-cover"
        />
        <div className="container-custom relative z-20 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">
            Galeri
          </h1>
          <p className="text-xl">Otelimizden görseller</p>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-lg border-2 border-[--primary] text-[--primary] hover:bg-[--primary] hover:text-white transition-all"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="group relative h-72 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-semibold">{image.alt}</p>
                    <p className="text-sm">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
