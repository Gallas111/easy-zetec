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
            </div>
        </div>
    );
}
