"use client";

import { Link } from "@/i18n/routing";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Wifi,
  UtensilsCrossed,
  ParkingCircle,
  Dumbbell,
  Sparkles,
  Headset,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  const [siteName, setSiteName] = useState<Record<string, string>>({});
  const [siteDescription, setSiteDescription] = useState<Record<string, string>>({});
  const [contactAddress, setContactAddress] = useState<Record<string, string>>({});
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.siteName && typeof data.siteName === 'object') {
          setSiteName(data.siteName as Record<string, string>);
        }
        if (data.siteDescription && typeof data.siteDescription === 'object') {
          setSiteDescription(data.siteDescription as Record<string, string>);
        }
        if (data.contactAddress && typeof data.contactAddress === 'object') {
          setContactAddress(data.contactAddress as Record<string, string>);
        }
        if (typeof data.contactEmail === 'string') {
          setContactEmail(data.contactEmail);
        }
        if (typeof data.contactPhone === 'string') {
          setContactPhone(data.contactPhone);
        }
        setSocialLinks({
          facebook: typeof data.socialFacebook === 'string' ? data.socialFacebook : '',
          instagram: typeof data.socialInstagram === 'string' ? data.socialInstagram : '',
          twitter: typeof data.socialTwitter === 'string' ? data.socialTwitter : '',
        });
      })
      .catch(() => {
        // Keep defaults when settings cannot be loaded
      });
  }, []);

  const fallbackSiteName = "Kemer Residence";
  const localizedSiteName = siteName[locale] || siteName.tr || fallbackSiteName;
  const localizedDescription =
    siteDescription[locale] || siteDescription.tr || t('description');
  const fallbackAddress = "Örnek Mahallesi, No: 123\nİstanbul, Türkiye";
  const localizedAddress =
    contactAddress[locale] || contactAddress.tr || fallbackAddress;
  const addressLines = localizedAddress.split('\n').filter(Boolean);
  const displayedPhone = contactPhone || "+90 212 XXX XX XX";
  const displayedEmail = contactEmail || "info@kemerresidence.com";

  const facebookUrl = socialLinks.facebook || "#";
  const instagramUrl = socialLinks.instagram || "#";
  const twitterUrl = socialLinks.twitter || "#";

  const services = [
    { key: 'servicesList.wifi', icon: Wifi },
    { key: 'servicesList.restaurant', icon: UtensilsCrossed },
    { key: 'servicesList.parking', icon: ParkingCircle },
    { key: 'servicesList.fitness', icon: Dumbbell },
    { key: 'servicesList.spa', icon: Sparkles },
    { key: 'servicesList.reception', icon: Headset },
  ];
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-serif text-xl mb-4">{localizedSiteName}</h3>
            <p className="text-sm mb-4">
              {localizedDescription}
            </p>
            <div className="flex space-x-4">
              <a
                href={facebookUrl}
                target={facebookUrl === '#' ? undefined : '_blank'}
                rel={facebookUrl === '#' ? undefined : 'noreferrer'}
                className="hover:text-[--accent] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href={instagramUrl}
                target={instagramUrl === '#' ? undefined : '_blank'}
                rel={instagramUrl === '#' ? undefined : 'noreferrer'}
                className="hover:text-[--accent] transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={twitterUrl}
                target={twitterUrl === '#' ? undefined : '_blank'}
                rel={twitterUrl === '#' ? undefined : 'noreferrer'}
                className="hover:text-[--accent] transition-colors"
              >
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
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <li key={service.key} className="flex items-center gap-2 text-gray-300">
                    <Icon size={18} className="text-[--accent]" aria-hidden="true" />
                    <span>{t(service.key as Parameters<typeof t>[0])}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-serif text-xl mb-4">{t('contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>
                  {addressLines.map((line, index) => (
                    <span key={index} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span>{displayedPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>{displayedEmail}</span>
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
