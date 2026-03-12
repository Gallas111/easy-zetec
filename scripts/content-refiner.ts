import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { callGemini } from './utils/ai-utils';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const REFINED_MARKER = '<!-- refined -->';

// ── Find unrefined posts ───────────────────────────────
function getUnrefinedPosts(): { filePath: string; slug: string }[] {
  const posts: { filePath: string; slug: string }[] = [];
  if (!fs.existsSync(CONTENT_DIR)) return posts;

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (const cat of fs.readdirSync(CONTENT_DIR)) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;

    for (const file of fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'))) {
      const filePath = path.join(catDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Skip already refined
      if (content.includes(REFINED_MARKER)) continue;

      // Check if recently created (within 24 hours)
      const stat = fs.statSync(filePath);
      const ageMs = now - stat.mtimeMs;
      if (ageMs <= oneDayMs) {
        posts.push({ filePath, slug: file.replace('.mdx', '') });
      }
    }
  }

  return posts;
}

// ── Refine post content ─────────────────────────────────
async function refinePost(filePath: string): Promise<boolean> {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);

  const systemInstruction = `당신은 한국 재테크 블로그 '쉬운재테크'의 편집자입니다.
주어진 블로그 글을 다음 기준으로 개선하세요:
- AI가 쓴 느낌이 나지 않도록 자연스럽고 인간적인 톤으로 수정
- 불필요한 반복 제거
- 읽기 쉽도록 문단 구성 개선
- 구체적인 예시나 수치가 부족하면 추가
- 제목(title)이 클릭을 유도하도록 최적화 (필요 시 수정 제안)
- 반드시 한국어로 작성

중요: 프론트매터(--- 사이의 YAML)의 구조는 절대 변경하지 마세요. 내용(값)만 수정 가능합니다.`;

  const prompt = `다음 블로그 포스트를 개선해주세요. 프론트매터를 포함한 전체 MDX 파일을 반환하세요.

현재 제목: ${frontmatter.title}
카테고리: ${frontmatter.category}

---
${raw}
---

개선된 전체 MDX 파일을 반환하세요 (프론트매터 포함).
마크다운 코드블록(\`\`\`)으로 감싸지 마세요. 순수 MDX 내용만 반환하세요.`;

  try {
    let refined = await callGemini(prompt, systemInstruction);

    // Remove any markdown code block wrapping
    refined = refined.replace(/^```(?:mdx|markdown)?\s*\n?/i, '').replace(/\n?\s*```\s*$/i, '').trim();

    // Validate that frontmatter exists
    if (!refined.startsWith('---')) {
      console.warn(`   ⚠️ 개선된 콘텐츠에 프론트매터가 없습니다. 건너뜁니다.`);
      return false;
    }

    // Parse to validate
    const { data: refinedFrontmatter } = matter(refined);

    // Ensure critical fields are preserved
    if (!refinedFrontmatter.title || !refinedFrontmatter.category || !refinedFrontmatter.date) {
      console.warn(`   ⚠️ 필수 프론트매터 필드가 누락되었습니다. 건너뜁니다.`);
      return false;
    }

    // Preserve original fields that should not change
    refinedFrontmatter.image = frontmatter.image;
    refinedFrontmatter.author = frontmatter.author;
    refinedFrontmatter.date = frontmatter.date;
    refinedFrontmatter.category = frontmatter.category;

    // Reconstruct the file
    const { content: refinedContent } = matter(refined);
    const finalContent = matter.stringify(refinedContent + '\n' + REFINED_MARKER + '\n', refinedFrontmatter);

    fs.writeFileSync(filePath, finalContent, 'utf-8');
    return true;
  } catch (err: any) {
    console.error(`   ❌ 개선 실패: ${err.message}`);
    return false;
  }
}

// ── Main ────────────────────────────────────────────────
async function main() {
  console.log('\n🔧 콘텐츠 개선 시작\n');

  const posts = getUnrefinedPosts();

  if (posts.length === 0) {
    console.log('✅ 개선할 포스트가 없습니다.\n');
    return;
  }

  console.log(`📋 ${posts.length}개 포스트 발견\n`);

  let refined = 0;
  for (const post of posts) {
    console.log(`📝 개선 중: ${post.slug}`);
    const success = await refinePost(post.filePath);
    if (success) {
      refined++;
      console.log(`   ✅ 완료: ${post.slug}`);
    }

    // Rate limit
    if (posts.indexOf(post) < posts.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n✅ ${refined}/${posts.length}개 포스트 개선 완료!\n`);
}

main().catch(err => {
  console.error('❌ 치명적 오류:', err);
  process.exit(1);
});
