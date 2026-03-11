import Link from "next/link";
import { Category } from "@/lib/categories";

interface Props {
  category?: Category;
  title?: string;
}

export default function Breadcrumb({ category, title }: Props) {
  return (
    <nav className="flex items-center gap-2 text-sm text-[var(--color-text-light)] mb-6 overflow-x-auto">
      <Link
        href="/"
        className="hover:text-[var(--color-primary)] transition-colors whitespace-nowrap"
      >
        홈
      </Link>
      <span className="text-gray-300">/</span>
      <Link
        href="/blog"
        className="hover:text-[var(--color-primary)] transition-colors whitespace-nowrap"
      >
        블로그
      </Link>
      {category && (
        <>
          <span className="text-gray-300">/</span>
          <Link
            href={`/blog/category/${category.slug}`}
            className="hover:text-[var(--color-primary)] transition-colors whitespace-nowrap"
          >
            {category.name}
          </Link>
        </>
      )}
      {title && (
        <>
          <span className="text-gray-300">/</span>
          <span className="text-[var(--color-text)] font-medium truncate">
            {title}
          </span>
        </>
      )}
    </nav>
  );
}
