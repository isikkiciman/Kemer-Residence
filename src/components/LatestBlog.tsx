"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { useTranslations } from 'next-intl';

const LatestBlog = () => {
  const t = useTranslations('blog');
  const posts = [
    {
      id: 1,
      title: "İstanbul'da Gezilecek En İyi 10 Yer",
      excerpt: "İstanbul'u ziyaret edenler için mutlaka görülmesi gereken tarihi ve kültürel mekanlar...",
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071",
      date: "15 Ocak 2025",
      author: "Ayşe Yılmaz",
    },
    {
      id: 2,
      title: "Otel Konaklamasında Dikkat Edilmesi Gerekenler",
      excerpt: "Mükemmel bir tatil deneyimi için otel seçerken nelere dikkat etmelisiniz...",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070",
      date: "10 Ocak 2025",
      author: "Mehmet Demir",
    },
    {
      id: 3,
      title: "Spa ve Wellness: Kendinize Zaman Ayırın",
      excerpt: "Günlük hayatın stresinden uzaklaşmak için spa ve wellness hizmetlerinin faydaları...",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070",
      date: "5 Ocak 2025",
      author: "Zeynep Kaya",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-56">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-serif font-semibold mb-2 hover:text-[--primary] transition-colors">
                  <Link href={{
                    pathname: '/blog/[slug]',
                    params: { slug: post.id.toString() }
                  }}>{post.title}</Link>
                </h3>
                
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                
                <Link
                  href={{
                    pathname: '/blog/[slug]',
                    params: { slug: post.id.toString() }
                  }}
                  className="text-[--primary] font-medium hover:underline"
                >
                  {t('readMore')} →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog" className="btn-primary">
            {t('viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;
