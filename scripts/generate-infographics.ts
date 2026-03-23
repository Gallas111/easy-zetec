import fs from "fs";
import path from "path";
import matter from "gray-matter";
import sharp from "sharp";

const contentDir = path.join(process.cwd(), "content");
const imgDir = path.join(process.cwd(), "public", "images", "infographic");
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

const font = "GmarketSansTTF,Arial,sans-serif";

// 카테고리 스타일
const catStyles: Record<string, { accent: string; accentRgb: string; bgFrom: string; bgTo: string; label: string }> = {
  basics:        { accent: "#3B82F6", accentRgb: "59,130,246",  bgFrom: "#0c1a3d", bgTo: "#1e3a5f", label: "재테크 기초" },
  savings:       { accent: "#10B981", accentRgb: "16,185,129",  bgFrom: "#05201a", bgTo: "#0a3d2e", label: "저축/예금" },
  investing:     { accent: "#8B5CF6", accentRgb: "139,92,246",  bgFrom: "#0f172a", bgTo: "#1e1b4b", label: "투자" },
  tax:           { accent: "#F59E0B", accentRgb: "245,158,11",  bgFrom: "#1a1305", bgTo: "#3d2e0a", label: "절세" },
  "real-estate": { accent: "#EF4444", accentRgb: "239,68,68",   bgFrom: "#1a0a0a", bgTo: "#3d1515", label: "부동산" },
};

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// H2 헤딩 추출 (이모지 제거, 최대 maxCount개)
function extractH2s(content: string, maxCount = 5): string[] {
  const lines = content.split("\n");
  const h2s: string[] = [];
  for (const line of lines) {
    const m = line.match(/^##\s+(.+)/);
    if (m) {
      // 이모지, 숫자 접두사 제거 후 정리
      let text = m[1]
        .replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]/gu, "")
        .replace(/^\d+\.\s*/, "")
        .replace(/\*\*/g, "")
        .trim();
      // 너무 긴 경우 자르기
      if (text.length > 25) text = text.substring(0, 25) + "...";
      if (text.length > 0) h2s.push(text);
    }
  }
  return h2s.slice(0, maxCount);
}

// 포스트 타입 감지
type InfographicType = "steps" | "comparison" | "checklist";

function detectType(title: string, h2s: string[]): InfographicType {
  const t = title.toLowerCase();
  if (t.includes("vs") || t.includes("비교") || t.includes("차이")) return "comparison";
  if (t.includes("단계") || t.includes("방법") || t.includes("시작") || t.includes("가이드") || t.includes("로드맵")) return "steps";
  // H2에 번호가 있으면 steps
  const numbered = h2s.filter(h => /^\d/.test(h)).length;
  if (numbered >= 3) return "steps";
  return "checklist";
}

// ─── SVG 생성: 단계별 흐름도 ───
function generateStepsSvg(
  title: string, h2s: string[], style: typeof catStyles.basics
): string {
  const steps = h2s.slice(0, 5);
  const stepCount = steps.length;
  const stepH = 64;
  const gap = 16;
  const startY = 140;
  const totalH = startY + stepCount * (stepH + gap) + 40;
  const svgH = Math.max(totalH, 500);

  const stepItems = steps.map((s, i) => {
    const y = startY + i * (stepH + gap);
    const isLast = i === stepCount - 1;
    return `
    <rect x="80" y="${y}" width="640" height="${stepH}" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(${style.accentRgb},0.3)" stroke-width="1.5"/>
    <circle cx="115" cy="${y + stepH / 2}" r="18" fill="${style.accent}"/>
    <text x="115" y="${y + stepH / 2 + 6}" font-family="${font}" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${i + 1}</text>
    <text x="150" y="${y + stepH / 2 + 7}" font-family="${font}" font-size="18" fill="white">${escapeXml(s)}</text>
    ${!isLast ? `<line x1="115" y1="${y + stepH}" x2="115" y2="${y + stepH + gap}" stroke="rgba(${style.accentRgb},0.4)" stroke-width="2" stroke-dasharray="4,3"/>` : ""}`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${svgH}" viewBox="0 0 800 ${svgH}">
  <defs>
    <linearGradient id="ibg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${style.bgFrom}"/>
      <stop offset="100%" style="stop-color:${style.bgTo}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="${svgH}" rx="16" fill="url(#ibg)"/>
  <circle cx="720" cy="60" r="150" fill="rgba(${style.accentRgb},0.04)"/>

  <!-- 제목 -->
  <rect x="40" y="30" width="8" height="36" rx="4" fill="${style.accent}"/>
  <text x="60" y="58" font-family="${font}" font-size="22" font-weight="bold" fill="white">${escapeXml(title.length > 35 ? title.substring(0, 35) + "..." : title)}</text>
  <text x="40" y="95" font-family="${font}" font-size="14" fill="rgba(255,255,255,0.4)">단계별 핵심 포인트</text>

  ${stepItems}

  <text x="40" y="${svgH - 15}" font-family="${font}" font-size="11" fill="rgba(255,255,255,0.25)">쉬운재테크 · easyzetec.com</text>
</svg>`;
}

// ─── SVG 생성: 비교 차트 ───
function generateComparisonSvg(
  title: string, h2s: string[], style: typeof catStyles.basics
): string {
  const items = h2s.slice(0, 5);
  const rowH = 56;
  const startY = 130;
  const svgH = startY + items.length * rowH + 60;

  const rows = items.map((s, i) => {
    const y = startY + i * rowH;
    const bgOpacity = i % 2 === 0 ? "0.04" : "0.08";
    return `
    <rect x="40" y="${y}" width="720" height="${rowH}" fill="rgba(255,255,255,${bgOpacity})"/>
    <circle cx="75" cy="${y + rowH / 2}" r="14" fill="rgba(${style.accentRgb},0.3)"/>
    <text x="75" y="${y + rowH / 2 + 5}" font-family="${font}" font-size="13" font-weight="bold" fill="${style.accent}" text-anchor="middle">✓</text>
    <text x="105" y="${y + rowH / 2 + 6}" font-family="${font}" font-size="17" fill="white">${escapeXml(s)}</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${svgH}" viewBox="0 0 800 ${svgH}">
  <defs>
    <linearGradient id="ibg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${style.bgFrom}"/>
      <stop offset="100%" style="stop-color:${style.bgTo}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="${svgH}" rx="16" fill="url(#ibg)"/>

  <rect x="40" y="30" width="8" height="36" rx="4" fill="${style.accent}"/>
  <text x="60" y="58" font-family="${font}" font-size="22" font-weight="bold" fill="white">${escapeXml(title.length > 35 ? title.substring(0, 35) + "..." : title)}</text>
  <text x="40" y="95" font-family="${font}" font-size="14" fill="rgba(255,255,255,0.4)">핵심 비교 포인트</text>

  <rect x="40" y="${startY - 8}" width="720" height="${items.length * rowH + 16}" rx="12" fill="rgba(255,255,255,0.02)" stroke="rgba(${style.accentRgb},0.15)" stroke-width="1"/>
  ${rows}

  <text x="40" y="${svgH - 15}" font-family="${font}" font-size="11" fill="rgba(255,255,255,0.25)">쉬운재테크 · easyzetec.com</text>
</svg>`;
}

// ─── SVG 생성: 체크리스트/핵심 포인트 ───
function generateChecklistSvg(
  title: string, h2s: string[], style: typeof catStyles.basics
): string {
  const items = h2s.slice(0, 5);
  const cardH = 72;
  const gap = 12;
  const startY = 130;
  const svgH = startY + items.length * (cardH + gap) + 40;

  const cards = items.map((s, i) => {
    const y = startY + i * (cardH + gap);
    const colors = ["#FBBF24", "#34D399", "#60A5FA", "#F472B6", "#A78BFA"];
    const color = colors[i % colors.length];
    return `
    <rect x="40" y="${y}" width="720" height="${cardH}" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(${style.accentRgb},0.15)" stroke-width="1"/>
    <rect x="40" y="${y}" width="6" height="${cardH}" rx="3" fill="${color}"/>
    <text x="72" y="${y + cardH / 2 + 6}" font-family="${font}" font-size="18" fill="white">${escapeXml(s)}</text>
    <text x="730" y="${y + cardH / 2 + 5}" font-family="${font}" font-size="14" fill="${color}" text-anchor="end">0${i + 1}</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${svgH}" viewBox="0 0 800 ${svgH}">
  <defs>
    <linearGradient id="ibg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${style.bgFrom}"/>
      <stop offset="100%" style="stop-color:${style.bgTo}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="${svgH}" rx="16" fill="url(#ibg)"/>
  <circle cx="720" cy="60" r="120" fill="rgba(${style.accentRgb},0.03)"/>

  <rect x="40" y="30" width="8" height="36" rx="4" fill="${style.accent}"/>
  <text x="60" y="58" font-family="${font}" font-size="22" font-weight="bold" fill="white">${escapeXml(title.length > 35 ? title.substring(0, 35) + "..." : title)}</text>
  <text x="40" y="95" font-family="${font}" font-size="14" fill="rgba(255,255,255,0.4)">이 글에서 다루는 핵심 내용</text>

  ${cards}

  <text x="40" y="${svgH - 15}" font-family="${font}" font-size="11" fill="rgba(255,255,255,0.25)">쉬운재테크 · easyzetec.com</text>
</svg>`;
}

// ─── 메인 ───
async function main() {
  const categories = fs.readdirSync(contentDir).filter(d =>
    fs.statSync(path.join(contentDir, d)).isDirectory()
  );

  let generated = 0;
  let skipped = 0;

  for (const cat of categories) {
    const catDir = path.join(contentDir, cat);
    const files = fs.readdirSync(catDir).filter(f => f.endsWith(".mdx"));
    const style = catStyles[cat] || catStyles.basics;

    for (const file of files) {
      const filePath = path.join(catDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(".mdx", "");

      // 이미 인포그래픽 이미지가 있으면 스킵
      if (content.includes("/images/infographic/")) {
        skipped++;
        continue;
      }

      const title = data.title || slug;
      const h2s = extractH2s(content);
      if (h2s.length < 2) {
        console.log(`⏭️  ${slug}: H2가 부족 (${h2s.length}개)`);
        skipped++;
        continue;
      }

      const type = detectType(title, h2s);

      // SVG 생성
      let svg: string;
      switch (type) {
        case "steps":
          svg = generateStepsSvg(title, h2s, style);
          break;
        case "comparison":
          svg = generateComparisonSvg(title, h2s, style);
          break;
        default:
          svg = generateChecklistSvg(title, h2s, style);
      }

      // SVG → PNG
      const svgPath = path.join(imgDir, `${slug}.svg`);
      const pngPath = path.join(imgDir, `${slug}.png`);
      fs.writeFileSync(svgPath, svg);
      await sharp(Buffer.from(svg)).png().toFile(pngPath);

      // MDX에 이미지 삽입 (첫 번째 H2 바로 앞에)
      const altText = `${title} - 핵심 내용 요약`;
      const imgTag = `\n![${altText}](/images/infographic/${slug}.png)\n`;

      const lines = content.split("\n");
      let insertIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^##\s/)) {
          insertIdx = i;
          break;
        }
      }

      if (insertIdx > 0) {
        lines.splice(insertIdx, 0, imgTag);
        const newContent = lines.join("\n");
        const newRaw = matter.stringify(newContent, data);
        fs.writeFileSync(filePath, newRaw);
      }

      generated++;
      console.log(`✅ ${slug} (${type}) → infographic/${slug}.png`);
    }
  }

  console.log(`\n🎉 완료! 생성: ${generated}개, 스킵: ${skipped}개`);
}

main().catch(console.error);
