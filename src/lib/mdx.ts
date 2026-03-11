import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  category: string;
  keywords: string[];
  image: string;
  author: string;
  faq?: { q: string; a: string }[];
  tags?: string[];
  relatedPosts?: string[];
  noindex?: boolean;
  slug: string;
  readingTime: number;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 500;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getAllPosts(): PostMeta[] {
  const posts: PostMeta[] = [];

  if (!fs.existsSync(contentDirectory)) return posts;

  const categoryDirs = fs.readdirSync(contentDirectory);

  for (const dir of categoryDirs) {
    const dirPath = path.join(contentDirectory, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContents);
      const slug = file.replace(/\.mdx$/, "");

      posts.push({
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        category: data.category || dir,
        keywords: data.keywords || [],
        image: data.image || "/images/default-og.png",
        author: data.author || "쉬운재테크",
        faq: data.faq,
        tags: data.tags,
        relatedPosts: data.relatedPosts,
        noindex: data.noindex,
        slug,
        readingTime: calculateReadingTime(content),
      });
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const allCategories = fs.existsSync(contentDirectory)
    ? fs.readdirSync(contentDirectory)
    : [];

  for (const dir of allCategories) {
    const dirPath = path.join(contentDirectory, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    const filePath = path.join(dirPath, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContents);

      return {
        meta: {
          title: data.title || "",
          description: data.description || "",
          date: data.date || "",
          category: data.category || dir,
          keywords: data.keywords || [],
          image: data.image || "/images/default-og.png",
          author: data.author || "쉬운재테크",
          faq: data.faq,
          tags: data.tags,
          relatedPosts: data.relatedPosts,
          noindex: data.noindex,
          slug,
          readingTime: calculateReadingTime(content),
        },
        content,
      };
    }
  }

  return null;
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getRelatedPosts(post: PostMeta, limit = 3): PostMeta[] {
  const allPosts = getAllPosts().filter((p) => p.slug !== post.slug);

  const scored = allPosts.map((p) => {
    let score = 0;
    if (p.category === post.category) score += 3;
    const commonKeywords = p.keywords.filter((k) =>
      post.keywords.includes(k)
    );
    score += commonKeywords.length;
    if (p.tags && post.tags) {
      const commonTags = p.tags.filter((t) => post.tags!.includes(t));
      score += commonTags.length * 2;
    }
    return { post: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}

export function getHeadings(
  content: string
): { level: number; text: string; id: string }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({
      level: match[1].length,
      text,
      id,
    });
  }

  return headings;
}

export function getAdjacentPosts(
  slug: string
): { prev: PostMeta | null; next: PostMeta | null } {
  const allPosts = getAllPosts();
  const index = allPosts.findIndex((p) => p.slug === slug);

  return {
    prev: index < allPosts.length - 1 ? allPosts[index + 1] : null,
    next: index > 0 ? allPosts[index - 1] : null,
  };
}
