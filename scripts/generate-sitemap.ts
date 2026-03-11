import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_URL = "https://www.easyzetec.com";
const contentDir = path.join(process.cwd(), "content");
const outputPath = path.join(process.cwd(), "public", "sitemap.xml");

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq: string;
  priority: number;
}

function getAllMdxFiles(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMdxFiles(fullPath));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

function generateSitemap() {
  const entries: SitemapEntry[] = [];

  // Static pages
  entries.push(
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/blog", changefreq: "daily", priority: 0.9 },
    { url: "/about", changefreq: "monthly", priority: 0.5 },
    { url: "/privacy", changefreq: "yearly", priority: 0.3 },
    { url: "/terms", changefreq: "yearly", priority: 0.3 }
  );

  // Category pages
  const categories = ["basics", "savings", "investing", "tax", "real-estate"];
  for (const cat of categories) {
    entries.push({
      url: `/blog/category/${cat}`,
      changefreq: "weekly",
      priority: 0.8,
    });
  }

  // Blog posts
  const mdxFiles = getAllMdxFiles(contentDir);
  for (const filePath of mdxFiles) {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContents);

    if (data.noindex) continue;

    const slug = path.basename(filePath, ".mdx");
    entries.push({
      url: `/blog/${slug}`,
      lastmod: data.date
        ? new Date(data.date).toISOString().split("T")[0]
        : undefined,
      changefreq: "weekly",
      priority: 0.7,
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${SITE_URL}${e.url}</loc>
    ${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  fs.writeFileSync(outputPath, xml, "utf-8");
  console.log(`Sitemap generated: ${entries.length} URLs`);
}

generateSitemap();
