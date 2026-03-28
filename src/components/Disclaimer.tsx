export default function Disclaimer() {
    return (
        <div className="my-8 p-5 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30">
            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">ℹ️</span>
                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>이 글은 일반적인 재테크 정보 제공 목적입니다</strong>
                        <p className="mt-1">
                            금융감독원, 한국은행 등 공신력 있는 자료를 참고하여 작성했으며, 특정 금융 상품에 대한 투자 권유가 아닙니다.
                            투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">📢</span>
                    <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        <strong>광고 공시</strong>
                        <p className="mt-1">
                            이 사이트는 Google AdSense를 통해 광고를 게재하며, 광고 수익으로 운영됩니다.
                            광고는 콘텐츠 내용과 무관하게 자동 배치되며, 편집팀의 콘텐츠 작성에 영향을 주지 않습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
