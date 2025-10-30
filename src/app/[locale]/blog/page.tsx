import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getAllBlogPosts } from "@/lib/blogData";
import type { MultilingualText } from "@/lib/blogData";

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

function getLocalizedValue(
  value: MultilingualText | Partial<MultilingualText> | undefined,
  locale: string,
  fallbackLocale = "tr"
): string {
  if (!value) {
    return "";
  }

  const localized = (value as Record<string, string>)[locale];
  if (localized && localized.trim()) {
    return localized;
  }

  const fallback = (value as Record<string, string>)[fallbackLocale];
  if (fallback && fallback.trim()) {
    return fallback;
  }

  const anyValue = Object.values(value).find((entry) => entry?.trim());
  return anyValue ?? "";
}

function formatReadTime(readTime: string | undefined, suffix: string): string {
  if (!readTime) {
    return suffix;
  }

  const normalized = readTime.toLowerCase();
  const normalizedSuffix = suffix.toLowerCase();

  if (normalized.includes(normalizedSuffix)) {
    return readTime;
  }

  return `${readTime} ${suffix}`.trim();
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("blog");

  const blogPosts = (await getAllBlogPosts())
    .filter((post) => post.active !== false)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );
  
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const title = getLocalizedValue(post.title, locale);
              const excerpt = getLocalizedValue(post.excerpt, locale);
              const slug =
                getLocalizedValue(post.slug, locale) ||
                post.slug?.tr ||
                post.slug?.en ||
                post.id;
              const mainImage =
                post.images?.find((image) => image.isMain)?.url || post.image;
              const mainAlt =
                post.images?.find((image) => image.isMain)?.alt?.[locale] || title;
              const publishedDate = new Date(post.publishedAt).toLocaleDateString(
                locale,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );
              const readTime = formatReadTime(post.readTime, t("readTime"));

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-56">
                    <Image
                      src={mainImage}
                      alt={mainAlt || title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
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
                        <span>{publishedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-serif font-semibold mb-2 hover:text-[--primary] transition-colors">
                      <Link
                        href={{
                          pathname: "/blog/[slug]",
                          params: { slug },
                        }}
                      >
                        {title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4">{excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <Link
                        href={{
                          pathname: "/blog/[slug]",
                          params: { slug },
                        }}
                        className="text-[--primary] font-medium hover:underline flex items-center gap-1"
                      >
                        {t("readMore")}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
        </div>
      </section>
    </div>
  );
}
