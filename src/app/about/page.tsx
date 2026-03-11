import { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개",
  description: "쉬운재테크는 재테크 초보도 쉽게 따라할 수 있는 금융 정보 블로그입니다.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
        쉬운재테크 소개
      </h1>
      <div className="prose">
        <p>
          <strong>쉬운재테크</strong>는 재테크가 어렵게 느껴지는 분들을 위해
          만들어진 금융 정보 블로그입니다.
        </p>
        <p>
          적금 금리 비교부터 ETF 투자, 연말정산 꿀팁, 청약 전략까지 — 누구나
          쉽게 이해할 수 있도록 정리해서 알려드립니다.
        </p>
        <h2>우리가 다루는 주제</h2>
        <ul>
          <li>재테크 기초 — 금융 용어, 저축 습관, 가계부 작성법</li>
          <li>저축·예금 — 적금 추천, 금리 비교, 파킹통장</li>
          <li>투자·주식 — ETF, 배당주, 해외주식 초보 가이드</li>
          <li>절세·세금 — 연말정산, 세액공제, ISA/IRP 활용</li>
          <li>부동산 — 청약, 주택담보대출, 전세 팁</li>
        </ul>
        <h2>투자 유의사항</h2>
        <p>
          본 사이트의 모든 콘텐츠는 정보 제공 목적으로만 작성되었으며, 특정
          금융 상품에 대한 투자 권유가 아닙니다. 투자 결정에 대한 책임은
          본인에게 있습니다.
        </p>
      </div>
    </div>
  );
}
