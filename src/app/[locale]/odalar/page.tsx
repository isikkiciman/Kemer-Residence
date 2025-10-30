import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Users, Maximize } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getRooms } from "@/lib/roomsData";
import RoomImageCarousel from "@/components/RoomImageCarousel";

function getLocalizedValue(
  value: Record<string, string> | undefined,
  locale: string,
  fallbackLocale = "tr"
) {
  if (!value) {
    return "";
  }

  return (
    value[locale] ??
    value[fallbackLocale] ??
    Object.values(value).find((item) => Boolean(item)) ??
    ""
  );
}

function getLocalizedAmenities(
  value: Record<string, string[]> | undefined,
  locale: string,
  fallbackLocale = "tr"
) {
  if (!value) {
    return [];
  }

  return (
    value[locale] ??
    value[fallbackLocale] ??
    Object.values(value).find((item) => Array.isArray(item) && item.length > 0) ??
    []
  );
}

function formatPrice(price: number, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `₺${price}`;
  }
}

export const metadata: Metadata = {
  title: "Odalarımız",
  description: "Konforlu ve modern odalarımızı keşfedin. Standart, Deluxe ve Suite odalarımız arasından size en uygun olanı seçin.",
  keywords: ["otel odaları", "lüks oda", "standart oda", "deluxe oda", "suite oda", "konaklama"],
  openGraph: {
    title: "Odalarımız - Kemer Residence",
    description: "Konforlu ve modern odalarımızı keşfedin. Standart, Deluxe ve Suite odalarımız.",
    url: '/odalar',
    images: [
      {
        url: '/og-rooms.jpg',
        width: 1200,
        height: 630,
        alt: 'Kemer Residence Odaları',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odalarımız - Kemer Residence',
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

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("rooms");
  const commonT = await getTranslations("common");
  const rooms = await getRooms();

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
        {rooms.length === 0 ? (
          <div className="text-center text-gray-500">{commonT("noData")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => {
              const name = getLocalizedValue(room.name, locale);
              const description = getLocalizedValue(room.description, locale);
              const amenities = getLocalizedAmenities(room.amenities, locale);

              return (
                <div
                  key={room.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <RoomImageCarousel
                    images={room.images}
                    fallbackImage={room.image}
                    alt={name || room.id}
                    className="h-64"
                  />

                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {name || room.id}
                    </h3>
                    <p className="text-gray-600 mb-4">{description}</p>

                    <div className="flex items-center gap-4 mb-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-5 w-5" />
                        <span>{room.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="h-5 w-5" />
                        <span>{room.size}</span>
                      </div>
                    </div>

                    {amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-blue-600">
                          {formatPrice(room.price, locale)}
                        </span>
                        <span className="text-gray-500 ml-2">{t("perNight")}</span>
                      </div>
                      <Link
                        href="/rezervasyon"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        {t("bookNow")}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
