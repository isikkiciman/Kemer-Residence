import { MetadataRoute } from 'next';
import blogData from '@/data/blog-posts.json';

const baseUrl = 'https://www.kemerresidence.com';
const locales = ['tr', 'en', 'de', 'ru', 'pl'];

interface MultiLangText {
  tr: string;
  en: string;
  de: string;
  ru: string;
  pl: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  const staticPages = [
    '',
    '/odalar',
    '/blog',
    '/galeri',
    '/hakkimizda',
    '/iletisim',
  ];

  // Add static pages for all locales
  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '/blog' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [loc, `${baseUrl}/${loc}${page}`])
          ),
        },
      });
    });
  });

  // Add blog posts
  try {
    blogData.posts.forEach((post) => {
      locales.forEach((locale) => {
        const slug = post.slug[locale as keyof MultiLangText] || '';
        
        if (slug) {
          sitemap.push({
            url: `${baseUrl}/${locale}/blog/${slug}`,
            lastModified: new Date(post.publishedAt),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
              languages: Object.fromEntries(
                locales.map((loc) => {
                  const localeSlug = post.slug?.[loc as keyof MultiLangText] || slug;
                  return [loc, `${baseUrl}/${loc}/blog/${localeSlug}`];
                })
              ),
            },
          });
        }
      });
    });
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return sitemap;
}
