"use client";

import { useState, useEffect } from "react";

interface Heading {
  level: number;
  text: string;
  id: string;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5">
        <h4 className="text-sm font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h12M4 18h8" />
          </svg>
          목차
        </h4>
        <ul className="space-y-1.5">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block text-sm py-1 transition-colors ${
                  heading.level === 3 ? "pl-4" : ""
                } ${
                  activeId === heading.id
                    ? "text-[var(--color-primary)] font-medium"
                    : "text-[var(--color-text-light)] hover:text-[var(--color-primary)]"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
