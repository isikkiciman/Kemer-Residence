import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Users, Maximize } from "lucide-react";
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Odalarımız",
  description: "Konforlu ve modern odalarımızı keşfedin. Standart, Deluxe ve Suite odalarımız arasından size en uygun olanı seçin.",
  keywords: ["otel odaları", "lüks oda", "standart oda", "deluxe oda", "suite oda", "konaklama"],
  openGraph: {
    title: "Odalarımız - Romee Hotel",
    description: "Konforlu ve modern odalarımızı keşfedin. Standart, Deluxe ve Suite odalarımız.",
    url: '/odalar',
    images: [
      {
        url: '/og-rooms.jpg',
        width: 1200,
        height: 630,
        alt: 'Romee Hotel Odaları',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odalarımız - Romee Hotel',
    description: 'Konforlu ve modern odalarımızı keşfedin',
  },
  alternates: {
    canonical: '/tr/odalar',
    languages: {
      'tr': '/tr/odalar',
      'en': '/en/odalar',
      'de': '/de/odalar',
      'ru': '/ru/odalar',
      'pl': '/pl/odalar',
    },
  },
};

const staticRooms = [
  {
    id: 1,
    name: {
      tr: "Standart Oda",
      en: "Standard Room",
      de: "Standardzimmer",
      ru: "Стандартный номер",
      pl: "Pokój standardowy"
    },
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070",
    price: 1800,
    capacity: "2",
    size: "25",
    description: {
      tr: "Konforlu ve şık tasarımlı standart odalarımız",
      en: "Comfortable and stylishly designed standard rooms",
      de: "Komfortable und stilvoll gestaltete Standardzimmer",
      ru: "Удобные и стильные стандартные номера",
      pl: "Wygodne i stylowe pokoje standardowe"
    },
    amenities: ["Klima", "WiFi", "TV", "Minibar"],
  },
  {
    id: 2,
    name: {
      tr: "Deluxe Oda",
      en: "Deluxe Room",
      de: "Deluxe Zimmer",
      ru: "Люкс номер",
      pl: "Pokój deluxe"
    },
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070",
    price: 2500,
    capacity: "2",
    size: "35",
    description: {
      tr: "Geniş ve lüks deluxe odalarımız",
      en: "Spacious and luxurious deluxe rooms",
      de: "Geräumige und luxuriöse Deluxe-Zimmer",
      ru: "Просторные и роскошные номера делюкс",
      pl: "Przestronne i luksusowe pokoje deluxe"
    },
    amenities: ["Klima", "WiFi", "Smart TV", "Minibar", "Kahve Makinesi"],
  },
  {
    id: 3,
    name: {
      tr: "Suite Oda",
      en: "Suite Room",
      de: "Suite Zimmer",
      ru: "Люкс апартаменты",
      pl: "Apartament"
    },
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074",
    price: 3500,
    capacity: "4",
    size: "65",
    description: {
      tr: "Geniş oturma alanı ve jakuzi ile suite odalarımız",
      en: "Suite rooms with spacious living area and jacuzzi",
      de: "Suite-Zimmer mit geräumigem Wohnbereich und Whirlpool",
      ru: "Люкс-апартаменты с просторной гостиной и джакузи",
      pl: "Apartamenty z przestronną częścią dzienną i jacuzzi"
    },
    amenities: ["Klima", "WiFi", "Smart TV", "Minibar", "Kahve Makinesi", "Jakuzi", "Balkon"],
  },
  {
    id: 4,
    name: {
      tr: "Aile Odası",
      en: "Family Room",
      de: "Familienzimmer",
      ru: "Семейный номер",
      pl: "Pokój rodzinny"
    },
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074",
    price: 3000,
    capacity: "4",
    size: "50",
    description: {
      tr: "Aileler için geniş ve rahat konaklama alanı",
      en: "Spacious and comfortable accommodation for families",
      de: "Geräumige und komfortable Unterkunft für Familien",
      ru: "Просторное и комфортное размещение для семей",
      pl: "Przestronne i komfortowe zakwaterowanie dla rodzin"
    },
    amenities: ["Klima", "WiFi", "TV", "Minibar", "Çocuk Karyolası"],
  },
];

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('rooms');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[400px] bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070"
          alt="Rooms"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{t('title')}</h1>
            <p className="text-xl">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staticRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={room.image}
                  alt={room.name[locale as keyof typeof room.name]}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">
                  {room.name[locale as keyof typeof room.name]}
                </h3>
                <p className="text-gray-600 mb-4">
                  {room.description[locale as keyof typeof room.description]}
                </p>

                <div className="flex items-center gap-4 mb-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    <span>{room.capacity} {t('capacity')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-5 w-5" />
                    <span>{room.size} m²</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">
                      {room.price} ₺
                    </span>
                    <span className="text-gray-500 ml-2">{t('perNight')}</span>
                  </div>
                  <Link
                    href="/rezervasyon"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {t('bookNow')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
