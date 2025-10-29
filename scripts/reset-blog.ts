import { Prisma, PrismaClient } from '@prisma/client';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

interface BlogSeedFile {
  posts?: Array<BlogSeedPost>;
}

interface BlogSeedPost {
  id?: string;
  slug: Record<string, string>;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  image: string;
  author: string;
  category: string;
  readTime: string;
  publishedAt?: string;
  active?: boolean;
  tags?: string[];
  seoTitle?: Record<string, string>;
  seoDescription?: Record<string, string>;
  seoKeywords?: Record<string, string>;
  externalLink?: string | null;
  externalLinkTitle?: Record<string, string>;
  externalLinkButton?: Record<string, string>;
  externalLinkLocalized?: Record<string, string>;
  images?: unknown;
}

const prisma = new PrismaClient();

function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

async function loadSeedPosts(): Promise<BlogSeedPost[]> {
  const filePath = resolve(process.cwd(), 'src/data/blog-posts.json');
  const raw = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw) as BlogSeedFile;
  return Array.isArray(parsed.posts) ? parsed.posts : [];
}

async function main() {
  console.log('🧹 Removing existing blog posts...');
  await prisma.blogPost.deleteMany();

  const seedPosts = await loadSeedPosts();
  if (seedPosts.length === 0) {
    console.log('⚠️  No seed posts found in src/data/blog-posts.json.');
    return;
  }

  for (const post of seedPosts) {
    const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date();

    await prisma.blogPost.create({
      data: {
        id: post.id ?? undefined,
        slug: toJson(post.slug),
        title: toJson(post.title),
        excerpt: toJson(post.excerpt),
        content: toJson(post.content),
        image: post.image,
        author: post.author,
        category: post.category,
        readTime: post.readTime,
        publishedAt,
        active: post.active ?? true,
        tags: post.tags ? toJson(post.tags) : Prisma.JsonNull,
        seoTitle: post.seoTitle ? toJson(post.seoTitle) : Prisma.JsonNull,
        seoDescription: post.seoDescription ? toJson(post.seoDescription) : Prisma.JsonNull,
        seoKeywords: post.seoKeywords ? toJson(post.seoKeywords) : Prisma.JsonNull,
        externalLink: post.externalLink ?? null,
        externalLinkTitle: post.externalLinkTitle ? toJson(post.externalLinkTitle) : Prisma.JsonNull,
        externalLinkButton: post.externalLinkButton ? toJson(post.externalLinkButton) : Prisma.JsonNull,
        externalLinkLocalized: post.externalLinkLocalized ? toJson(post.externalLinkLocalized) : Prisma.JsonNull,
        images: post.images ? toJson(post.images) : Prisma.JsonNull,
      },
    });
  }

  console.log(`✅ Seeded ${seedPosts.length} blog post${seedPosts.length > 1 ? 's' : ''}.`);
}

main()
  .catch((error) => {
    console.error('❌ Failed to reset blog posts:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
