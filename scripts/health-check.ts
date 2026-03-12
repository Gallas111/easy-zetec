import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

interface Issue {
  file: string;
  type: 'error' | 'warning';
  message: string;
}

const REQUIRED_FIELDS = ['title', 'description', 'date', 'category', 'keywords', 'image', 'author'];

// ── Collect all posts ───────────────────────────────────
function getAllMdxFiles(): string[] {
  const files: string[] = [];
  if (!fs.existsSync(CONTENT_DIR)) return files;

  for (const cat of fs.readdirSync(CONTENT_DIR)) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    for (const file of fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'))) {
      files.push(path.join(catDir, file));
    }
  }
  return files;
}

// ── Get all slugs ───────────────────────────────────────
function getAllSlugs(files: string[]): string[] {
  return files.map(f => path.basename(f, '.mdx'));
}

// ── Validate frontmatter ────────────────────────────────
function validateFrontmatter(filePath: string): Issue[] {
  const issues: Issue[] = [];
  const slug = path.basename(filePath, '.mdx');

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!data[field]) {
        issues.push({
          file: slug,
          type: 'error',
          message: `프론트매터 필드 누락: ${field}`,
        });
      }
    }

    // Validate date format
    if (data.date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.date)) {
        issues.push({
          file: slug,
          type: 'warning',
          message: `날짜 형식 오류: "${data.date}" (YYYY-MM-DD 필요)`,
        });
      }
    }

    // Validate category
    const validCategories = ['basics', 'savings', 'investing', 'tax', 'real-estate'];
    if (data.category && !validCategories.includes(data.category)) {
      issues.push({
        file: slug,
        type: 'warning',
        message: `유효하지 않은 카테고리: "${data.category}"`,
      });
    }

    // Validate keywords is array
    if (data.keywords && !Array.isArray(data.keywords)) {
      issues.push({
        file: slug,
        type: 'error',
        message: 'keywords는 배열이어야 합니다.',
      });
    }

    // Validate author
    if (data.author && data.author !== '쉬운재테크') {
      issues.push({
        file: slug,
        type: 'warning',
        message: `작성자가 "쉬운재테크"가 아닙니다: "${data.author}"`,
      });
    }

  } catch (err: any) {
    issues.push({
      file: slug,
      type: 'error',
      message: `파싱 오류: ${err.message}`,
    });
  }

  return issues;
}

// ── Check internal links ────────────────────────────────
function checkInternalLinks(filePath: string, allSlugs: string[]): Issue[] {
  const issues: Issue[] = [];
  const slug = path.basename(filePath, '.mdx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find all internal links: [text](/blog/slug)
  const linkRegex = /\[([^\]]*)\]\(\/blog\/([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const linkedSlug = match[2];
    if (!allSlugs.includes(linkedSlug)) {
      issues.push({
        file: slug,
        type: 'error',
        message: `깨진 내부 링크: /blog/${linkedSlug}`,
      });
    }
  }

  return issues;
}

// ── Check images ────────────────────────────────────────
function checkImages(filePath: string): Issue[] {
  const issues: Issue[] = [];
  const slug = path.basename(filePath, '.mdx');

  const { data } = matter(fs.readFileSync(filePath, 'utf-8'));

  if (data.image) {
    const imagePath = path.join(PUBLIC_DIR, data.image);
    if (!fs.existsSync(imagePath)) {
      issues.push({
        file: slug,
        type: 'warning',
        message: `이미지 파일 없음: ${data.image}`,
      });
    }
  }

  return issues;
}

// ── Main ────────────────────────────────────────────────
function main() {
  console.log('\n🏥 블로그 건강 검사 시작\n');

  const files = getAllMdxFiles();
  const allSlugs = getAllSlugs(files);

  console.log(`📋 총 ${files.length}개 MDX 파일 검사\n`);

  const allIssues: Issue[] = [];

  for (const file of files) {
    allIssues.push(...validateFrontmatter(file));
    allIssues.push(...checkInternalLinks(file, allSlugs));
    allIssues.push(...checkImages(file));
  }

  const errors = allIssues.filter(i => i.type === 'error');
  const warnings = allIssues.filter(i => i.type === 'warning');

  if (errors.length > 0) {
    console.log(`\n❌ 오류 (${errors.length}건):`);
    for (const issue of errors) {
      console.log(`   [${issue.file}] ${issue.message}`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️ 경고 (${warnings.length}건):`);
    for (const issue of warnings) {
      console.log(`   [${issue.file}] ${issue.message}`);
    }
  }

  if (allIssues.length === 0) {
    console.log('✅ 모든 검사 통과! 문제 없습니다.\n');
  } else {
    console.log(`\n📊 검사 결과: ${errors.length}개 오류, ${warnings.length}개 경고\n`);
  }

  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
