import Link from "next/link";
import { PostMeta } from "@/lib/mdx";

interface Props {
  prev: PostMeta | null;
  next: PostMeta | null;
}

export default function PostNavigation({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group bg-white rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary-light)] p-5 transition-all"
        >
          <span className="text-xs text-[var(--color-text-light)] flex items-center gap-1 mb-2">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            이전 글
          </span>
          <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group bg-white rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary-light)] p-5 transition-all text-right"
        >
          <span className="text-xs text-[var(--color-text-light)] flex items-center gap-1 justify-end mb-2">
            다음 글
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
          <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
