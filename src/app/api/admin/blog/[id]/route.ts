import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Tek bir blog yazısını getir
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

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
    const {
      title,
      excerpt,
      content,
      author,
      category,
      image,
      slug,
      readTime,
      active,
    } = body;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        author,
        category,
        image,
        slug,
        readTime: readTime?.toString(),
        active,
      },
    });

    return NextResponse.json(post);
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
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Blog yazısı silindi" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Blog yazısı silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
