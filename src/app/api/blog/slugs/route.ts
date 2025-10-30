import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blogData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug" },
      { status: 400 }
    );
  }

  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return NextResponse.json(
      { slugs: null },
      { status: 404 }
    );
  }

  return NextResponse.json({ slugs: post.slug });
}
