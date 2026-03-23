import sharp from "sharp";
import path from "path";
import fs from "fs";

const outDir = path.join(process.cwd(), "public", "images", "samples");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ── Style A+C 합체 v2: 정갈한 정렬 ──
const styleAC = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ac1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ac1)"/>

  <!-- 배경 장식 -->
  <circle cx="1080" cy="100" r="300" fill="rgba(139,92,246,0.05)"/>
  <circle cx="80" cy="580" r="180" fill="rgba(139,92,246,0.03)"/>

  <!-- 배경 워터마크 -->
  <text x="820" y="280" font-family="Arial,sans-serif" font-size="220" font-weight="900" fill="rgba(139,92,246,0.04)">ETF</text>

  <!-- ===== 좌측 콘텐츠 (x=80 기준 정렬) ===== -->

  <!-- 카테고리 뱃지 -->
  <rect x="80" y="65" width="90" height="38" rx="19" fill="#7C3AED"/>
  <text x="125" y="90" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">투자</text>

  <!-- 메인 타이틀 -->
  <text x="80" y="205" font-family="Arial,sans-serif" font-size="72" font-weight="900" fill="white">ETF 투자</text>

  <!-- 강조 서브타이틀 (노란 박스) -->
  <rect x="80" y="230" width="380" height="64" rx="8" fill="#FBBF24"/>
  <text x="270" y="273" font-family="Arial,sans-serif" font-size="42" font-weight="900" fill="#0f172a" text-anchor="middle">완벽 입문 가이드</text>

  <!-- 설명 -->
  <text x="80" y="355" font-family="Arial,sans-serif" font-size="22" fill="rgba(255,255,255,0.55)">초보자도 쉽게 시작하는 ETF 투자의 모든 것</text>

  <!-- ===== 숫자 카드 3개 (균등 배치, y=420 기준) ===== -->
  <rect x="80" y="420" width="220" height="88" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(139,92,246,0.2)" stroke-width="1"/>
  <text x="190" y="462" font-family="Arial,sans-serif" font-size="30" font-weight="900" fill="#FBBF24" text-anchor="middle">월 10만원</text>
  <text x="190" y="490" font-family="Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.4)" text-anchor="middle">최소 투자금</text>

  <rect x="320" y="420" width="220" height="88" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(139,92,246,0.2)" stroke-width="1"/>
  <text x="430" y="462" font-family="Arial,sans-serif" font-size="30" font-weight="900" fill="#34D399" text-anchor="middle">연 8~12%</text>
  <text x="430" y="490" font-family="Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.4)" text-anchor="middle">평균 수익률</text>

  <rect x="560" y="420" width="220" height="88" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(139,92,246,0.2)" stroke-width="1"/>
  <text x="670" y="462" font-family="Arial,sans-serif" font-size="30" font-weight="900" fill="#60A5FA" text-anchor="middle">TOP 7</text>
  <text x="670" y="490" font-family="Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.4)" text-anchor="middle">추천 ETF</text>

  <!-- ===== 우측 차트 장식 ===== -->
  <polyline points="900,510 940,470 980,480 1020,430 1060,390 1100,340" fill="none" stroke="rgba(139,92,246,0.5)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="1100" cy="340" r="6" fill="#FBBF24"/>
  <text x="1100" y="325" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="#FBBF24" text-anchor="middle">+12%</text>

  <!-- ===== 하단 브랜드 (좌측 정렬 유지) ===== -->
  <text x="80" y="565" font-family="Arial,sans-serif" font-size="14" fill="rgba(255,255,255,0.3)">쉬운재테크 · easyzetec.com</text>
</svg>`;

async function generate() {
  const buf = Buffer.from(styleAC);
  const outPath = path.join(outDir, "style-ac-combined.png");
  await sharp(buf).resize(1200, 630).png().toFile(outPath);
  console.log(`✅ A+C 합체 스타일 → ${outPath}`);
}

generate().catch(console.error);
