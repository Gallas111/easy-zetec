import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg-dark)] text-[var(--color-text-inverse)] mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white font-bold">
                Z
              </span>
              <span className="text-lg font-bold">쉬운재테크</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              재테크 초보도 쉽게 따라할 수 있는
              <br />
              저축, 투자, 절세 가이드
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              카테고리
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/blog/category/${cat.slug}`}
                    className="text-gray-300 hover:text-[var(--color-primary-light)] text-sm transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              정보
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[var(--color-primary-light)] text-sm transition-colors"
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-[var(--color-primary-light)] text-sm transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-[var(--color-primary-light)] text-sm transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} 쉬운재테크. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            본 사이트의 정보는 투자 권유가 아니며, 투자 결정에 대한 책임은
            본인에게 있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
