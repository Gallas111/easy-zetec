import { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { categories } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import BlogFilteredList from "@/components/BlogFilteredList";

export const metadata: Metadata = {
  title: "전체 글 - 재테크 가이드 모아보기",
  description:
    "저축, 투자, 절세, 부동산 등 재테크에 필요한 모든 정보를 카테고리별로 모아보세요.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const allPosts = getAllPosts().filter((p) => !p.noindex);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-3">
          전체 글
        </h1>
        <p className="text-[var(--color-text-light)] text-lg">
          재테크에 필요한 모든 정보를 한곳에 모았습니다
        </p>
      </div>

      <BlogFilteredList posts={allPosts} categories={categories} />
    </div>
  );
}
