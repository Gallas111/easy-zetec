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

// Category styles: accent color + badge color + label
const categoryStyles: Record<string, { accent: string; badgeBg: string; label: string }> = {
  basics:        { accent: "#3B82F6", badgeBg: "#2563EB", label: "재테크 기초" },
  savings:       { accent: "#10B981", badgeBg: "#059669", label: "저축/예금" },
  investing:     { accent: "#8B5CF6", badgeBg: "#7C3AED", label: "투자" },
  tax:           { accent: "#F59E0B", badgeBg: "#D97706", label: "절세" },
  "real-estate": { accent: "#EF4444", badgeBg: "#DC2626", label: "부동산" },
};

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// 글자 폭 추정 (Arial 기준, 보수적으로)
function estimateTextWidth(text: string, fontSize: number): number {
  let units = 0;
  for (const ch of text) {
    if (/[\u3131-\uD79D]/.test(ch)) units += 1.0;       // 한글 (full-width)
    else if (/[A-Z]/.test(ch)) units += 0.75;            // 영대문자
    else if (/[a-z]/.test(ch)) units += 0.6;             // 영소문자
    else if (/[0-9]/.test(ch)) units += 0.6;             // 숫자
    else if (ch === " ") units += 0.35;                   // 공백
    else units += 0.7;                                    // 기타 기호
  }
  return units * fontSize;
}

// 제목을 최대 maxWidth에 맞게 잘라서 리턴
function truncateToWidth(text: string, fontSize: number, maxWidth: number): string {
  if (estimateTextWidth(text, fontSize) <= maxWidth) return text;
  let result = "";
  for (const ch of text) {
    const next = result + ch;
    if (estimateTextWidth(next, fontSize) > maxWidth - estimateTextWidth("...", fontSize)) {
      return result.trimEnd() + "...";
    }
    result = next;
  }
  return result;
}

function splitTitle(title: string): [string, string] {
  // Split by " - " first
  const dashParts = title.split(" - ");
  if (dashParts.length >= 2) return [dashParts[0].trim(), dashParts.slice(1).join(" - ").trim()];
  // Split by "? " (질문형)
  const qIdx = title.indexOf("? ");
  if (qIdx > 0 && qIdx < title.length - 2) return [title.slice(0, qIdx + 1).trim(), title.slice(qIdx + 2).trim()];
  // Split by ", "
  const commaIdx = title.indexOf(", ");
  if (commaIdx > 0) return [title.slice(0, commaIdx).trim(), title.slice(commaIdx + 2).trim()];
  // Split by "! "
  const bangIdx = title.indexOf("! ");
  if (bangIdx > 0) return [title.slice(0, bangIdx + 1).trim(), title.slice(bangIdx + 2).trim()];
  // Fallback: split at midpoint
  const words = title.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function accentRgb(accent: string): string {
  const map: Record<string, string> = {
    "#F59E0B": "245,158,11",
    "#EF4444": "239,68,68",
    "#10B981": "16,185,129",
    "#3B82F6": "59,130,246",
    "#8B5CF6": "139,92,246",
  };
  return map[accent] || "139,92,246";
}

function generatePostSvg(
  title: string,
  category: string,
  description: string,
  tags: string[],
): string {
  const style = categoryStyles[category] || categoryStyles.basics;
  const rgb = accentRgb(style.accent);

  const maxW = 950; // x=80 기준, 우측 여백 170px
  let [rawLine1, rawLine2] = splitTitle(title);

  // 메인 타이틀: 72px 기본, 넘치면 축소 (최소 52px)
  let titleSize = 72;
  while (titleSize > 52 && estimateTextWidth(rawLine1, titleSize) > maxW) {
    titleSize -= 2;
  }
  const line1 = truncateToWidth(rawLine1, titleSize, maxW);

  // 서브 타이틀: 42px 기본, 넘치면 축소 (최소 32px)
  let subSize = 42;
  while (subSize > 32 && estimateTextWidth(rawLine2 || "", subSize) > maxW - 40) {
    subSize -= 2;
  }
  const line2 = truncateToWidth(rawLine2 || "", subSize, maxW - 40);

  const desc = description.length > 50 ? description.substring(0, 50) + "..." : description;
  const displayTags = tags.slice(0, 3);

  // 노란 박스 폭 계산
  const line2Width = Math.min(estimateTextWidth(line2, subSize) + 50, maxW);

  // 카테고리 뱃지 폭
  const badgeWidth = estimateTextWidth(style.label, 16) + 36;

  // 태그 카드 생성 (균등 3칸)
  const cardWidth = 220;
  const cardGap = 20;
  const cardY = 420;
  const tagColors = ["#FBBF24", "#34D399", "#60A5FA"];
  const tagCards = displayTags.map((tag, i) => {
    const x = 80 + i * (cardWidth + cardGap);
    const cx = x + cardWidth / 2;
    const color = tagColors[i % tagColors.length];
    const truncTag = tag.length > 8 ? tag.substring(0, 8) + "..." : tag;
    return `
  <rect x="${x}" y="${cardY}" width="${cardWidth}" height="80" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(${rgb},0.2)" stroke-width="1"/>
  <text x="${cx}" y="${cardY + 48}" font-family="Arial,sans-serif" font-size="24" font-weight="900" fill="${color}" text-anchor="middle">${escapeXml(truncTag)}</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 배경 장식 -->
  <circle cx="1080" cy="100" r="300" fill="rgba(${rgb},0.05)"/>
  <circle cx="80" cy="580" r="180" fill="rgba(${rgb},0.03)"/>

  <!-- 카테고리 뱃지 -->
  <rect x="80" y="65" width="${badgeWidth}" height="38" rx="19" fill="${style.badgeBg}"/>
  <text x="${80 + badgeWidth / 2}" y="90" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${escapeXml(style.label)}</text>

  <!-- 메인 타이틀 -->
  <text x="80" y="205" font-family="Arial,sans-serif" font-size="${titleSize}" font-weight="900" fill="white">${escapeXml(line1)}</text>

  <!-- 강조 서브타이틀 -->
  <rect x="80" y="228" width="${line2Width}" height="${subSize + 22}" rx="8" fill="#FBBF24"/>
  <text x="${80 + line2Width / 2}" y="${228 + subSize + 22 - Math.round((subSize + 22 - subSize * 0.75) / 2)}" font-family="Arial,sans-serif" font-size="${subSize}" font-weight="900" fill="#0f172a" text-anchor="middle">${escapeXml(line2)}</text>

  <!-- 설명 -->
  <text x="80" y="355" font-family="Arial,sans-serif" font-size="22" fill="rgba(255,255,255,0.55)">${escapeXml(desc)}</text>

  <!-- 태그 카드 -->${tagCards}

  <!-- 하단 브랜드 -->
  <text x="80" y="565" font-family="Arial,sans-serif" font-size="14" fill="rgba(255,255,255,0.3)">쉬운재테크 · easyzetec.com</text>
</svg>`;
}

function getAllPosts(): { slug: string; title: string; category: string; description: string; tags: string[] }[] {
  const posts: { slug: string; title: string; category: string; description: string; tags: string[] }[] = [];
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
        tags: data.tags || data.keywords || [],
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

  // Generate per-post thumbnail images (always regenerate with new design)
  const posts = getAllPosts();
  for (const post of posts) {
    const svg = generatePostSvg(post.title, post.category, post.description, post.tags);
    const svgContent = Buffer.from(svg);
    // Save SVG for reference
    fs.writeFileSync(path.join(imagesDir, `${post.slug}.svg`), svg);
    await sharp(svgContent).resize(1200, 630).png().toFile(
      path.join(imagesDir, `${post.slug}.png`)
    );
    console.log(`Generated: ${post.slug}.png`);
  }

  console.log(`\nAll images generated successfully! (${posts.length} post thumbnails)`);
}

generateImages().catch(console.error);
