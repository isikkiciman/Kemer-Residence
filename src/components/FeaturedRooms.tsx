"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Users, Maximize } from "lucide-react";
import { useTranslations } from 'next-intl';

const FeaturedRooms = () => {
  const t = useTranslations('rooms');
  const rooms = [
    {
      id: 1,
      name: "Deluxe Oda",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070",
      price: "2.500",
      capacity: "2 Kişi",
      size: "35 m²",
      description: "Modern tasarım ve konforlu bir konaklama deneyimi",
    },
    {
      id: 2,
      name: "Suite Oda",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074",
      price: "4.500",
      capacity: "4 Kişi",
      size: "65 m²",
      description: "Geniş ve lüks yaşam alanı, ayrı oturma odası",
    },
    {
      id: 3,
      name: "Presidential Suite",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
      price: "8.500",
      capacity: "6 Kişi",
      size: "120 m²",
      description: "Özel hizmet, panoramik manzara ve tam lüks",
    },
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-serif font-semibold mb-2">
                  {room.name}
                </h3>
                <p className="text-gray-600 mb-4">{room.description}</p>
                
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

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-[--primary]">
                      ₺{room.price}
                    </span>
                    <span className="text-gray-600 text-sm">{t('perNight')}</span>
                  </div>
                  <Link
                    href={{
                      pathname: '/odalar/[id]',
                      params: { id: room.id.toString() }
                    }}
                    className="bg-[--primary] hover:bg-[--primary-dark] text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {t('details')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/odalar" className="btn-primary">
            {t('viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;
