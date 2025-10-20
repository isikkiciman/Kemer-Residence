"use client";

import { Wifi, Coffee, Car, Dumbbell, Waves, Clock } from "lucide-react";
import { useTranslations } from 'next-intl';

const Features = () => {
  const t = useTranslations('features');
  const features = [
    {
      icon: Wifi,
      title: t('wifi.title'),
      description: t('wifi.description'),
    },
    {
      icon: Coffee,
      title: t('restaurant.title'),
      description: t('restaurant.description'),
    },
    {
      icon: Car,
      title: t('parking.title'),
      description: t('parking.description'),
    },
    {
      icon: Dumbbell,
      title: t('fitness.title'),
      description: t('fitness.description'),
    },
    {
      icon: Waves,
      title: t('spa.title'),
      description: t('spa.description'),
    },
    {
      icon: Clock,
      title: t('reception.title'),
      description: t('reception.description'),
    },
  ];

  return (
    <section className="section-padding bg-[--secondary]">
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
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[--primary] rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
