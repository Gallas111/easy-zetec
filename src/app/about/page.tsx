import { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개 — 쉬운재테크 편집팀",
  description:
    "쉬운재테크 편집팀의 콘텐츠 작성·검수 프로세스, 참고 자료, 정정·면책 정책을 안내합니다. 재테크 초보도 따라하기 쉬운 금융 정보 블로그.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
        쉬운재테크 소개
      </h1>
      <div className="prose">
        <p>
          <strong>쉬운재테크(easyzetec.com)</strong>는 재테크가 어렵게 느껴지는
          분들을 위해 만들어진 금융 정보 블로그입니다. 적금 금리 비교부터 ETF
          투자, 연말정산 꿀팁, 청약 전략까지 — 누구나 쉽게 이해할 수 있도록
          정리해서 알려드립니다.
        </p>

        <h2>편집팀 구성</h2>
        <ul>
          <li>
            <strong>금융 자문진</strong> — 한국 금융업·세무 분야 실무 경험과
            공식 자료(국세청·금감원·한국은행 통계)를 기반으로 콘텐츠 정확성을
            검수합니다.
          </li>
          <li>
            <strong>콘텐츠 에디터</strong> — 어려운 금융 용어를 일상 언어로
            풀어내고, 가독성을 담당합니다.
          </li>
          <li>
            <strong>SEO·UX 담당</strong> — 검색 의도 분석, 본문 구조, 사용자
            경험 최적화를 담당합니다.
          </li>
        </ul>

        <h2>콘텐츠 작성·검수 프로세스</h2>
        <ol>
          <li>
            <strong>주제 선정</strong> — 검색 트렌드(Google·Naver)와 독자 질문
            분석으로 주제 결정.
          </li>
          <li>
            <strong>리서치</strong> — 국세청·금감원·한국은행 공식 자료, 주요
            은행·증권사 상품 안내, 한국세무사회 매뉴얼을 교차 참고.
          </li>
          <li>
            <strong>초안 작성</strong> — 실제 시뮬레이션과 사례 중심으로 작성.
          </li>
          <li>
            <strong>전문 검수</strong> — 금융 자문진이 수치·법령·세율의 최신성과
            정확성을 점검.
          </li>
          <li>
            <strong>발행·업데이트</strong> — 세법·금리 변동을 반영해 주기적으로
            업데이트하며 <code>dateModified</code>를 갱신합니다.
          </li>
        </ol>

        <h2>우리가 다루는 주제</h2>
        <ul>
          <li>재테크 기초 — 금융 용어, 저축 습관, 가계부 작성법</li>
          <li>저축·예금 — 적금 추천, 금리 비교, 파킹통장</li>
          <li>투자·주식 — ETF, 배당주, 해외주식 초보 가이드</li>
          <li>절세·세금 — 연말정산, 세액공제, ISA/IRP 활용</li>
          <li>부동산 — 청약, 주택담보대출, 전세 팁</li>
        </ul>

        <h2>참고 자료·출처</h2>
        <ul>
          <li>
            <strong>국세청 국세법령정보시스템</strong> — 세법·세율·공제 항목
          </li>
          <li>
            <strong>금융감독원 통합공시 시스템</strong> — 금융 상품 비교
          </li>
          <li>
            <strong>한국은행 경제통계시스템(ECOS)</strong> — 금리·환율 통계
          </li>
          <li>
            <strong>한국세무사회·한국공인회계사회</strong> — 세무 자문 매뉴얼
          </li>
        </ul>

        <h2>면책 안내</h2>
        <p>
          본 사이트의 모든 콘텐츠는 <strong>정보 제공 목적</strong>으로만
          작성되었으며, 특정 금융 상품에 대한 투자 권유나 세무 자문이 아닙니다.
          금리·세율·공제 한도 등은 정책 변경에 따라 달라질 수 있으며, 투자·세무
          결정에 대한 책임은 본인에게 있습니다. 중요한 결정은 반드시 해당 분야
          전문가(세무사·금융 전문가) 상담을 통해 이루어져야 합니다.
        </p>

        <h2>정정·업데이트 정책</h2>
        <p>
          발행된 콘텐츠에 사실 오류·법령 변경·수치 오류가 발견되면{" "}
          <strong>24시간 내 정정</strong>하고 본문에 정정 사실을 표기합니다.
          제보·정정 요청은 아래 연락처로 보내주시면 검토 후 회신드립니다.
        </p>

        <h2>연락처</h2>
        <ul>
          <li>
            <strong>편집팀 이메일</strong> — kingyw17@gmail.com
          </li>
          <li>
            <strong>광고·제휴·정정 요청</strong> — 동일 이메일로 문의
          </li>
        </ul>
      </div>
    </div>
  );
}
