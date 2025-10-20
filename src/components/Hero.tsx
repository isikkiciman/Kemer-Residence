"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

const Hero = () => {
  const t = useTranslations('hero');
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070");

  useEffect(() => {
    // Fetch banner URL from settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.bannerUrl) {
          setBannerUrl(data.bannerUrl);
        }
      })
      .catch(() => {
        // Keep default banner on error
      });
  }, []);
  
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <Image
        src={bannerUrl}
        alt="Kemer Residence Banner"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
      />
      
      <div className="container-custom relative z-20 text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-4 md:mb-6">
          {t('title')}
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link href="/odalar" className="btn-primary inline-flex items-center justify-center gap-2">
            {t('exploreRooms')}
            <ArrowRight size={20} />
          </Link>
          <Link href="/iletisim" className="btn-secondary inline-flex items-center justify-center gap-2">
            {t('contactUs')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
