import sharp from "sharp";
import fs from "fs";
import path from "path";

const publicDir = path.join(process.cwd(), "public");
const imagesDir = path.join(publicDir, "images");

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

  // Generate per-post OG images from existing SVGs
  const postSvgs = [
    "jaetec-start-guide",
    "best-savings-2026",
    "etf-beginner-guide",
    "year-end-tax-settlement",
  ];

  for (const name of postSvgs) {
    const svgPath = path.join(imagesDir, `${name}.svg`);
    if (fs.existsSync(svgPath)) {
      const svgContent = fs.readFileSync(svgPath);
      await sharp(svgContent).resize(1200, 630).png().toFile(
        path.join(imagesDir, `${name}.png`)
      );
      console.log(`Generated: ${name}.png`);
    }
  }

  console.log("\nAll images generated successfully!");
}

generateImages().catch(console.error);
