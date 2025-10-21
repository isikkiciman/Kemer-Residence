export default function BlogDetailPage() {import { notFound } from "next/navigation";import { notFound } from "next/navigation";import type { Metadata } from "next";import type { Metadata } from "next";import type { Metadata } from "next";

  return (

    <div className="min-h-screen">import blogData from '@/data/blog-posts.json';

      <div className="container mx-auto px-4 py-8">

        <h1 className="text-4xl font-bold mb-6">Blog Detay</h1>import blogData from '@/data/blog-posts.json';

        <p>Blog detay sayfası yakında güncellenecek...</p>

      </div>interface PageProps {

    </div>

  );  params: Promise<{import Image from "next/image";

}
    locale: string;

    slug: string;interface PageProps {

  }>;

}  params: Promise<{import { Link } from "@/i18n/routing";import Image from "next/image";import Image from "next/image";



export default async function BlogDetailPage({ params }: PageProps) {    locale: string;

  const { locale, slug } = await params;

      slug: string;import { Calendar, User, Clock, ArrowLeft } from "lucide-react";

  // JSON dosyasından blog postunu bul

  const post = blogData.posts.find(p => {  }>;

    const postSlug = p.slug as any;

    return postSlug[locale] === slug;}import { notFound } from "next/navigation";import { Link } from "@/i18n/routing";import { Link } from "@/i18n/routing";

  });

  

  if (!post) {

    notFound();export default async function BlogDetailPage({ params }: PageProps) {import Header from "@/components/Header";

  }

  const { locale, slug } = await params;

  const title = (post.title as any)[locale] || (post.title as any).tr;

  const content = (post.content as any)[locale] || (post.content as any).tr;  import BlogLanguageSwitcher from "@/components/BlogLanguageSwitcher";import { Calendar, User, Clock, ArrowLeft } from "lucide-react";import { Calendar, User, Clock, ArrowLeft } from "lucide-react";



  return (  // JSON dosyasından blog postunu bul

    <div className="min-h-screen">

      <div className="container mx-auto px-4 py-8">  const post = blogData.posts.find(p => p.slug[locale as keyof typeof p.slug] === slug);import BlogPostSchema from "@/components/schema/BlogPostSchema";

        <h1 className="text-4xl font-bold mb-6">{title}</h1>

        <div className="prose max-w-none">  

          {content.split('\\n').map((paragraph: string, index: number) => (

            <p key={index} className="mb-4">{paragraph}</p>  if (!post) {import { getTranslations } from 'next-intl/server';import { notFound } from "next/navigation";import { prisma } from "@/lib/prisma";

          ))}

        </div>    notFound();

      </div>

    </div>  }import blogData from '@/data/blog-posts.json';

  );

}

  const title = post.title[locale as keyof typeof post.title] || post.title.tr;import Header from "@/components/Header";import { notFound } from "next/navigation";

  const content = post.content[locale as keyof typeof post.content] || post.content.tr;

interface MultiLangText {

  return (

    <div className="min-h-screen">  tr: string;import BlogLanguageSwitcher from "@/components/BlogLanguageSwitcher";import Header from "@/components/Header";

      <div className="container mx-auto px-4 py-8">

        <h1 className="text-4xl font-bold mb-6">{title}</h1>  en: string;

        <div className="prose max-w-none">

          {content.split('\n').map((paragraph, index) => (  de: string;import BlogPostSchema from "@/components/schema/BlogPostSchema";import BlogLanguageSwitcher from "@/components/BlogLanguageSwitcher";

            <p key={index} className="mb-4">{paragraph}</p>

          ))}  ru: string;

        </div>

      </div>  pl: string;import { getTranslations } from 'next-intl/server';import BlogPostSchema from "@/components/schema/BlogPostSchema";

    </div>

  );}

}
import blogData from '@/data/blog-posts.json';import {getTranslations} from 'next-intl/server';

interface PageProps {

  params: Promise<{

    locale: string;

    slug: string;interface MultiLangText {interface MultiLangText {

  }>;

}  tr: string;  tr: string;



async function getBlogPost(slug: string, locale: string) {  en: string;  en: string;

  try {

    const post = blogData.posts.find(p => p.slug[locale as keyof typeof p.slug] === slug);  de: string;  de: string;

    

    if (!post) {  ru: string;  ru: string;

      return null;

    }  pl: string;  pl: string;



    return {}}

      id: post.id,

      slug: post.slug,

      title: post.title,

      excerpt: post.excerpt,interface PageProps {interface PageProps {

      content: post.content,

      image: post.image,  params: Promise<{  params: Promise<{

      author: post.author,

      category: post.category,    locale: string;    locale: string;

      readTime: post.readTime,

      publishedAt: post.publishedAt,    slug: string;    slug: string;

      seoTitle: post.seoTitle || post.title,

      seoDescription: post.seoDescription || post.excerpt,  }>;  }>;

      tags: post.tags || []

    };}}

  } catch (error) {

    console.error("Error fetching blog post:", error);

    return null;

  }async function getBlogPost(slug: string, locale: string) {import type { Metadata } from "next";

}

  try {import Image from "next/image";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {

  const { locale, slug } = await params;    // JSON dosyasından blog postunu bulimport { Link } from "@/i18n/routing";

  const post = await getBlogPost(slug, locale);

    const post = blogData.posts.find(p => p.slug[locale as keyof typeof p.slug] === slug);import { Calendar, User, Clock, ArrowLeft } from "lucide-react";

  if (!post) {

    return {    import { notFound } from "next/navigation";

      title: "Blog Yazısı Bulunamadı",

    };    if (!post) {import Header from "@/components/Header";

  }

      return null;import BlogLanguageSwitcher from "@/components/BlogLanguageSwitcher";

  const title = post.title[locale as keyof MultiLangText] || post.title.tr;

  const excerpt = post.excerpt[locale as keyof MultiLangText] || post.excerpt.tr;    }import BlogPostSchema from "@/components/schema/BlogPostSchema";



  return {import {getTranslations} from 'next-intl/server';

    title: title,

    description: excerpt,    return {import blogData from '@/data/blog-posts.json';

    openGraph: {

      title: `${title} - Kemer Residence`,      id: post.id,

      description: excerpt,

      images: [{ url: post.image, width: 1200, height: 630, alt: title }],      slug: post.slug,interface MultiLangText {

    },

  };      title: post.title,  tr: string;

}

      excerpt: post.excerpt,  en: string;

export default async function BlogDetailPage({ params }: PageProps) {

  const { locale, slug } = await params;      content: post.content,  de: string;

  const post = await getBlogPost(slug, locale);

  const t = await getTranslations('blog');      image: post.image,  ru: string;



  if (!post) {      author: post.author,  pl: string;

    notFound();

  }      category: post.category,}



  const title = post.title[locale as keyof MultiLangText] || post.title.tr;      readTime: post.readTime,

  const excerpt = post.excerpt[locale as keyof MultiLangText] || post.excerpt.tr;

  const content = post.content[locale as keyof MultiLangText] || post.content.tr;      publishedAt: post.publishedAt,interface PageProps {



  return (      seoTitle: post.seoTitle || post.title,  params: Promise<{

    <>

      <BlogPostSchema      seoDescription: post.seoDescription || post.excerpt,    locale: string;

        title={title}

        description={excerpt}      tags: post.tags || []    slug: string;

        image={post.image}

        author={post.author}    };  }>;

        publishedAt={post.publishedAt}

        updatedAt={post.publishedAt}  } catch (error) {}

        url={`https://www.kemerresidence.com/${locale}/blog/${slug}`}

      />    console.error("Error fetching blog post:", error);

      <Header languageSwitcher={<BlogLanguageSwitcher slugs={post.slug} />} />

      <div className="min-h-screen">    return null;async function getBlogPost(slug: string, locale: string) {

        <section className="relative h-[500px] flex items-center justify-center">

          <div className="absolute inset-0 bg-black/50 z-10"></div>  }  try {

          <Image

            src={post.image}}    // JSON dosyasından blog postunu bul

            alt={title}

            fill    const post = blogData.posts.find(p => p.slug[locale as keyof typeof p.slug] === slug);

            className="object-cover"

          />export async function generateMetadata({ params }: PageProps): Promise<Metadata> {    

          <div className="container-custom relative z-20 text-center text-white">

            <div className="max-w-4xl mx-auto">  const { locale, slug } = await params;    if (!post) {

              <div className="mb-4">

                <span className="bg-[--primary] px-4 py-2 rounded text-sm font-medium">  const post = await getBlogPost(slug, locale);      return null;

                  {post.category}

                </span>    }

              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">  if (!post) {

                {title}

              </h1>    return {    return {

              <div className="flex items-center justify-center gap-6 text-sm">

                <div className="flex items-center gap-2">      title: "Blog Yazısı Bulunamadı",      id: post.id,

                  <User size={16} />

                  <span>{post.author}</span>    };      slug: post.slug,

                </div>

                <div className="flex items-center gap-2">  }      title: post.title,

                  <Calendar size={16} />

                  <span>{new Date(post.publishedAt).toLocaleDateString(locale)}</span>      excerpt: post.excerpt,

                </div>

                <div className="flex items-center gap-2">  const title = post.title[locale as keyof MultiLangText] || post.title.tr;      content: post.content,

                  <Clock size={16} />

                  <span>{post.readTime}</span>  const excerpt = post.excerpt[locale as keyof MultiLangText] || post.excerpt.tr;      image: post.image,

                </div>

              </div>      author: post.author,

            </div>

          </div>  return {      category: post.category,

        </section>

    title: title,      readTime: post.readTime,

        <section className="section-padding">

          <div className="container-custom">    description: excerpt,      publishedAt: post.publishedAt,

            <div className="max-w-4xl mx-auto">

              <Link    keywords: ["blog", "otel", "seyahat", "konaklama", title],      seoTitle: post.seoTitle || post.title,

                href="/blog"

                className="inline-flex items-center gap-2 text-[--primary] hover:underline mb-8"    authors: [{ name: post.author }],      seoDescription: post.seoDescription || post.excerpt,

              >

                <ArrowLeft size={20} />    openGraph: {      tags: post.tags || []

                Blog'a Dön

              </Link>      title: `${title} - Kemer Residence`,    };



              <div className="bg-gray-50 border-l-4 border-[--primary] p-6 mb-8">      description: excerpt,        active: true,

                <p className="text-lg text-gray-700 italic">{excerpt}</p>

              </div>      url: `/blog/${slug}`,      },



              <article className="prose prose-lg max-w-none">      type: 'article',    });

                {content.split("\\n").map((paragraph, index) => (

                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">      publishedTime: post.publishedAt,

                    {paragraph}

                  </p>      authors: [post.author],    // Slug'a göre post bul

                ))}

              </article>      images: [    const post = posts.find((p) => {

            </div>

          </div>        {      const postSlug = p.slug as unknown as MultiLangText;

        </section>

      </div>          url: post.image,      return postSlug[locale as keyof MultiLangText] === slug;

    </>

  );          width: 1200,    });

}
          height: 630,

          alt: title,    return post || null;

        },  } catch (error) {

      ],    console.error("Error fetching blog post:", error);

    },    return null;

    twitter: {  }

      card: 'summary_large_image',}

      title: title,

      description: excerpt,export async function generateMetadata({ params }: PageProps): Promise<Metadata> {

      images: [post.image],  const { locale, slug } = await params;

    },  const post = await getBlogPost(slug, locale);

    alternates: {

      canonical: `/${locale}/blog/${slug}`,  if (!post) {

      languages: {    return {

        'tr': `/tr/blog/${post.slug.tr}`,      title: "Blog Yazısı Bulunamadı",

        'en': `/en/blog/${post.slug.en}`,    };

        'de': `/de/blog/${post.slug.de}`,  }

        'ru': `/ru/blog/${post.slug.ru}`,

        'pl': `/pl/blog/${post.slug.pl}`,  const title = (post.title as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.title as unknown as MultiLangText).tr;

      },  const excerpt = (post.excerpt as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.excerpt as unknown as MultiLangText).tr;

    },  const slugData = post.slug as unknown as MultiLangText;

  };

}  return {

    title: title,

export default async function BlogDetailPage({ params }: PageProps) {    description: excerpt,

  const { locale, slug } = await params;    keywords: ["blog", "otel", "seyahat", "konaklama", title],

  const post = await getBlogPost(slug, locale);    authors: [{ name: post.author }],

  const t = await getTranslations('blog');    openGraph: {

      title: `${title} - Kemer Residence`,

  if (!post) {      description: excerpt,

    notFound();      url: `/blog/${slug}`,

  }      type: 'article',

      publishedTime: post.publishedAt.toISOString(),

  const title = post.title[locale as keyof MultiLangText] || post.title.tr;      modifiedTime: post.updatedAt.toISOString(),

  const excerpt = post.excerpt[locale as keyof MultiLangText] || post.excerpt.tr;      authors: [post.author],

  const content = post.content[locale as keyof MultiLangText] || post.content.tr;      images: [

        {

  return (          url: post.image,

    <>          width: 1200,

      <BlogPostSchema          height: 630,

        title={title}          alt: title,

        description={excerpt}        },

        image={post.image}      ],

        author={post.author}    },

        publishedAt={post.publishedAt}    twitter: {

        updatedAt={post.publishedAt}      card: 'summary_large_image',

        url={`https://www.kemerresidence.com/${locale}/blog/${slug}`}      title: title,

      />      description: excerpt,

      <Header languageSwitcher={<BlogLanguageSwitcher slugs={post.slug} />} />      images: [post.image],

      <div className="min-h-screen">    },

        {/* Hero Section */}    alternates: {

        <section className="relative h-[500px] flex items-center justify-center">      canonical: `/${locale}/blog/${slug}`,

          <div className="absolute inset-0 bg-black/50 z-10"></div>      languages: {

          <Image        'tr': `/tr/blog/${slugData.tr}`,

            src={post.image}        'en': `/en/blog/${slugData.en}`,

            alt={title}        'de': `/de/blog/${slugData.de}`,

            fill        'ru': `/ru/blog/${slugData.ru}`,

            className="object-cover"        'pl': `/pl/blog/${slugData.pl}`,

          />      },

          <div className="container-custom relative z-20 text-center text-white">    },

            <div className="max-w-4xl mx-auto">  };

              <div className="mb-4">}

                <span className="bg-[--primary] px-4 py-2 rounded text-sm font-medium">

                  {post.category}export default async function BlogDetailPage({ params }: PageProps) {

                </span>  const { locale, slug } = await params;

              </div>  const post = await getBlogPost(slug, locale);

              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">  const t = await getTranslations('blog');

                {title}

              </h1>  if (!post) {

              <div className="flex items-center justify-center gap-6 text-sm">    notFound();

                <div className="flex items-center gap-2">  }

                  <User size={16} />

                  <span>{post.author}</span>  const title = (post.title as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.title as unknown as MultiLangText).tr;

                </div>  const excerpt = (post.excerpt as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.excerpt as unknown as MultiLangText).tr;

                <div className="flex items-center gap-2">  const content = (post.content as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.content as unknown as MultiLangText).tr;

                  <Calendar size={16} />  const slugs = post.slug as unknown as MultiLangText;

                  <span>{new Date(post.publishedAt).toLocaleDateString(locale)}</span>

                </div>  return (

                <div className="flex items-center gap-2">    <>

                  <Clock size={16} />      <BlogPostSchema

                  <span>{post.readTime} {t('readTime')}</span>        title={title}

                </div>        description={excerpt}

              </div>        image={post.image}

            </div>        author={post.author}

          </div>        publishedAt={post.publishedAt.toISOString()}

        </section>        updatedAt={post.updatedAt.toISOString()}

        url={`https://www.kemerresidence.com/${locale}/blog/${slug}`}

        {/* Content */}      />

        <section className="section-padding">      <Header languageSwitcher={<BlogLanguageSwitcher slugs={slugs} />} />

          <div className="container-custom">      <div className="min-h-screen">

            <div className="max-w-4xl mx-auto">        {/* Hero Section */}

              {/* Back Button */}        <section className="relative h-[500px] flex items-center justify-center">

              <Link          <div className="absolute inset-0 bg-black/50 z-10"></div>

                href="/blog"          <Image

                className="inline-flex items-center gap-2 text-[--primary] hover:underline mb-8"            src={post.image}

              >            alt={title}

                <ArrowLeft size={20} />            fill

                {t('backToBlog')}            className="object-cover"

              </Link>          />

          <div className="container-custom relative z-20 text-center text-white">

              {/* Excerpt */}            <div className="max-w-4xl mx-auto">

              <div className="bg-gray-50 border-l-4 border-[--primary] p-6 mb-8">              <div className="mb-4">

                <p className="text-lg text-gray-700 italic">{excerpt}</p>                <span className="bg-[--primary] px-4 py-2 rounded text-sm font-medium">

              </div>                  {post.category}

                </span>

              {/* Content */}              </div>

              <article className="prose prose-lg max-w-none" aria-labelledby="article-title">              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">

                {content.split("\n").map((paragraph, index) => (                {title}

                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">              </h1>

                    {paragraph}              <div className="flex items-center justify-center gap-6 text-sm">

                  </p>                <div className="flex items-center gap-2">

                ))}                  <User size={16} />

              </article>                  <span>{post.author}</span>

                </div>

              {/* Related Posts - Future Feature */}                <div className="flex items-center gap-2">

              <div className="mt-12 pt-8 border-t border-gray-200">                  <Calendar size={16} />

                <h3 className="text-2xl font-semibold mb-6">{t('relatedPosts')}</h3>                  <span>{new Date(post.publishedAt).toLocaleDateString(locale)}</span>

                <p className="text-gray-600">{t('morePostsComing')}</p>                </div>

              </div>                <div className="flex items-center gap-2">

            </div>                  <Clock size={16} />

          </div>                  <span>{post.readTime} {t('readTime')}</span>

        </section>                </div>

      </div>              </div>

    </>            </div>

  );          </div>

}        </section>

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
