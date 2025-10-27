import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  BlogPost,
  deleteBlogPost as removeBlogPost,
  getBlogPostById,
  updateBlogPost,
} from "@/lib/blogData";

const supportedLocales = ["tr", "en", "de", "ru", "pl"] as const;

function revalidateBlogPaths(post: BlogPost) {
  supportedLocales.forEach((locale) => {
    revalidatePath(`/${locale}/blog`);
    const localizedSlug = post.slug?.[locale];
    if (localizedSlug) {
      revalidatePath(`/${locale}/blog/${localizedSlug}`);
    }
  });
}

// GET - Tek bir blog yazısını getir
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const post = await getBlogPostById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Blog yazısı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Blog yazısı yüklenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// PUT - Blog yazısını güncelle
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updatedPost = await updateBlogPost(id, body);

    if (!updatedPost) {
      return NextResponse.json(
        { error: "Blog yazısı bulunamadı" },
        { status: 404 }
      );
    }

    revalidateBlogPaths(updatedPost);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Blog yazısı güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Blog yazısını sil
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const existingPost = await getBlogPostById(id);

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog yazısı bulunamadı" },
        { status: 404 }
      );
    }

    const deleted = await removeBlogPost(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Blog yazısı silinemedi" },
        { status: 500 }
      );
    }

    revalidateBlogPaths(existingPost);

    return NextResponse.json({ message: "Blog yazısı silindi" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Blog yazısı silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
