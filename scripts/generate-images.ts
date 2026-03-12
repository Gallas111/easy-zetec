import sharp from "sharp";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const publicDir = path.join(process.cwd(), "public");
const imagesDir = path.join(publicDir, "images");
const contentDir = path.join(process.cwd(), "content");

// Favicon SVG - "Z" logo with teal gradient
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0D9488"/>
      <stop offset="100%" style="stop-color:#0F766E"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="108" fill="url(#bg)"/>
  <text x="256" y="340" font-family="Arial,Helvetica,sans-serif" font-size="320" font-weight="bold" fill="white" text-anchor="middle">Z</text>
</svg>`;

// OG image SVG
const ogImageSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="obg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0D9488"/>
      <stop offset="100%" style="stop-color:#134E4A"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#obg)"/>
  <circle cx="1050" cy="100" r="200" fill="rgba(255,255,255,0.05)"/>
  <circle cx="150" cy="530" r="150" fill="rgba(255,255,255,0.05)"/>
  <rect x="80" y="60" width="64" height="64" rx="16" fill="rgba(255,255,255,0.2)"/>
  <text x="112" y="106" font-family="Arial,Helvetica,sans-serif" font-size="40" font-weight="bold" fill="white" text-anchor="middle">Z</text>
  <text x="160" y="102" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="bold" fill="rgba(255,255,255,0.9)">easyzetec.com</text>
  <text x="80" y="280" font-family="Arial,Helvetica,sans-serif" font-size="72" font-weight="bold" fill="white">누구나 쉽게 시작하는</text>
  <text x="80" y="370" font-family="Arial,Helvetica,sans-serif" font-size="72" font-weight="bold" fill="#FCD34D">재테크 가이드</text>
  <text x="80" y="440" font-family="Arial,Helvetica,sans-serif" font-size="28" fill="rgba(255,255,255,0.7)">적금 비교 | ETF 투자 | 연말정산 | 절세 꿀팁</text>
</svg>`;

// Category colors and labels
const categoryStyles: Record<string, { gradient: [string, string]; label: string; emoji: string }> = {
  basics: { gradient: ["#3B82F6", "#1E3A8A"], label: "재테크 기초", emoji: "📚" },
  savings: { gradient: ["#10B981", "#065F46"], label: "저축/예금", emoji: "🏦" },
  investing: { gradient: ["#8B5CF6", "#4C1D95"], label: "투자", emoji: "📈" },
  tax: { gradient: ["#F59E0B", "#92400E"], label: "절세", emoji: "🧾" },
  "real-estate": { gradient: ["#EF4444", "#7F1D1D"], label: "부동산", emoji: "🏠" },
};

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function splitTitle(title: string): string[] {
  // Split title by " - " first
  const parts = title.split(" - ");
  if (parts.length >= 2) return parts.map(p => p.trim());
  // Fallback: split at midpoint by space
  const words = title.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function generatePostSvg(title: string, category: string, description: string): string {
  const style = categoryStyles[category] || categoryStyles.basics;
  const [line1, line2] = splitTitle(title);
  const desc = description.length > 40 ? description.substring(0, 40) + "..." : description;
  const gradId = `pg_${category}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${style.gradient[0]}"/>
      <stop offset="100%" style="stop-color:${style.gradient[1]}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#${gradId})"/>
  <circle cx="1000" cy="150" r="250" fill="rgba(255,255,255,0.05)"/>
  <circle cx="200" cy="500" r="180" fill="rgba(255,255,255,0.05)"/>
  <rect x="60" y="50" width="120" height="36" rx="18" fill="rgba(255,255,255,0.2)"/>
  <text x="120" y="74" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">${style.emoji} ${escapeXml(style.label)}</text>
  <text x="80" y="260" font-family="Arial,sans-serif" font-size="54" font-weight="bold" fill="white">${escapeXml(line1)}</text>
  <text x="80" y="340" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="#FCD34D">${escapeXml(line2 || "")}</text>
  <text x="80" y="420" font-family="Arial,sans-serif" font-size="22" fill="rgba(255,255,255,0.7)">${escapeXml(desc)}</text>
  <rect x="80" y="510" width="56" height="56" rx="14" fill="rgba(255,255,255,0.2)"/>
  <text x="108" y="546" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">Z</text>
  <text x="150" y="545" font-family="Arial,sans-serif" font-size="18" fill="rgba(255,255,255,0.7)">쉬운재테크</text>
</svg>`;
}

function getAllPosts(): { slug: string; title: string; category: string; description: string }[] {
  const posts: { slug: string; title: string; category: string; description: string }[] = [];
  const categories = fs.readdirSync(contentDir);
  for (const cat of categories) {
    const catDir = path.join(contentDir, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const files = fs.readdirSync(catDir).filter(f => f.endsWith(".mdx"));
    for (const file of files) {
      const content = fs.readFileSync(path.join(catDir, file), "utf-8");
      const { data } = matter(content);
      posts.push({
        slug: file.replace(".mdx", ""),
        title: data.title || "",
        category: data.category || cat,
        description: data.description || "",
      });
    }
  }
  return posts;
}

async function generateImages() {
  // Favicon sizes
  const sizes = [16, 32, 48, 64, 180, 192, 512];

  for (const size of sizes) {
    const buffer = Buffer.from(faviconSvg);
    await sharp(buffer).resize(size, size).png().toFile(
      path.join(publicDir, size === 180 ? "apple-touch-icon.png" : `icon-${size}x${size}.png`)
    );
    console.log(`Generated: icon-${size}x${size}.png`);
  }

  // Generate favicon.ico (32x32 PNG renamed)
  const ico32 = Buffer.from(faviconSvg);
  await sharp(ico32).resize(32, 32).png().toFile(path.join(publicDir, "favicon-32.png"));
  console.log("Generated: favicon-32.png");

  // SVG favicon
  fs.writeFileSync(path.join(publicDir, "icon.svg"), faviconSvg.trim());
  console.log("Generated: icon.svg");

  // OG image (1200x630 PNG)
  const ogBuffer = Buffer.from(ogImageSvg);
  await sharp(ogBuffer).resize(1200, 630).png().toFile(
    path.join(imagesDir, "og-image.png")
  );
  console.log("Generated: og-image.png");

  // Generate per-post thumbnail images from frontmatter
  const posts = getAllPosts();
  for (const post of posts) {
    // Use existing SVG if available, otherwise generate from frontmatter
    const existingSvgPath = path.join(imagesDir, `${post.slug}.svg`);
    let svgContent: Buffer;
    if (fs.existsSync(existingSvgPath)) {
      svgContent = fs.readFileSync(existingSvgPath);
    } else {
      const svg = generatePostSvg(post.title, post.category, post.description);
      svgContent = Buffer.from(svg);
      // Save SVG for future use
      fs.writeFileSync(existingSvgPath, svg);
    }
    await sharp(svgContent).resize(1200, 630).png().toFile(
      path.join(imagesDir, `${post.slug}.png`)
    );
    console.log(`Generated: ${post.slug}.png`);
  }

  console.log(`\nAll images generated successfully! (${posts.length} post thumbnails)`);
}

generateImages().catch(console.error);
