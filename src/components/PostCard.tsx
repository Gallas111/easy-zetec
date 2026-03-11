import Link from "next/link";
import { PostMeta } from "@/lib/mdx";
import { getCategoryByFolder } from "@/lib/categories";

interface PostCardProps {
  post: PostMeta;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const category = getCategoryByFolder(post.category);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className={`bg-[var(--color-bg-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary-light)] hover:shadow-lg transition-all duration-300 ${
          featured ? "md:flex" : ""
        }`}
      >
        {/* Thumbnail */}
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${
            featured ? "md:w-1/2 h-48 md:h-auto" : "h-48"
          }`}
        >
          {post.image && post.image !== "/images/default-og.png" ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-30">
                {category?.icon || "💰"}
              </span>
            </div>
          )}

          {/* Category badge */}
          {category && (
            <span
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className={`p-5 ${featured ? "md:w-1/2 md:p-8 md:flex md:flex-col md:justify-center" : ""}`}>
          <h3
            className={`font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 ${
              featured ? "text-xl md:text-2xl mb-3" : "text-lg mb-2"
            }`}
          >
            {post.title}
          </h3>
          <p className="text-[var(--color-text-light)] text-sm line-clamp-2 mb-4 leading-relaxed">
            {post.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-light)]">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{post.readingTime}분 읽기</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
