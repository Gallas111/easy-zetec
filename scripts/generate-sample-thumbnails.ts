import sharp from "sharp";
import path from "path";
import fs from "fs";

const outDir = path.join(process.cwd(), "public", "images", "samples");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ── Style A: 텍스트 임팩트형 (유튜브 썸네일 스타일) ──
const styleA = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="a1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#a1)"/>

  <!-- 배경 장식 -->
  <circle cx="1050" cy="120" r="300" fill="rgba(139,92,246,0.08)"/>
  <circle cx="100" cy="550" r="200" fill="rgba(139,92,246,0.06)"/>

  <!-- 큰 배경 이모지 -->
  <text x="900" y="420" font-size="280" opacity="0.12">📈</text>

  <!-- 카테고리 뱃지 -->
  <rect x="80" y="80" width="100" height="44" rx="22" fill="#8B5CF6"/>
  <text x="130" y="108" font-family="Arial,sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">투자</text>

  <!-- 메인 키워드 - 아주 크게 -->
  <text x="80" y="240" font-family="Arial,sans-serif" font-size="88" font-weight="900" fill="white">ETF 투자</text>

  <!-- 강조 박스 + 서브 키워드 -->
  <rect x="76" y="270" width="280" height="70" rx="8" fill="#FBBF24"/>
  <text x="216" y="318" font-family="Arial,sans-serif" font-size="48" font-weight="900" fill="#1a1a2e" text-anchor="middle">완벽 가이드</text>

  <!-- 부제 -->
  <text x="80" y="420" font-family="Arial,sans-serif" font-size="28" fill="rgba(255,255,255,0.7)">초보자도 월 10만원으로 시작하는 방법</text>

  <!-- 하단 브랜드 -->
  <rect x="80" y="510" width="180" height="44" rx="22" fill="rgba(255,255,255,0.1)"/>
  <text x="170" y="538" font-family="Arial,sans-serif" font-size="18" fill="rgba(255,255,255,0.6)" text-anchor="middle">쉬운재테크</text>
</svg>`;

// ── Style B: 카드뉴스 스타일 ──
const styleB = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="b1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="100%" style="stop-color:#f0f4ff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#b1)"/>

  <!-- 좌측 컬러 바 -->
  <rect x="0" y="0" width="12" height="630" fill="#8B5CF6"/>

  <!-- 상단 큰 아이콘 영역 -->
  <circle cx="600" cy="200" r="120" fill="#EDE9FE"/>
  <text x="600" y="240" font-size="120" text-anchor="middle">📊</text>

  <!-- 제목 - 중앙 정렬, 굵게 -->
  <text x="600" y="390" font-family="Arial,sans-serif" font-size="52" font-weight="900" fill="#1e1b4b" text-anchor="middle">ETF 투자, 이것만 알면 끝!</text>

  <!-- 설명 -->
  <text x="600" y="445" font-family="Arial,sans-serif" font-size="24" fill="#6b7280" text-anchor="middle">초보 투자자를 위한 ETF 완벽 가이드</text>

  <!-- 하단 태그들 -->
  <rect x="390" y="500" width="80" height="36" rx="18" fill="#8B5CF6"/>
  <text x="430" y="524" font-family="Arial,sans-serif" font-size="15" fill="white" text-anchor="middle">투자</text>

  <rect x="485" y="500" width="100" height="36" rx="18" fill="#E0E7FF"/>
  <text x="535" y="524" font-family="Arial,sans-serif" font-size="15" fill="#4338CA" text-anchor="middle">초보자용</text>

  <rect x="600" y="500" width="120" height="36" rx="18" fill="#E0E7FF"/>
  <text x="660" y="524" font-family="Arial,sans-serif" font-size="15" fill="#4338CA" text-anchor="middle">2026 최신</text>

  <!-- 브랜드 -->
  <text x="600" y="590" font-family="Arial,sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle">쉬운재테크 · easyzetec.com</text>
</svg>`;

// ── Style C: 숫자/데이터 강조형 ──
const styleC = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="c1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#c1)"/>

  <!-- 그리드 패턴 배경 -->
  <line x1="0" y1="126" x2="1200" y2="126" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="0" y1="252" x2="1200" y2="252" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="0" y1="378" x2="1200" y2="378" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="0" y1="504" x2="1200" y2="504" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="300" y1="0" x2="300" y2="630" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="600" y1="0" x2="600" y2="630" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="900" y1="0" x2="900" y2="630" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>

  <!-- 좌측: 텍스트 영역 -->
  <rect x="60" y="70" width="100" height="40" rx="20" fill="#7C3AED"/>
  <text x="110" y="96" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">투자</text>

  <text x="60" y="200" font-family="Arial,sans-serif" font-size="46" font-weight="900" fill="white">ETF 투자 초보</text>
  <text x="60" y="260" font-family="Arial,sans-serif" font-size="46" font-weight="900" fill="#A78BFA">완벽 입문 가이드</text>

  <!-- 핵심 숫자 카드들 -->
  <rect x="60" y="320" width="200" height="100" rx="16" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.3)" stroke-width="1"/>
  <text x="160" y="368" font-family="Arial,sans-serif" font-size="36" font-weight="900" fill="#FBBF24" text-anchor="middle">월 10만원</text>
  <text x="160" y="400" font-family="Arial,sans-serif" font-size="16" fill="rgba(255,255,255,0.5)" text-anchor="middle">최소 투자금</text>

  <rect x="280" y="320" width="200" height="100" rx="16" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.3)" stroke-width="1"/>
  <text x="380" y="368" font-family="Arial,sans-serif" font-size="36" font-weight="900" fill="#34D399" text-anchor="middle">연 8~12%</text>
  <text x="380" y="400" font-family="Arial,sans-serif" font-size="16" fill="rgba(255,255,255,0.5)" text-anchor="middle">평균 수익률</text>

  <rect x="500" y="320" width="200" height="100" rx="16" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.3)" stroke-width="1"/>
  <text x="600" y="368" font-family="Arial,sans-serif" font-size="36" font-weight="900" fill="#60A5FA" text-anchor="middle">TOP 7</text>
  <text x="600" y="400" font-family="Arial,sans-serif" font-size="16" fill="rgba(255,255,255,0.5)" text-anchor="middle">추천 ETF</text>

  <!-- 우측: 미니 차트 장식 -->
  <polyline points="800,450 860,400 920,420 980,350 1040,300 1100,250" fill="none" stroke="#7C3AED" stroke-width="3" opacity="0.6"/>
  <polyline points="800,450 860,400 920,420 980,350 1040,300 1100,250" fill="none" stroke="#A78BFA" stroke-width="1.5" opacity="0.3" stroke-dasharray="6,4"/>
  <circle cx="1100" cy="250" r="6" fill="#FBBF24"/>

  <!-- 우측 하단 큰 숫자 장식 -->
  <text x="950" y="200" font-family="Arial,sans-serif" font-size="160" font-weight="900" fill="rgba(139,92,246,0.07)">ETF</text>

  <!-- 하단 브랜드 -->
  <rect x="60" y="500" width="160" height="40" rx="20" fill="rgba(255,255,255,0.06)"/>
  <text x="140" y="526" font-family="Arial,sans-serif" font-size="16" fill="rgba(255,255,255,0.4)" text-anchor="middle">쉬운재테크</text>
</svg>`;

async function generate() {
  const samples = [
    { name: "style-a-impact", svg: styleA, label: "A: 텍스트 임팩트형" },
    { name: "style-b-card", svg: styleB, label: "B: 카드뉴스형" },
    { name: "style-c-data", svg: styleC, label: "C: 숫자/데이터형" },
  ];

  for (const s of samples) {
    const buf = Buffer.from(s.svg);
    const outPath = path.join(outDir, `${s.name}.png`);
    await sharp(buf).resize(1200, 630).png().toFile(outPath);
    console.log(`✅ ${s.label} → ${outPath}`);
  }
  console.log(`\n📁 ${outDir} 에서 확인하세요!`);
}

generate().catch(console.error);
