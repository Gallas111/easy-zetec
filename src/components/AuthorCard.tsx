import Link from 'next/link';

interface AuthorCardProps {
    date?: string;
    readingTime?: string;
}

export default function AuthorCard({ date, readingTime }: AuthorCardProps) {
    return (
        <div className="flex gap-4 items-start p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl my-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💰</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">쉬운재테크 편집팀</span>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-700">재테크 정보 에디터</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
                    경제·금융 전공 편집진이 금융감독원, 한국은행, 국세청 등 공신력 있는 자료를 바탕으로 작성·검수합니다.
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    {date && <span>📅 {date}</span>}
                    {readingTime && <span>⏱️ {readingTime}</span>}
                    <Link href="/about" className="text-blue-500 hover:underline font-medium">편집 원칙 보기</Link>
                </div>
            </div>
        </div>
    );
}
