import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['tr', 'en', 'de', 'ru', 'pl'],
 
  // Used when no locale matches
  defaultLocale: 'tr',
  
  // Always show locale prefix (including /tr for Turkish)
  localePrefix: 'always',
  
  // Detect locale from Accept-Language header
  localeDetection: true,
  
  // Localized pathnames
  pathnames: {
    '/': '/',
    '/odalar': {
      tr: '/odalar',
      en: '/rooms',
      de: '/zimmer',
      ru: '/nomera',
      pl: '/pokoje'
    },
    '/odalar/[id]': {
      tr: '/odalar/[id]',
      en: '/rooms/[id]',
      de: '/zimmer/[id]',
      ru: '/nomera/[id]',
      pl: '/pokoje/[id]'
    },
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/galeri': {
      tr: '/galeri',
      en: '/gallery',
      de: '/galerie',
      ru: '/galereya',
      pl: '/galeria'
    },
    '/hakkimizda': {
      tr: '/hakkimizda',
      en: '/about',
      de: '/uber-uns',
      ru: '/o-nas',
      pl: '/o-nas'
    },
    '/iletisim': {
      tr: '/iletisim',
      en: '/contact',
      de: '/kontakt',
      ru: '/kontakty',
      pl: '/kontakt'
    },
    '/rezervasyon': {
      tr: '/rezervasyon',
      en: '/reservation',
      de: '/reservierung',
      ru: '/rezervaciya',
      pl: '/rezerwacja'
    }
  }
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
