"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface SearchablePost {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
}

interface Props {
  posts: SearchablePost[];
}

export default function SearchBar({ posts }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Filter posts based on debounced query
  const results =
    debouncedQuery.trim().length > 0
      ? posts.filter((post) => {
          const q = debouncedQuery.toLowerCase();
          return (
            post.title.toLowerCase().includes(q) ||
            post.description.toLowerCase().includes(q) ||
            (post.tags &&
              post.tags.some((tag) => tag.toLowerCase().includes(q)))
          );
        })
      : [];

  const showDropdown = isOpen && debouncedQuery.trim().length > 0;

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    []
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mb-8">
      <div className="relative">
        {/* Magnifying glass icon */}
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)] pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="글 검색..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-sm"
        />
        {/* Clear button */}
        {query.length > 0 && (
          <button
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors text-[var(--color-text-light)]"
            aria-label="검색어 지우기"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div className="absolute z-40 top-full mt-2 w-full bg-white rounded-xl border border-[var(--color-border)] shadow-lg max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                      setDebouncedQuery("");
                    }}
                    className="block px-4 py-3 hover:bg-[#F0FDFA] transition-colors"
                  >
                    <p className="text-sm font-medium text-[var(--color-text)] leading-snug">
                      {post.title}
                    </p>
                    <p className="text-xs text-[var(--color-text-light)] mt-1 line-clamp-1">
                      {post.description}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-[var(--color-text-light)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-[var(--color-text-light)]">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
}
