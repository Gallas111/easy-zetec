import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_URL = "https://www.easyzetec.com";
const SITE_TITLE = "쉬운재테크";
const SITE_DESCRIPTION =
  "재테크 초보도 쉽게 따라할 수 있는 저축, 투자, 절세 가이드";

const contentDir = path.join(process.cwd(), "content");
const publicDir = path.join(process.cwd(), "public");

interface PostData {
  title: string;
  description: string;
  date: string;
  category: string;
  slug: string;
}

function getAllPosts(): PostData[] {
  const posts: PostData[] = [];

  if (!fs.existsSync(contentDir)) return posts;

  const categoryDirs = fs.readdirSync(contentDir);

  for (const dir of categoryDirs) {
    const dirPath = path.join(contentDir, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContents);

      if (data.noindex) continue;

      const slug = file.replace(/\.mdx$/, "");

      posts.push({
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        category: data.category || dir,
        slug,
      });
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRss() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  const rssPath = path.join(publicDir, "rss.xml");
  const feedPath = path.join(publicDir, "feed.xml");

  fs.writeFileSync(rssPath, rss, "utf-8");
  fs.writeFileSync(feedPath, rss, "utf-8");

  console.log(`RSS feed generated: ${posts.length} posts (rss.xml + feed.xml)`);
}

generateRss();
