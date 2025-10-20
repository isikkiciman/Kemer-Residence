"use client";

import { Link } from "@/i18n/routing";
import { useState, useEffect, ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  languageSwitcher?: ReactNode;
}

const Header = ({ languageSwitcher }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/logo.svg");
  const t = useTranslations('nav');

  useEffect(() => {
    // Fetch logo URL from settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      })
      .catch(() => {
        // Keep default logo on error
      });
  }, []);

  const LanguageSwitcherComponent = languageSwitcher || <LanguageSwitcher />;

  const navLinks = [
    { href: "/" as const, label: t('home') },
    { href: "/odalar" as const, label: t('rooms') },
    { href: "/blog" as const, label: t('blog') },
    { href: "/galeri" as const, label: t('gallery') },
    { href: "/hakkimizda" as const, label: t('about') },
    { href: "/iletisim" as const, label: t('contact') },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src={logoUrl} 
              alt="Kemer Residence Hotel" 
              width={60}
              height={24}
              className="!h-6 !w-auto !max-h-6 max-w-[80px] object-contain"
              style={{ maxHeight: '24px' }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/rezervasyon" className="btn-primary text-sm lg:text-base ml-2">
              {t('reservation')}
            </Link>
            {LanguageSwitcherComponent}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {LanguageSwitcherComponent}
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-[--primary] transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/rezervasyon" className="btn-primary text-center">
                {t('reservation')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
