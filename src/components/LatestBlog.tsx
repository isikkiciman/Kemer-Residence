import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { getAllBlogPosts } from "@/lib/blogData";

function getLocalizedValue(
  value: Record<string, string> | undefined,
  locale: string,
  fallbackLocale = "tr"
): string {
  if (!value) {
    return "";
  }

  return (
    value[locale] ??
    value[fallbackLocale] ??
    Object.values(value).find((item) => Boolean(item)) ??
    ""
  );
}

const LatestBlog = async () => {
  const t = await getTranslations("blog");
  const commonT = await getTranslations("common");
  const locale = await getLocale();

  const posts = (await getAllBlogPosts())
    .filter((post) => post.active !== false)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500">
            {commonT("noData")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const title = getLocalizedValue(post.title, locale);
              const excerpt = getLocalizedValue(post.excerpt, locale);
              const mainImage =
                post.images?.find((image) => image.isMain)?.url || post.image;
              const mainAlt =
                post.images?.find((image) => image.isMain)?.alt?.[locale] || title;
              const slug =
                getLocalizedValue(post.slug, locale) ||
                post.slug?.tr ||
                post.slug?.en ||
                post.id;
              const publishedDate = new Date(post.publishedAt).toLocaleDateString(
                locale,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

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
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{publishedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{post.author || "Kemer Residence"}</span>
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

                    <Link
                      href={{
                        pathname: "/blog/[slug]",
                        params: { slug },
                      }}
                      className="text-[--primary] font-medium hover:underline"
                    >
                      {t("readMore")}
                      <span className="ml-1">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/blog" className="btn-primary">
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;
