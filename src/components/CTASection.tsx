"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';

const CTASection = () => {
  const t = useTranslations('cta');
  
  return (
    <section className="section-padding bg-gradient-to-r from-[--primary] to-[--primary-dark] text-white">
      <div className="container-custom text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
          {t('title')}
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/rezervasyon" className="bg-white text-[--primary] hover:bg-gray-100 px-8 py-3 rounded-lg transition-all duration-300 font-medium">
            {t('bookNow')}
          </Link>
          <Link href="/iletisim" className="bg-transparent border-2 border-white hover:bg-white hover:text-[--primary] px-8 py-3 rounded-lg transition-all duration-300 font-medium">
            {t('contactUs')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
