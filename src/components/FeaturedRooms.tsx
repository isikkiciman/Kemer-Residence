import { Link } from "@/i18n/routing";
import { Users, Maximize } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
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

const FeaturedRooms = async () => {
  const t = await getTranslations("rooms");
  const locale = await getLocale();
  const rooms = (await getRooms()).slice(0, 3);

  if (rooms.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => {
            const name = getLocalizedValue(room.name, locale);
            const description = getLocalizedValue(room.description, locale);
            const amenities = getLocalizedAmenities(room.amenities, locale).slice(0, 3);

            return (
              <div
                key={room.id}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <RoomImageCarousel
                  images={room.images}
                  fallbackImage={room.image}
                  alt={name || room.id}
                  className="h-64"
                  priority
                />
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-semibold mb-2">
                    {name || room.id}
                  </h3>
                  <p className="text-gray-600 mb-4">{description}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize size={16} />
                      <span>{room.size}</span>
                    </div>
                  </div>

                  {amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
                      {amenities.map((item) => (
                        <span
                          key={item}
                          className="bg-gray-100 rounded-full px-3 py-1"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-[--primary]">
                        {formatPrice(room.price, locale)}
                      </span>
                      <span className="text-gray-600 text-sm ml-1">{t("perNight")}</span>
                    </div>
                    <Link
                      href="/odalar"
                      className="bg-[--primary] hover:bg-[--primary-dark] text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {t("details")}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/odalar" className="btn-primary">
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;
