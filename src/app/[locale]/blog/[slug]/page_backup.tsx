import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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
      title: "Blog Yazısı Bulunamadı - Romee Hotel",
    };
  }

  const title = (post.title as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.title as unknown as MultiLangText).tr;
  const excerpt = (post.excerpt as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.excerpt as unknown as MultiLangText).tr;

  return {
    title: `${title} - Romee Hotel`,
    description: excerpt,
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    notFound();
  }

  const title = (post.title as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.title as unknown as MultiLangText).tr;
  const excerpt = (post.excerpt as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.excerpt as unknown as MultiLangText).tr;
  const content = (post.content as unknown as MultiLangText)[locale as keyof MultiLangText] || (post.content as unknown as MultiLangText).tr;

  return (
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
                <span>{post.readTime} dk</span>
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
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-[--primary] hover:underline mb-8"
            >
              <ArrowLeft size={20} />
              Blog&apos;a Dön
            </Link>

            {/* Excerpt */}
            <div className="bg-gray-50 border-l-4 border-[--primary] p-6 mb-8">
              <p className="text-lg text-gray-700 italic">{excerpt}</p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Bu Yazıyı Paylaş</h3>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                  Facebook
                </button>
                <button className="bg-sky-500 text-white px-6 py-2 rounded hover:bg-sky-600 transition">
                  Twitter
                </button>
                <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
