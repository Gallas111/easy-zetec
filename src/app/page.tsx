import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { categories } from "@/lib/categories";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const allPosts = getAllPosts().filter((p) => !p.noindex);
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1, 7);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#134E4A]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[var(--color-accent)] blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur text-white/90 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              누구나 쉽게 시작하는 재테크
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              돈 관리,
              <br />
              <span className="text-[var(--color-accent-light)]">
                어렵지 않아요
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
              적금 비교부터 ETF 투자, 연말정산 꿀팁까지.
              <br />
              재테크 초보도 쉽게 따라할 수 있게 설명해드려요.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="px-6 py-3 bg-white text-[var(--color-primary-dark)] font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                글 모아보기
              </Link>
              <Link
                href="/blog/category/basics"
                className="px-6 py-3 bg-white/15 backdrop-blur text-white font-semibold rounded-xl hover:bg-white/25 transition-colors border border-white/20"
              >
                재테크 기초부터
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Access */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}`}
              className="bg-white rounded-xl p-4 border border-[var(--color-border)] hover:border-[var(--color-primary-light)] hover:shadow-md transition-all text-center group"
            >
              <span className="text-2xl block mb-2">{cat.icon}</span>
              <span className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-6xl mx-auto px-4 mt-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-7 rounded-full bg-[var(--color-primary)]" />
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              추천 글
            </h2>
          </div>
          <PostCard post={featuredPost} featured />
        </section>
      )}

      {/* Recent Posts Grid */}
      {recentPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-7 rounded-full bg-[var(--color-accent)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                최근 글
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
            >
              전체보기 &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Category Sections */}
      {categories.map((cat) => {
        const catPosts = allPosts
          .filter((p) => p.category === cat.folderName)
          .slice(0, 3);
        if (catPosts.length === 0) return null;

        return (
          <section key={cat.slug} className="max-w-6xl mx-auto px-4 mt-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span
                  className="w-1.5 h-7 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <h2 className="text-2xl font-bold text-[var(--color-text)]">
                  {cat.icon} {cat.name}
                </h2>
              </div>
              <Link
                href={`/blog/category/${cat.slug}`}
                className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
              >
                더보기 &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {catPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Newsletter CTA */}
      <section className="max-w-6xl mx-auto px-4 mt-20 mb-10">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              재테크 꿀팁, 놓치지 마세요
            </h2>
            <p className="text-white/80 mb-6">
              매주 엄선한 재테크 정보를 무료로 보내드립니다
            </p>
            <Link
              href="/blog"
              className="inline-flex px-8 py-3 bg-white text-[var(--color-primary-dark)] font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              최신 글 보러가기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
