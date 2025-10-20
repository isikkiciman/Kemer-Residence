"use client";

import { Link } from "@/i18n/routing";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-serif text-xl mb-4">Kemer Residence</h3>
            <p className="text-sm mb-4">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[--accent] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-[--accent] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-[--accent] transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif text-xl mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/odalar" className="hover:text-[--accent] transition-colors">{tNav('rooms')}</Link></li>
              <li><Link href="/blog" className="hover:text-[--accent] transition-colors">{tNav('blog')}</Link></li>
              <li><Link href="/galeri" className="hover:text-[--accent] transition-colors">{tNav('gallery')}</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-[--accent] transition-colors">{tNav('about')}</Link></li>
              <li><Link href="/iletisim" className="hover:text-[--accent] transition-colors">{tNav('contact')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-serif text-xl mb-4">{t('services')}</h3>
            <ul className="space-y-2 text-sm">
              <li>{t('servicesList.wifi')}</li>
              <li>{t('servicesList.spa')}</li>
              <li>{t('servicesList.restaurant')}</li>
              <li>{t('servicesList.parking')}</li>
              <li>{t('servicesList.reception')}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-serif text-xl mb-4">{t('contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Örnek Mahallesi, No: 123<br />İstanbul, Türkiye</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span>+90 212 XXX XX XX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>info@kemerresidence.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Kemer Residence. {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
