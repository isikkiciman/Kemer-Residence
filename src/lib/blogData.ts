import { randomUUID } from "crypto";
import { unstable_noStore as noStore } from "next/cache";
import { Prisma } from "@prisma/client";
import blogSeed from "@/data/blog-posts.json";
import { prisma } from "@/lib/prisma";

type PrismaBlogPost = Awaited<
  ReturnType<typeof prisma.blogPost.findMany>
>[number];

export type MultilingualText = Record<string, string>;

export interface BlogImage {
  id: string;
  url: string;
  alt: MultilingualText;
  isMain?: boolean;
}

export interface BlogPost {
  id: string;
  slug: MultilingualText;
  title: MultilingualText;
  excerpt: MultilingualText;
  content: MultilingualText;
  image: string;
  author: string;
  category: string;
  readTime: string;
  publishedAt: string;
  active: boolean;
  tags?: string[];
  seoTitle?: Partial<MultilingualText>;
  seoDescription?: Partial<MultilingualText>;
  seoKeywords?: Partial<MultilingualText>;
  externalLink?: string | null;
  externalLinkTitle?: Partial<MultilingualText>;
  externalLinkButton?: Partial<MultilingualText>;
  images?: BlogImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPostInput {
  id?: string;
  slug: MultilingualText;
  title: MultilingualText;
  excerpt: MultilingualText;
  content: MultilingualText;
  image: string;
  author?: string;
  category?: string;
  readTime?: string | number;
  publishedAt?: string | Date;
  active?: boolean;
  tags?: string[] | null;
  seoTitle?: Partial<MultilingualText> | null;
  seoDescription?: Partial<MultilingualText> | null;
  seoKeywords?: Partial<MultilingualText> | null;
  externalLink?: string | null;
  externalLinkTitle?: Partial<MultilingualText> | null;
  externalLinkButton?: Partial<MultilingualText> | null;
  images?: BlogImage[] | null;
}

let seedTask: Promise<void> | null = null;

async function ensureSeedData() {
  if (!seedTask) {
    seedTask = (async () => {
      const count = await prisma.blogPost.count();
      if (count > 0) return;

      const seedPosts = Array.isArray(blogSeed.posts) ? blogSeed.posts : [];
      for (const post of seedPosts) {
        const seedId = post.id ?? generateBlogId();
        const createData = buildCreateInput({
          ...post,
          id: seedId,
        });

        await prisma.blogPost.upsert({
          where: { id: seedId },
          update: {},
          create: createData,
        });
      }
    })();
  }

  await seedTask;
}

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function optionalJson(
  value: unknown | null | undefined,
  fallback?: unknown
): Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined {
  if (value === undefined) {
    if (fallback === undefined) {
      return Prisma.JsonNull;
    }

    return toJsonValue(fallback);
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return toJsonValue(value);
}

function mergeJsonValue(
  base: Prisma.JsonValue | null | undefined,
  updates?: Partial<MultilingualText> | null
): Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined {
  if (updates === null) {
    return Prisma.JsonNull;
  }

  if (!updates) {
    return undefined;
  }

  const baseObject =
    base && typeof base === "object" && !Array.isArray(base)
      ? (base as Record<string, unknown>)
      : {};

  return { ...baseObject, ...updates } as Prisma.InputJsonValue;
}

function parseMultilingual(
  value: Prisma.JsonValue | null | undefined
): MultilingualText {
  return (value ?? {}) as MultilingualText;
}

function parseMultilingualPartial(
  value: Prisma.JsonValue | null | undefined
): Partial<MultilingualText> | undefined {
  if (!value) {
    return undefined;
  }

  return value as Partial<MultilingualText>;
}

function parseStringArray(
  value: Prisma.JsonValue | null | undefined
): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter((item): item is string => typeof item === "string");
}

function parseImages(
  value: Prisma.JsonValue | null | undefined
): BlogImage[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const image: BlogImage = {
        id: typeof record.id === "string" ? record.id : randomUUID(),
        url: typeof record.url === "string" ? record.url : "",
        alt: parseMultilingual(record.alt as Prisma.JsonValue),
      };

      if (typeof record.isMain === "boolean") {
        image.isMain = record.isMain;
      }

      return image;
    })
    .filter((item): item is BlogImage => item !== null);
}

function mapPrismaBlogPost(post: PrismaBlogPost): BlogPost {
  return {
    id: post.id,
    slug: parseMultilingual(post.slug),
    title: parseMultilingual(post.title),
    excerpt: parseMultilingual(post.excerpt),
    content: parseMultilingual(post.content),
    image: post.image,
    author: post.author,
    category: post.category,
    readTime: post.readTime,
    publishedAt: post.publishedAt.toISOString(),
    active: post.active,
    tags: parseStringArray(post.tags) ?? [],
    seoTitle: parseMultilingualPartial(post.seoTitle),
    seoDescription: parseMultilingualPartial(post.seoDescription),
    seoKeywords: parseMultilingualPartial(post.seoKeywords),
    externalLink: post.externalLink,
    externalLinkTitle: parseMultilingualPartial(post.externalLinkTitle),
    externalLinkButton: parseMultilingualPartial(post.externalLinkButton),
    images: parseImages(post.images) ?? [],
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

function normalizePublishedDate(value?: string | Date): Date {
  if (!value) {
    return new Date();
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function buildCreateInput(input: BlogPostInput): Prisma.BlogPostCreateInput {
  return {
    id: input.id ?? generateBlogId(),
    slug: toJsonValue(input.slug),
    title: toJsonValue(input.title),
    excerpt: toJsonValue(input.excerpt),
    content: toJsonValue(input.content),
    image: input.image,
    author: input.author ?? "Kemer Residence",
    category: input.category ?? "Genel",
    readTime: formatReadTime(input.readTime),
    publishedAt: normalizePublishedDate(input.publishedAt),
    active: input.active ?? true,
    tags: optionalJson(input.tags, []),
    seoTitle: optionalJson(input.seoTitle),
    seoDescription: optionalJson(input.seoDescription),
    seoKeywords: optionalJson(input.seoKeywords),
    externalLink: input.externalLink ?? null,
    externalLinkTitle: optionalJson(input.externalLinkTitle),
    externalLinkButton: optionalJson(input.externalLinkButton),
    images: optionalJson(input.images, []),
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  noStore();
  await ensureSeedData();
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return posts.map(mapPrismaBlogPost);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  noStore();
  await ensureSeedData();
  const post = await prisma.blogPost.findUnique({ where: { id } });
  return post ? mapPrismaBlogPost(post) : null;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  noStore();
  await ensureSeedData();
  const posts = await prisma.blogPost.findMany();
  return (
    posts
      .map(mapPrismaBlogPost)
      .find((post) =>
        Object.values(post.slug ?? {}).some((value) => value === slug)
      ) ?? null
  );
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const data = buildCreateInput(input);
  const created = await prisma.blogPost.create({ data });
  return mapPrismaBlogPost(created);
}

export async function updateBlogPost(
  id: string,
  updatedFields: Partial<BlogPostInput>
): Promise<BlogPost | null> {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  const data: Prisma.BlogPostUpdateInput = {};

  if (updatedFields.author !== undefined) {
    data.author = updatedFields.author;
  }

  if (updatedFields.category !== undefined) {
    data.category = updatedFields.category;
  }

  if (updatedFields.image !== undefined) {
    data.image = updatedFields.image;
  }

  if (updatedFields.active !== undefined) {
    data.active = updatedFields.active;
  }

  if (updatedFields.externalLink !== undefined) {
    data.externalLink = updatedFields.externalLink;
  }

  if (updatedFields.readTime !== undefined) {
    data.readTime = formatReadTime(updatedFields.readTime);
  }

  if (updatedFields.publishedAt !== undefined) {
    data.publishedAt = normalizePublishedDate(updatedFields.publishedAt);
  }

  if (updatedFields.slug !== undefined) {
    data.slug = mergeJsonValue(existing.slug, updatedFields.slug);
  }

  if (updatedFields.title !== undefined) {
    data.title = mergeJsonValue(existing.title, updatedFields.title);
  }

  if (updatedFields.excerpt !== undefined) {
    data.excerpt = mergeJsonValue(existing.excerpt, updatedFields.excerpt);
  }

  if (updatedFields.content !== undefined) {
    data.content = mergeJsonValue(existing.content, updatedFields.content);
  }

  if (updatedFields.seoTitle !== undefined) {
    data.seoTitle = mergeJsonValue(existing.seoTitle, updatedFields.seoTitle);
  }

  if (updatedFields.seoDescription !== undefined) {
    data.seoDescription = mergeJsonValue(
      existing.seoDescription,
      updatedFields.seoDescription
    );
  }

  if (updatedFields.seoKeywords !== undefined) {
    data.seoKeywords = mergeJsonValue(
      existing.seoKeywords,
      updatedFields.seoKeywords
    );
  }

  if (updatedFields.externalLinkTitle !== undefined) {
    data.externalLinkTitle = mergeJsonValue(
      existing.externalLinkTitle,
      updatedFields.externalLinkTitle
    );
  }

  if (updatedFields.externalLinkButton !== undefined) {
    data.externalLinkButton = mergeJsonValue(
      existing.externalLinkButton,
      updatedFields.externalLinkButton
    );
  }

  if (updatedFields.images !== undefined) {
    data.images = optionalJson(updatedFields.images, []);
  }

  if (updatedFields.tags !== undefined) {
    data.tags = optionalJson(updatedFields.tags, []);
  }

  const updated = await prisma.blogPost.update({ where: { id }, data });
  return mapPrismaBlogPost(updated);
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    await prisma.blogPost.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error("Failed to delete blog post", error);
    return false;
  }
}

export function formatReadTime(readTime?: string | number): string {
  if (typeof readTime === "number") {
    return `${readTime} dk`;
  }

  if (typeof readTime === "string") {
    const trimmed = readTime.trim();
    if (trimmed.endsWith("dk")) {
      return trimmed;
    }

    if (!Number.isNaN(Number(trimmed))) {
      return `${trimmed} dk`;
    }

    return trimmed;
  }

  return "5 dk";
}

export function generateBlogId(): string {
  return randomUUID();
}
