"use client";

import { useLocale } from 'next-intl';
import { usePathname as useNextPathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = useNextPathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [slugMap, setSlugMap] = useState<Record<string, string> | null>(null);
  const [isSlugLoading, setIsSlugLoading] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === locale);
  const pathSegments = useMemo(() => pathname?.split('/').filter(Boolean) ?? [], [pathname]);
  const isBlogDetail = pathSegments.length >= 3 && pathSegments[1] === 'blog';
  const currentSlug = isBlogDetail ? pathSegments[2] : null;

  useEffect(() => {
    if (!isBlogDetail || !currentSlug) {
      setSlugMap(null);
      return;
    }

    let isMounted = true;
    setIsSlugLoading(true);

    fetch(`/api/blog/slugs?slug=${encodeURIComponent(currentSlug)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!isMounted) return;
        setSlugMap(data?.slugs ?? null);
      })
      .catch(() => {
        if (!isMounted) return;
        setSlugMap(null);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsSlugLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isBlogDetail, currentSlug]);

  function onSelectChange(nextLocale: string) {
    if (!pathname) return;
    
    startTransition(() => {
      // Mevcut path'i al ve locale'i değiştir
      const segments = [...pathSegments];
      
      // İlk segment locale ise değiştir
      if (segments.length > 0 && ['tr', 'en', 'de', 'ru', 'pl'].includes(segments[0])) {
        segments[0] = nextLocale;
      } else {
        segments.unshift(nextLocale);
      }
      
      // Blog detay sayfası kontrolü - slug varsa ve yeni locale için karşılığı bulunursa onu kullan
      if (segments.length >= 3 && segments[1] === 'blog') {
        const localizedSlug = slugMap?.[nextLocale];
        const newPath = localizedSlug
          ? `/${nextLocale}/blog/${localizedSlug}`
          : `/${nextLocale}/blog`;
        router.push(newPath);
      } else {
        // Normal sayfa, doğrudan locale değiştir
        const newPath = '/' + segments.join('/');
        router.push(newPath);
      }
      
      setIsOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending || isSlugLoading}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Change language"
      >
        <Globe size={20} />
        <span className="hidden md:inline">{currentLanguage?.flag} {currentLanguage?.name}</span>
        <span className="md:hidden">{currentLanguage?.flag}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => onSelectChange(language.code)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                  locale === language.code ? 'bg-gray-50 font-semibold' : ''
                }`}
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
