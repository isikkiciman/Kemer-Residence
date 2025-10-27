import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  BlogPost,
  createBlogPost,
  formatReadTime,
  generateBlogId,
  getAllBlogPosts,
} from "@/lib/blogData";

const supportedLocales = ["tr", "en", "de", "ru", "pl"] as const;

// GET - Tüm blog yazılarını getir
export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Blog yazıları yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// POST - Yeni blog yazısı ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.title || !body?.slug || !body?.content || !body?.excerpt) {
      return NextResponse.json(
        { error: "Lütfen tüm zorunlu alanları doldurun" },
        { status: 400 }
      );
    }

    const id = body.id ?? generateBlogId();
    const publishedAt = body.publishedAt ?? new Date().toISOString();
    const readTime = formatReadTime(body.readTime ?? "5 dk");

    const newPost: BlogPost = {
      id,
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image,
      author: body.author || "Kemer Residence",
      category: body.category || "Genel",
      readTime,
      publishedAt,
      active: body.active ?? true,
      tags: body.tags ?? [],
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      seoKeywords: body.seoKeywords,
      externalLink: body.externalLink,
      externalLinkTitle: body.externalLinkTitle,
      images: body.images ?? [],
    };

    await createBlogPost(newPost);

    // Blog sayfalarını yeniden doğrula
    supportedLocales.forEach((locale) => {
      revalidatePath(`/${locale}/blog`);
      revalidatePath(`/${locale}`);
      const localizedSlug = newPost.slug?.[locale];
      if (localizedSlug) {
        revalidatePath(`/${locale}/blog/${localizedSlug}`);
      }
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Blog yazısı eklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
