import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '문의하기 | 쉬운재테크',
    description: '쉬운재테크에 문의하기. 콘텐츠 관련 제보, 오류 정정 요청, 기타 문의를 보내주세요.',
};

export default function ContactPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-[var(--color-text)]">
                문의하기
            </h1>
            <p className="text-center text-[var(--color-text-light)] mb-12 max-w-xl mx-auto">
                콘텐츠 관련 제보, 오류 정정 요청, 광고 문의 등 무엇이든 편하게 보내주세요.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[var(--color-bg)] p-8 rounded-2xl border border-[var(--color-border)] text-center">
                    <div className="text-4xl mb-4">📧</div>
                    <h2 className="text-lg font-bold mb-2 text-[var(--color-text)]">이메일</h2>
                    <a href="mailto:contact@easyzetec.com" className="text-[var(--color-primary)] hover:underline">
                        contact@easyzetec.com
                    </a>
                    <p className="text-sm text-[var(--color-text-light)] mt-2">영업일 기준 1~2일 내 답변드립니다.</p>
                </div>

                <div className="bg-[var(--color-bg)] p-8 rounded-2xl border border-[var(--color-border)] text-center">
                    <div className="text-4xl mb-4">📍</div>
                    <h2 className="text-lg font-bold mb-2 text-[var(--color-text)]">소재지</h2>
                    <p className="text-[var(--color-text-light)]">대한민국 서울</p>
                </div>
            </div>
        </div>
    );
}
