"use client";

import { useState } from "react";
import { PostMeta } from "@/lib/mdx";
import { Category } from "@/lib/categories";
import PostCard from "./PostCard";

interface Props {
  posts: PostMeta[];
  categories: Category[];
}

export default function BlogFilteredList({ posts, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts;

  return (
    <>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === null
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "bg-white text-[var(--color-text-light)] border border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
          }`}
        >
          전체
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.folderName)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.folderName
                ? "text-white shadow-sm"
                : "bg-white text-[var(--color-text-light)] border border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
            }`}
            style={
              activeCategory === cat.folderName
                ? { backgroundColor: cat.color }
                : {}
            }
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-[var(--color-text-light)] text-lg">
            아직 작성된 글이 없습니다
          </p>
        </div>
      )}
    </>
  );
}
