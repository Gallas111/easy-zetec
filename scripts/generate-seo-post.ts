import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { callGemini, callGeminiJSON } from './utils/ai-utils';

// ── Config ──────────────────────────────────────────────
const SITE_URL = 'https://www.easyzetec.com';
const AUTHOR = '쉬운재테크';
const CONTENT_DIR = path.join(process.cwd(), 'content');
const KEYWORDS_PATH = path.join(process.cwd(), 'scripts', 'keywords.json');
const POST_COUNT = parseInt(process.env.POST_COUNT || '1', 10);

const CATEGORIES = ['basics', 'savings', 'investing', 'tax', 'real-estate'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_LABELS: Record<Category, string> = {
  basics: '재테크 기초',
  savings: '저축/예금',
  investing: '투자',
  tax: '절세',
  'real-estate': '부동산',
};

const CATEGORY_SEEDS: Record<Category, string[]> = {
  basics: ['재테크 시작', '돈 모으기', '재테크 초보', '가계부 작성법', '통장 쪼개기'],
  savings: ['적금 추천 2026', '파킹통장 금리', '예금 비교', '저축 방법', '비상금 모으기'],
  investing: ['ETF 추천', '주식 초보', '적립식 투자', '배당주 투자', '미국 주식 시작'],
  tax: ['연말정산 꿀팁', 'ISA 계좌', '절세 방법', '세액공제', '종합소득세'],
  'real-estate': ['전세 월세 비교', '청약 당첨', '주택 구매', '부동산 투자 초보', '전세사기 예방'],
};

// ── Keyword tracking ────────────────────────────────────
interface KeywordEntry {
  mainKeyword: string;
  slug: string;
  category: string;
  createdAt: string;
}

function loadKeywords(): KeywordEntry[] {
  if (!fs.existsSync(KEYWORDS_PATH)) return [];
  return JSON.parse(fs.readFileSync(KEYWORDS_PATH, 'utf-8'));
}

function saveKeywords(keywords: KeywordEntry[]): void {
  fs.writeFileSync(KEYWORDS_PATH, JSON.stringify(keywords, null, 2), 'utf-8');
}

// ── Existing posts ──────────────────────────────────────
function getExistingPosts(): { slug: string; title: string; category: string; keywords: string[] }[] {
  const posts: { slug: string; title: string; category: string; keywords: string[] }[] = [];
  if (!fs.existsSync(CONTENT_DIR)) return posts;

  for (const cat of fs.readdirSync(CONTENT_DIR)) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    for (const file of fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'))) {
      const { data } = matter(fs.readFileSync(path.join(catDir, file), 'utf-8'));
      posts.push({
        slug: file.replace('.mdx', ''),
        title: data.title || '',
        category: data.category || cat,
        keywords: data.keywords || [],
      });
    }
  }
  return posts;
}

// ── SearchAPI research ──────────────────────────────────
async function searchWeb(query: string): Promise<string> {
  const apiKey = process.env.SEARCHAPI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ SEARCHAPI_API_KEY missing, skipping web research');
    return '';
  }

  try {
    const params = new URLSearchParams({
      engine: 'google',
      q: query,
      gl: 'kr',
      hl: 'ko',
      api_key: apiKey,
    });

    const res = await fetch(`https://www.searchapi.io/api/v1/search?${params}`);
    if (!res.ok) {
      console.warn(`⚠️ SearchAPI returned ${res.status}`);
      return '';
    }

    const data = await res.json();
    const snippets: string[] = [];

    if (data.organic_results) {
      for (const r of data.organic_results.slice(0, 5)) {
        snippets.push(`- ${r.title}: ${r.snippet || ''}`);
      }
    }

    if (data.related_questions) {
      for (const q of data.related_questions.slice(0, 3)) {
        snippets.push(`- FAQ: ${q.question} → ${q.answer || ''}`);
      }
    }

    return snippets.join('\n');
  } catch (err: any) {
    console.warn(`⚠️ Search failed: ${err.message}`);
    return '';
  }
}

// ── Topic selection ─────────────────────────────────────
async function selectTopic(usedKeywords: string[]): Promise<{ keyword: string; category: Category }> {
  // Pick category with fewest posts for balance
  const categoryCounts: Record<string, number> = {};
  for (const cat of CATEGORIES) categoryCounts[cat] = 0;
  for (const kw of loadKeywords()) categoryCounts[kw.category] = (categoryCounts[kw.category] || 0) + 1;

  const sortedCategories = [...CATEGORIES].sort((a, b) => (categoryCounts[a] || 0) - (categoryCounts[b] || 0));
  const targetCategory = sortedCategories[0];

  const seeds = CATEGORY_SEEDS[targetCategory];
  const unusedSeeds = seeds.filter(s => !usedKeywords.includes(s));

  const prompt = `당신은 한국 재테크 블로그의 SEO 키워드 전문가입니다.

카테고리: ${CATEGORY_LABELS[targetCategory]}
이미 사용된 키워드: ${usedKeywords.join(', ')}
시드 키워드 참고: ${unusedSeeds.length > 0 ? unusedSeeds.join(', ') : seeds.join(', ')}

위 정보를 바탕으로 검색량이 높고 아직 사용하지 않은 새로운 블로그 포스트 키워드 1개를 제안하세요.
실용적이고 초보자가 검색할 만한 키워드를 선택하세요.

JSON 형식으로 응답하세요:
{"keyword": "키워드", "category": "${targetCategory}"}`;

  const result = await callGeminiJSON<{ keyword: string; category: Category }>(prompt);

  // Avoid duplicates
  if (usedKeywords.includes(result.keyword)) {
    // Fallback: pick unused seed
    if (unusedSeeds.length > 0) {
      return { keyword: unusedSeeds[0], category: targetCategory };
    }
    return { keyword: `${seeds[Math.floor(Math.random() * seeds.length)]} 방법`, category: targetCategory };
  }

  return result;
}

// ── Slug generation ─────────────────────────────────────
async function generateSlug(keyword: string): Promise<string> {
  const prompt = `Convert this Korean keyword to a short, SEO-friendly URL slug (lowercase English, hyphens only, max 40 chars).
Keyword: "${keyword}"
Return ONLY the slug, nothing else.`;

  const slug = (await callGemini(prompt)).trim().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
  return slug || `finance-${Date.now()}`;
}

// ── Post generation ─────────────────────────────────────
async function generatePost(keyword: string, category: Category, existingPosts: { slug: string; title: string }[]): Promise<string> {
  // Research phase
  const researchData = await searchWeb(`${keyword} 2026`);

  const internalLinks = existingPosts
    .slice(0, 10)
    .map(p => `- [${p.title}](/blog/${p.slug})`)
    .join('\n');

  const today = new Date().toISOString().split('T')[0];

  const systemInstruction = `당신은 '쉬운재테크'라는 한국 재테크 블로그의 전문 필진입니다.
- 재테크 초보자도 이해할 수 있도록 쉽고 친근한 말투로 작성합니다.
- 반말이 아닌 '~합니다', '~해요' 체를 사용합니다.
- 실용적인 팁과 구체적인 숫자/예시를 포함합니다.
- 한국 금융 시장, 한국 세법, 한국 부동산에 맞는 정보를 제공합니다.`;

  const prompt = `다음 키워드로 SEO 최적화된 블로그 포스트를 작성하세요.

메인 키워드: ${keyword}
카테고리: ${CATEGORY_LABELS[category]} (${category})

## 실시간 리서치 결과:
${researchData || '(리서치 데이터 없음 - 일반 지식 기반으로 작성)'}

## 기존 블로그 글 (내부 링크용):
${internalLinks}

## 요구사항:
1. MDX 프론트매터를 포함한 완전한 블로그 포스트를 작성하세요.
2. 본문은 800~1500단어 (한국어 기준)
3. 초보자 눈높이에 맞는 친근한 설명
4. 표(table), 리스트, 인용구(blockquote)를 적극 활용
5. 실용적인 팁과 구체적인 수치 포함
6. 기존 블로그 글 중 관련된 것 2-3개를 본문에 자연스럽게 내부 링크
7. FAQ는 2-3개 포함

## 프론트매터 형식 (반드시 이 형식을 따르세요):
---
title: "매력적인 제목 - 부제목"
description: "150자 이내의 설명"
date: "${today}"
category: "${category}"
keywords: ["${keyword}", "관련키워드1", "관련키워드2", "관련키워드3", "관련키워드4"]
image: "/images/SLUG.png"
author: "${AUTHOR}"
faq:
  - q: "질문1"
    a: "답변1"
  - q: "질문2"
    a: "답변2"
tags: ["태그1", "태그2", "태그3"]
---

주의사항:
- image 경로의 SLUG 부분은 나중에 교체됩니다. 일단 "/images/SLUG.png"으로 작성하세요.
- 프론트매터의 title에 콜론(:)이 들어가면 따옴표로 감싸세요.
- MDX 본문에 import 문이나 JSX 컴포넌트는 사용하지 마세요.
- 순수 마크다운만 사용하세요.`;

  return await callGemini(prompt, systemInstruction);
}

// ── Main ────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 쉬운재테크 블로그 포스트 생성 시작 (${POST_COUNT}개)\n`);

  const keywords = loadKeywords();
  const usedKeywords = keywords.map(k => k.mainKeyword);
  const existingPosts = getExistingPosts();
  const generatedSlugs: string[] = [];

  for (let i = 0; i < POST_COUNT; i++) {
    try {
      console.log(`\n📝 [${i + 1}/${POST_COUNT}] 토픽 선정 중...`);

      // Select topic
      const { keyword, category } = await selectTopic(usedKeywords);
      console.log(`   키워드: "${keyword}" | 카테고리: ${CATEGORY_LABELS[category]}`);

      // Generate slug
      const slug = await generateSlug(keyword);
      console.log(`   슬러그: ${slug}`);

      // Check for duplicate slug
      if (existingPosts.some(p => p.slug === slug)) {
        console.warn(`   ⚠️ 중복 슬러그 "${slug}" - 건너뜁니다.`);
        continue;
      }

      // Generate post
      console.log(`   ✍️ 포스트 생성 중...`);
      let content = await generatePost(keyword, category, existingPosts);

      // Replace SLUG placeholder in image path
      content = content.replace('/images/SLUG.png', `/images/${slug}.png`);

      // Ensure content directory exists
      const categoryDir = path.join(CONTENT_DIR, category);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }

      // Write file
      const filePath = path.join(categoryDir, `${slug}.mdx`);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✅ 저장 완료: ${filePath}`);

      // Update keywords
      usedKeywords.push(keyword);
      keywords.push({
        mainKeyword: keyword,
        slug,
        category,
        createdAt: new Date().toISOString().split('T')[0],
      });

      // Track for existing posts (for internal linking in subsequent posts)
      existingPosts.push({ slug, title: keyword, category, keywords: [keyword] });
      generatedSlugs.push(slug);

      // Rate limit between posts
      if (i < POST_COUNT - 1) {
        console.log(`   ⏳ 다음 포스트까지 3초 대기...`);
        await new Promise(r => setTimeout(r, 3000));
      }
    } catch (err: any) {
      console.error(`   ❌ 포스트 ${i + 1} 생성 실패: ${err.message}`);
    }
  }

  // Save updated keywords
  saveKeywords(keywords);
  console.log(`\n📊 키워드 목록 업데이트 완료 (총 ${keywords.length}개)`);

  // Output for GitHub Actions
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (githubOutput) {
    fs.appendFileSync(githubOutput, `POST_SLUGS=${generatedSlugs.join(',')}\n`);
    fs.appendFileSync(githubOutput, `POST_COUNT=${generatedSlugs.length}\n`);
  }

  console.log(`\n✅ 총 ${generatedSlugs.length}개 포스트 생성 완료!`);
  console.log(`   생성된 슬러그: ${generatedSlugs.join(', ')}\n`);
}

main().catch(err => {
  console.error('❌ 치명적 오류:', err);
  process.exit(1);
});
