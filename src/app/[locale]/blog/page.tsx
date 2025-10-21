import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import {getTranslations} from 'next-intl/server';
import blogData from '@/data/blog-posts.json';

interface MultiLangText {
  tr: string;
  en: string;
  de: string;
  ru: string;
  pl: string;
}

export const metadata: Metadata = {
  title: "Blog",
  description: "Seyahat ipuçları, otel haberleri ve konaklamayla ilgili faydalı bilgiler. Kemer Residence blog yazılarını keşfedin.",
  keywords: ["otel blog", "seyahat", "konaklama ipuçları", "istanbul", "turizm"],
  openGraph: {
    title: "Blog - Kemer Residence",
    description: "Seyahat ipuçları ve otel haberlerimiz",
    url: '/blog',
    images: [
      {
        url: '/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Kemer Residence Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Kemer Residence',
    description: 'Seyahat ipuçları ve otel haberlerimiz',
  },
  alternates: {
    canonical: '/tr/blog',
    languages: {
      'tr': '/tr/blog',
      'en': '/en/blog',
      'de': '/de/blog',
      'ru': '/ru/blog',
      'pl': '/pl/blog',
    },
  },
};

function getBlogPosts() {
  console.log('� Loading blog posts from JSON...');
  return blogData.posts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const blogPosts = getBlogPosts();
  const t = await getTranslations('blog');
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073"
          alt="Blog"
          fill
          className="object-cover"
        />
        <div className="container-custom relative z-20 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-xl">{t('subtitle')}</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding">
        <div className="container-custom">
          {blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{t('viewAll')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => {
                const title = (post.title as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.title as unknown as MultiLangText).tr;
                const excerpt = (post.excerpt as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.excerpt as unknown as MultiLangText).tr;
                const slug = (post.slug as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.slug as unknown as MultiLangText).tr;
                
                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-56">
                      <Image
                        src={post.image}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[--primary] text-white px-3 py-1 rounded text-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(post.publishedAt).toLocaleDateString(locale)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{post.readTime} {t('readTime')}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-serif font-semibold mb-2 hover:text-[--primary] transition-colors">
                        <Link href={{
                          pathname: '/blog/[slug]',
                          params: { slug }
                        }}>{title}</Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-4">{excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User size={14} />
                          <span>{post.author}</span>
                        </div>
                        <Link
                          href={{
                            pathname: '/blog/[slug]',
                            params: { slug }
                          }}
                          className="text-[--primary] font-medium hover:underline flex items-center gap-1"
                        >
                          {t('readMore')}
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
