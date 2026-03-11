"use client";

interface Props {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: Props) {
  const url = `https://www.easyzetec.com/blog/${slug}`;

  const share = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    if (urls[platform]) window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert("링크가 복사되었습니다!");
  };

  return (
    <div className="mt-10 flex items-center gap-3">
      <span className="text-sm text-[var(--color-text-light)]">공유하기</span>
      <button
        onClick={() => share("twitter")}
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#1DA1F2] hover:text-white text-[var(--color-text-light)] flex items-center justify-center transition-all text-sm"
        aria-label="트위터 공유"
      >
        𝕏
      </button>
      <button
        onClick={() => share("facebook")}
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#1877F2] hover:text-white text-[var(--color-text-light)] flex items-center justify-center transition-all text-sm font-bold"
        aria-label="페이스북 공유"
      >
        f
      </button>
      <button
        onClick={copyLink}
        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-text-light)] flex items-center justify-center transition-all"
        aria-label="링크 복사"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>
    </div>
  );
}
