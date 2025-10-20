import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Tüm blog yazılarını getir
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        publishedAt: "desc",
      },
    });
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
    const {
      title,
      excerpt,
      content,
      author,
      category,
      image,
      slug,
      seoTitle,
      seoDescription,
      seoKeywords,
      externalLink,
      externalLinkTitle,
      images,
      readTime = 5,
      active = true,
    } = body;

    const post = await prisma.blogPost.create({
      data: {
        title,
        excerpt,
        content,
        author,
        category,
        image,
        slug,
        seoTitle,
        seoDescription,
        seoKeywords,
        externalLink,
        externalLinkTitle,
        images,
        readTime: readTime.toString(),
        active,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Blog yazısı eklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
