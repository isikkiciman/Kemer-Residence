import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import BlogLanguageSwitcher from "@/components/BlogLanguageSwitcher";
import BlogPostSchema from "@/components/schema/BlogPostSchema";
import {getTranslations} from 'next-intl/server';

interface MultiLangText {
  tr: string;
  en: string;
  de: string;
  ru: string;
  pl: string;
}

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getBlogPost(slug: string, locale: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        active: true,
      },
    });

    // Slug'a göre post bul
    const post = posts.find((p) => {
      const postSlug = p.slug as unknown as MultiLangText;
      return postSlug[locale as keyof MultiLangText] === slug;
    });

    return post || null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    return {
      title: "Blog Yazısı Bulunamadı",
    };
  }

  const title = (post.title as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.title as unknown as MultiLangText).tr;
  const excerpt = (post.excerpt as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.excerpt as unknown as MultiLangText).tr;
  const slugData = post.slug as unknown as MultiLangText;

  return {
    title: title,
    description: excerpt,
    keywords: ["blog", "otel", "seyahat", "konaklama", title],
    authors: [{ name: post.author }],
    openGraph: {
      title: `${title} - Kemer Residence`,
      description: excerpt,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: excerpt,
      images: [post.image],
    },
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        'tr': `/tr/blog/${slugData.tr}`,
        'en': `/en/blog/${slugData.en}`,
        'de': `/de/blog/${slugData.de}`,
        'ru': `/ru/blog/${slugData.ru}`,
        'pl': `/pl/blog/${slugData.pl}`,
      },
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);
  const t = await getTranslations('blog');

  if (!post) {
    notFound();
  }

  const title = (post.title as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.title as unknown as MultiLangText).tr;
  const excerpt = (post.excerpt as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.excerpt as unknown as MultiLangText).tr;
  const content = (post.content as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.content as unknown as MultiLangText).tr;
  const slugs = post.slug as unknown as MultiLangText;

  return (
    <>
      <BlogPostSchema
        title={title}
        description={excerpt}
        image={post.image}
        author={post.author}
        publishedAt={post.publishedAt.toISOString()}
        updatedAt={post.updatedAt.toISOString()}
        url={`https://www.kemerresidence.com/${locale}/blog/${slug}`}
      />
      <Header languageSwitcher={<BlogLanguageSwitcher slugs={slugs} />} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <Image
            src={post.image}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="container-custom relative z-20 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4">
                <span className="bg-[--primary] px-4 py-2 rounded text-sm font-medium">
                  {post.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                {title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(post.publishedAt).toLocaleDateString(locale)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.readTime} {t('readTime')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[--primary] hover:underline mb-8"
              >
                <ArrowLeft size={20} />
                {t('backToBlog')}
              </Link>

              {/* Excerpt */}
              <div className="bg-gray-50 border-l-4 border-[--primary] p-6 mb-8">
                <p className="text-lg text-gray-700 italic">{excerpt}</p>
              </div>

              {/* Content */}
              <article className="prose prose-lg max-w-none" aria-labelledby="article-title">
                {content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </article>

              {/* External Link (H2) */}
              {(() => {
                const record = post as unknown as Record<string, unknown>;
                const externalLink = typeof record.externalLink === 'string' ? (record.externalLink as string) : undefined;
                const externalLinkTitleObj = record.externalLinkTitle;

                const externalTitle = ((): string | undefined => {
                  if (externalLinkTitleObj && typeof externalLinkTitleObj === 'object') {
                    const obj = externalLinkTitleObj as Record<string, string>;
                    return (obj[locale] || obj.tr);
                  }
                  return undefined;
                })();

                if (!externalLink) return null;

                return (
                  <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-3">{externalTitle || t('externalLink')}</h2>
                    <p className="mb-6">
                      <a href={externalLink} target="_blank" rel="noopener noreferrer" className="text-[--primary] hover:underline">
                        {externalLink}
                      </a>
                    </p>
                  </div>
                );
              })()}

              {/* Image Gallery */}
              {(() => {
                type ImageItem = { url: string; alt?: Record<string, string> };
                let gallery: ImageItem[] = [];
                const record = post as unknown as Record<string, unknown>;

                try {
                  const val = record.images;
                  if (Array.isArray(val)) {
                    gallery = val as ImageItem[];
                  } else if (typeof val === 'string' && val.length) {
                    gallery = JSON.parse(val) as ImageItem[];
                  } else if (record.image && typeof record.image === 'string') {
                    // fallback to single image field
                    gallery = [{ url: record.image as string }];
                  }
                } catch {
                  gallery = [];
                }

                if (!gallery || gallery.length === 0) return null;

                return (
                  <section className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Galeriden Seçimler</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {gallery.map((img, idx) => {
                        const altText = img.alt && typeof img.alt === 'object' ? (img.alt[locale] || img.alt.tr || '') : (img.alt as unknown as string) || title;
                        return (
                          <div key={idx} className="rounded overflow-hidden bg-gray-100">
                            <Image src={img.url} alt={altText} width={1200} height={800} className="object-cover w-full h-56" />
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })()}

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold mb-4">{t('sharePost')}</h3>
                <div className="flex gap-4">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                    {t('facebook')}
                  </button>
                  <button className="bg-sky-500 text-white px-6 py-2 rounded hover:bg-sky-600 transition">
                    {t('twitter')}
                  </button>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
                    {t('linkedin')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
