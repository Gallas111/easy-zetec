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
  fileModified: string;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 500;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Build-time cache: 모든 MDX를 한 번만 walk + parse 하고 모든 호출에서 재사용.
// 캐시 없을 때 페이지당 getAllPosts/getPostBySlug/getPostsByCategory/getRelatedPosts/getAdjacentPosts가
// 매번 content 트리 전체를 readdir + readFileSync + matter() 재파싱 → 글 수 × 페이지 수의 N² 파싱으로
// 빌드가 느려짐. (ai-blog / saju-blog _allPostsCache 패턴 미러)
// 캐시는 content 포함 전체 Post(getPostBySlug 반환형)를 slug 키로 저장. getAllPosts는 거기서 meta만 투영.
let _allPostsCache: Map<string, Post> | null = null;

// content 트리를 한 번만 walk 해서 slug → Post 맵을 만든다.
// readdir 순서를 그대로 유지하고, 같은 slug가 여러 카테고리에 있으면 먼저 만난 것(원래 getPostBySlug break 동작)을 보존.
function loadAllPosts(): Map<string, Post> {
  if (_allPostsCache) return _allPostsCache;

  const cache = new Map<string, Post>();
  if (!fs.existsSync(contentDirectory)) {
    _allPostsCache = cache;
    return cache;
  }

  const categoryDirs = fs.readdirSync(contentDirectory);
  for (const dir of categoryDirs) {
    const dirPath = path.join(contentDirectory, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, "");
      if (cache.has(slug)) continue; // first category in readdir order wins
      const filePath = path.join(dirPath, file);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContents);
      const fileStat = fs.statSync(filePath);

      cache.set(slug, {
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
        fileModified: fileStat.mtime.toISOString(),
      });
    }
  }

  _allPostsCache = cache;
  return cache;
}

export function getAllPosts(): PostMeta[] {
  const posts = Array.from(loadAllPosts().values()).map((p) => p.meta);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  return loadAllPosts().get(slug) ?? null;
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
