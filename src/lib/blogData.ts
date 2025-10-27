import { promises as fs } from "fs";
import path from "path";

export interface MultilingualText {
  tr: string;
  en: string;
  de: string;
  ru: string;
  pl: string;
  [key: string]: string;
}

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
  active?: boolean;
  tags?: string[];
  seoTitle?: Partial<MultilingualText>;
  seoDescription?: Partial<MultilingualText>;
  seoKeywords?: Partial<MultilingualText>;
  externalLink?: string;
  externalLinkTitle?: Partial<MultilingualText>;
  images?: BlogImage[];
}

interface BlogDataFile {
  posts: BlogPost[];
}

const dataFilePath = path.join(process.cwd(), "src", "data", "blog-posts.json");

async function ensureBlogData(): Promise<BlogDataFile> {
  try {
    const file = await fs.readFile(dataFilePath, "utf-8");
    const data = JSON.parse(file) as BlogDataFile;
    if (!Array.isArray(data.posts)) {
      return { posts: [] };
    }
    return {
      posts: data.posts.map((post) => ({
        ...post,
        active: post.active ?? true,
      })),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { posts: [] };
    }
    throw error;
  }
}

async function writeBlogData(data: BlogDataFile): Promise<void> {
  const sortedPosts = [...data.posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const payload: BlogDataFile = {
    posts: sortedPosts.map((post) => ({
      ...post,
      active: post.active ?? true,
    })),
  };

  await fs.writeFile(dataFilePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const data = await ensureBlogData();
  return data.posts;
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  const data = await ensureBlogData();
  return data.posts.find((post) => post.id === id);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const data = await ensureBlogData();
  return data.posts.find((post) =>
    Object.values(post.slug).some((value) => value === slug)
  );
}

export async function createBlogPost(newPost: BlogPost): Promise<BlogPost> {
  const data = await ensureBlogData();
  data.posts.push({
    ...newPost,
    active: newPost.active ?? true,
  });
  await writeBlogData(data);
  return newPost;
}

export async function updateBlogPost(id: string, updatedFields: Partial<BlogPost>): Promise<BlogPost | undefined> {
  const data = await ensureBlogData();
  const index = data.posts.findIndex((post) => post.id === id);
  if (index === -1) {
    return undefined;
  }

  const existingPost = data.posts[index];
  const updatedPost: BlogPost = {
    ...existingPost,
    ...updatedFields,
    slug: { ...existingPost.slug, ...updatedFields.slug },
    title: { ...existingPost.title, ...updatedFields.title },
    excerpt: { ...existingPost.excerpt, ...updatedFields.excerpt },
    content: { ...existingPost.content, ...updatedFields.content },
    readTime: formatReadTime(updatedFields.readTime ?? existingPost.readTime),
  };

  data.posts[index] = updatedPost;
  await writeBlogData(data);
  return updatedPost;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const data = await ensureBlogData();
  const index = data.posts.findIndex((post) => post.id === id);
  if (index === -1) {
    return false;
  }

  data.posts.splice(index, 1);
  await writeBlogData(data);
  return true;
}

export function formatReadTime(readTime: string | number): string {
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
  return Date.now().toString();
}
