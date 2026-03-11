import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-6">🔍</p>
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-3">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-[var(--color-text-light)] mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="inline-flex px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
