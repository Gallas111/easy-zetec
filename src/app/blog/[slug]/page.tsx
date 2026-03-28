import { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import {
  getAllPosts,
  getPostBySlug,
  getHeadings,
  getRelatedPosts,
  getAdjacentPosts,
} from "@/lib/mdx";
import { getCategoryByFolder } from "@/lib/categories";
import TableOfContents from "@/components/TableOfContents";
import PostNavigation from "@/components/PostNavigation";
import Breadcrumb from "@/components/Breadcrumb";
import Callout from "@/components/Callout";
import ComparisonTable from "@/components/ComparisonTable";
import KeyTakeaway from "@/components/KeyTakeaway";
import PostCard from "@/components/PostCard";
import ShareButtons from "@/components/ShareButtons";
import AuthorCard from "@/components/AuthorCard";
import Disclaimer from "@/components/Disclaimer";
import Link from "next/link";

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
    keywords: post.meta.keywords,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      images: [{ url: `https://www.easyzetec.com${post.meta.image}`, width: 1200, height: 630, alt: post.meta.title }],
    },
    ...(post.meta.noindex && {
      robots: { index: false, follow: false },
    }),
  };
}

const mdxComponents = {
  Callout,
  ComparisonTable,
  KeyTakeaway,
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const category = getCategoryByFolder(post.meta.category);
  const headings = getHeadings(post.content);
  const relatedPosts = getRelatedPosts(post.meta);
  const { prev, next } = getAdjacentPosts(slug);

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeHighlight],
      },
    },
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    author: {
      "@type": "Organization",
      name: "쉬운재테크 편집팀",
      url: "https://www.easyzetec.com/about",
      description: "경제·금융 전공 편집진",
    },
    publisher: {
      "@type": "Organization",
      name: "쉬운재테크",
      url: "https://www.easyzetec.com",
    },
    image: post.meta.image,
  };

  const faqJsonLd = post.meta.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.meta.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <article className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb category={category || undefined} title={post.meta.title} />

        <div className="lg:flex lg:gap-10">
          {/* Main Content */}
          <div className="lg:flex-1 min-w-0">
            {/* Post Header */}
            <header className="mb-10">
              {category && (
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white mb-4"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon} {category.name}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4 leading-tight">
                {post.meta.title}
              </h1>
              <p className="text-lg text-[var(--color-text-light)] mb-5">
                {post.meta.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-light)]">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(post.meta.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {post.meta.readingTime}분 읽기
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {post.meta.author}
                </span>
              </div>
            </header>

            {/* Author Card - E-E-A-T */}
            <AuthorCard date={post.meta.date} readingTime={`${post.meta.readingTime}분`} />

            {/* MDX Content */}
            <div className="prose">{content}</div>

            {/* Disclaimer & Ad Disclosure */}
            <Disclaimer />

            {/* FAQ Section */}
            {post.meta.faq && post.meta.faq.length > 0 && (
              <section className="mt-12 bg-[#F0FDFA] rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                  <span className="text-2xl">💬</span> 자주 묻는 질문
                </h2>
                <div className="space-y-4">
                  {post.meta.faq.map((item, i) => (
                    <details
                      key={i}
                      className="bg-white rounded-xl p-4 border border-[var(--color-border)] group"
                    >
                      <summary className="font-semibold text-[var(--color-text)] cursor-pointer list-none flex items-center justify-between">
                        <span>Q. {item.q}</span>
                        <svg
                          className="w-5 h-5 text-[var(--color-text-light)] group-open:rotate-180 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <p className="mt-3 text-[var(--color-text-light)] leading-relaxed">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Share */}
            <ShareButtons title={post.meta.title} slug={post.meta.slug} />

            {/* Post Navigation */}
            <PostNavigation prev={prev} next={next} />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-6">
                  관련 글
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map((rp) => (
                    <PostCard key={rp.slug} post={rp} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - TOC */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </article>
    </>
  );
}
