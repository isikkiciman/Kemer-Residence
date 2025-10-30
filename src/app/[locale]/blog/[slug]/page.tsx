import Image from 'next/image';
import { Link } from "@/i18n/routing";
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft, ExternalLink } from 'lucide-react';
import {
  getBlogPostBySlug,
  type MultilingualText,
} from "@/lib/blogData";

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

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || post.active === false) {
    notFound();
  }

  const title = getLocalizedValue(post.title, locale);
  const content = getLocalizedValue(post.content, locale);
  const excerpt = getLocalizedValue(post.excerpt, locale);
  const externalLink =
    getLocalizedValue(post.externalLinkLocalized, locale) || post.externalLink || undefined;
  const externalLinkTitle =
    getLocalizedValue(post.externalLinkTitle, locale) || "Related Resource";
  const externalLinkButtonLabel =
    getLocalizedValue(post.externalLinkButton, locale) || "Kaynağa git";
  const mainImage =
    post.images?.find((image) => image.isMain)?.url || post.image;
  const mainImageAlt =
    post.images?.find((image) => image.isMain)?.alt?.[locale] || title;
  const galleryImages = (post.images ?? []).filter((image) => !image.isMain);
  
  // Tarihi formatla
  const publishDate = new Date(post.publishedAt).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src={mainImage}
          alt={mainImageAlt || title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="container-custom relative z-20 text-center text-white">
          <div className="mb-4">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Blog&apos;a Dön
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-3xl mx-auto">{excerpt}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Meta bilgiler */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readTime} okuma</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div>
                <span className="bg-[--primary] text-white px-3 py-1 rounded text-sm">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Blog içeriği */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed space-y-6">
                {content.split('\n').map((paragraph: string, index: number) => {
                  if (paragraph.trim() === '') return null;
                  
                  // Başlık kontrolü (büyük harfle başlayan ve sonunda : olmayan satırlar)
                  if (paragraph.match(/^[A-ZÜÖÇĞŞ]/u) && !paragraph.includes('•') && paragraph.length < 100 && !paragraph.endsWith('.')) {
                    return (
                      <h3 key={index} className="text-2xl font-serif font-semibold text-gray-900 mt-8 mb-4">
                        {paragraph}
                      </h3>
                    );
                  }
                  
                  // Liste öğesi kontrolü
                  if (paragraph.startsWith('•')) {
                    return (
                      <li key={index} className="ml-4 text-gray-700">
                        {paragraph.substring(2)}
                      </li>
                    );
                  }
                  
                  return (
                    <p key={index} className="text-gray-700 text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            {galleryImages.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
                  Fotoğraf Galerisi
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {galleryImages.map((image) => {
                    const altText =
                      image.alt?.[locale] ||
                      Object.values(image.alt ?? {}).find((value) => value?.trim()) ||
                      title;

                    return (
                      <div
                        key={image.id}
                        className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-md"
                      >
                        <Image
                          src={image.url}
                          alt={altText}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 45vw, 90vw"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {externalLink && (
              <div className="mt-12 p-6 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{externalLinkTitle}</h3>
                    <p className="text-sm text-gray-600">
                      <a
                        href={externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[--primary] hover:underline"
                      >
                        {externalLinkButtonLabel}
                      </a>
                    </p>
                  </div>
                  <a
                    href={externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary]/90 transition-colors"
                  >
                    {externalLinkButtonLabel}
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">Etiketler:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Blog'a dön butonu */}
            <div className="mt-12 text-center">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 bg-[--primary] text-white px-6 py-3 rounded-lg hover:bg-[--primary]/90 transition-colors"
              >
                <ArrowLeft size={20} />
                Tüm Blog Yazılarını Görüntüle
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
