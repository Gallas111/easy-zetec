import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const MAX_LINKS = 3;
const RELATED_SECTION_HEADER = '## 관련 글 추천';

// ── Post index ──────────────────────────────────────────
interface PostInfo {
  slug: string;
  title: string;
  category: string;
  keywords: string[];
  tags: string[];
  filePath: string;
}

function buildIndex(): PostInfo[] {
  const posts: PostInfo[] = [];
  if (!fs.existsSync(CONTENT_DIR)) return posts;

  for (const cat of fs.readdirSync(CONTENT_DIR)) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;

    for (const file of fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'))) {
      const filePath = path.join(catDir, file);
      const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
      posts.push({
        slug: file.replace('.mdx', ''),
        title: data.title || '',
        category: data.category || cat,
        keywords: data.keywords || [],
        tags: data.tags || [],
        filePath,
      });
    }
  }

  return posts;
}

// ── Find related posts ──────────────────────────────────
function findRelatedPosts(post: PostInfo, allPosts: PostInfo[]): PostInfo[] {
  const scores: { post: PostInfo; score: number }[] = [];

  for (const other of allPosts) {
    if (other.slug === post.slug) continue;

    let score = 0;

    // Same category bonus
    if (other.category === post.category) score += 2;

    // Keyword overlap
    for (const kw of post.keywords) {
      if (other.keywords.some(ok => ok.includes(kw) || kw.includes(ok))) score += 3;
    }

    // Tag overlap
    for (const tag of post.tags) {
      if (other.tags.includes(tag)) score += 1;
    }

    if (score > 0) {
      scores.push({ post: other, score });
    }
  }

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.post);
}

// ── Count existing internal links ───────────────────────
function countInternalLinks(content: string, allSlugs: string[]): number {
  let count = 0;
  for (const slug of allSlugs) {
    if (content.includes(`/blog/${slug}`)) count++;
  }
  return count;
}

// ── Insert inline links ─────────────────────────────────
function insertInlineLinks(content: string, relatedPosts: PostInfo[], allSlugs: string[]): string {
  const existingCount = countInternalLinks(content, allSlugs);
  if (existingCount >= MAX_LINKS) return content;

  const linksToAdd = MAX_LINKS - existingCount;
  let added = 0;

  const lines = content.split('\n');
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i]);

    if (added >= linksToAdd) continue;

    // Look for paragraphs (non-empty lines that aren't headings, lists, tables, etc.)
    const line = lines[i].trim();
    const isContentLine = line.length > 30 &&
      !line.startsWith('#') &&
      !line.startsWith('-') &&
      !line.startsWith('|') &&
      !line.startsWith('>') &&
      !line.startsWith('```') &&
      !line.startsWith('![');

    // Insert link after content paragraphs, before empty lines
    if (isContentLine && i + 1 < lines.length && lines[i + 1].trim() === '') {
      const candidate = relatedPosts[added];
      if (candidate && !content.includes(`/blog/${candidate.slug}`)) {
        // Don't insert, we'll add them in the related section instead
        // Only insert if content naturally mentions a related topic
        for (const kw of candidate.keywords) {
          if (line.includes(kw) && !line.includes(`/blog/${candidate.slug}`)) {
            // Replace first occurrence of keyword with a link
            const linkedLine = result[result.length - 1].replace(
              kw,
              `[${kw}](/blog/${candidate.slug})`
            );
            if (linkedLine !== result[result.length - 1]) {
              result[result.length - 1] = linkedLine;
              added++;
              break;
            }
          }
        }
      }
    }
  }

  return result.join('\n');
}

// ── Add related posts section ───────────────────────────
function addRelatedSection(content: string, relatedPosts: PostInfo[]): string {
  // Skip if already has related section
  if (content.includes(RELATED_SECTION_HEADER)) return content;

  if (relatedPosts.length === 0) return content;

  const links = relatedPosts
    .slice(0, 3)
    .map(p => `- [${p.title}](/blog/${p.slug})`)
    .join('\n');

  const section = `\n\n${RELATED_SECTION_HEADER}\n\n${links}\n`;

  return content.trimEnd() + section;
}

// ── Process single post ─────────────────────────────────
function processPost(post: PostInfo, allPosts: PostInfo[]): boolean {
  const raw = fs.readFileSync(post.filePath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);

  const relatedPosts = findRelatedPosts(post, allPosts);
  if (relatedPosts.length === 0) return false;

  const allSlugs = allPosts.map(p => p.slug);

  // Insert inline links where keywords match
  let updated = insertInlineLinks(content, relatedPosts, allSlugs);

  // Add related section at the end
  updated = addRelatedSection(updated, relatedPosts);

  if (updated === content) return false;

  // Write back
  const final = matter.stringify(updated, frontmatter);
  fs.writeFileSync(post.filePath, final, 'utf-8');
  return true;
}

// ── Main ────────────────────────────────────────────────
function main() {
  console.log('\n🔗 내부 링크 최적화 시작\n');

  const allPosts = buildIndex();
  console.log(`📋 총 ${allPosts.length}개 포스트 인덱싱 완료\n`);

  let updated = 0;
  for (const post of allPosts) {
    const changed = processPost(post, allPosts);
    if (changed) {
      updated++;
      console.log(`   ✅ 링크 추가: ${post.slug}`);
    }
  }

  console.log(`\n✅ ${updated}/${allPosts.length}개 포스트 업데이트 완료!\n`);
}

main();
