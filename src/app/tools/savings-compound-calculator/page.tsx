import type { Metadata } from "next";
import Link from "next/link";
import SavingsCompoundCalculator from "@/components/SavingsCompoundCalculator";

export const metadata: Metadata = {
  title: "예적금 이자 계산기 — 단리·월복리·세후 실수령액 2026",
  description:
    "예금(목돈 거치)과 적금(매월 적립)의 이자를 단리·월복리로 계산하고, 이자소득세 15.4%·세금우대 9.5%·비과세까지 반영한 만기 실수령액을 바로 확인하세요. 월별 누적 표와 그래프 제공.",
  keywords: [
    "예금 이자 계산기",
    "적금 이자 계산기",
    "복리 계산기",
    "단리 복리 차이",
    "적금 만기 계산",
    "이자소득세 15.4%",
    "세후 이자 계산",
    "예적금 계산기",
  ],
  alternates: {
    canonical: "/tools/savings-compound-calculator",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.easyzetec.com/tools/savings-compound-calculator",
    siteName: "쉬운재테크",
    title: "예적금 이자 계산기 — 단리·월복리·세후 실수령액 2026",
    description:
      "예금·적금 이자를 단리·월복리로 계산하고 이자소득세 15.4%를 뺀 만기 실수령액을 바로 확인하세요.",
    images: [
      {
        url: "https://www.easyzetec.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "예적금 이자 계산기 - 쉬운재테크",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "예적금 이자 계산기 — 단리·월복리·세후 실수령액 2026",
    description: "예금·적금 이자와 세후 만기 실수령액을 바로 계산해 보세요.",
    images: ["https://www.easyzetec.com/images/og-image.png"],
  },
};

const faqs = [
  {
    q: "적금 이자가 왜 광고 금리보다 적게 나오나요?",
    a: "적금은 매달 넣은 돈마다 '예치된 개월 수'만큼만 이자가 붙기 때문이에요. 12개월 적금이라면 1회차 납입금은 12개월치 이자를 받지만 마지막 회차는 1개월치만 받아요. 평균하면 약 (12+1)÷2 = 6.5개월치라서, 표면금리 4%짜리 적금의 실제 수익률은 납입 원금 대비 2%대 초반이 돼요.",
  },
  {
    q: "이자소득세 15.4%는 어떻게 구성되나요?",
    a: "이자소득세 14%(소득세법상 이자소득 원천징수세율)와 지방소득세 1.4%(소득세의 10%)를 합친 값이에요. 은행이 이자를 지급할 때 자동으로 원천징수하므로 통장에는 세금을 뗀 금액이 들어와요. 이자·배당 등 금융소득이 연 2,000만원을 넘으면 금융소득종합과세 대상이 될 수 있어요.",
  },
  {
    q: "세금우대 9.5%는 누가 받을 수 있나요?",
    a: "세금우대저축은 이자소득세 9%에 농어촌특별세 0.5%를 더해 9.5%만 과세되는 상품이에요. 신협·새마을금고·농협 등 상호금융 조합원 대상 상품 등에서 볼 수 있는데, 대상·한도·세율은 상품과 시기에 따라 달라져요. 가입 전 해당 기관에서 현재 적용 세율을 꼭 확인하세요.",
  },
  {
    q: "비과세로 이자를 받는 방법이 있나요?",
    a: "비과세종합저축이 대표적이에요. 전 금융기관 합산 원금 5,000만원까지 이자소득세가 면제돼요. 다만 만 65세 이상(2026년부터 기초연금 수급 대상자 요건 추가), 장애인, 독립유공자 등 자격 요건이 있어서 아무나 가입할 수는 없어요. 요건과 한도는 바뀔 수 있으니 가입 시점에 확인이 필요해요.",
  },
  {
    q: "단리와 월복리는 실제로 얼마나 차이 나나요?",
    a: "1,000만원을 연 3.5%에 12개월 예치하면 단리 세전 이자는 35만원, 월복리는 약 35만 5,700원으로 차이가 5,000원대예요. 기간이 1~3년이면 차이가 크지 않지만, 기간이 길어지고 금리가 높아질수록 복리 효과가 기하급수적으로 커져요. 참고로 시중 예·적금 대부분은 단리 상품이에요.",
  },
  {
    q: "이 계산기 결과가 실제 은행 이자와 똑같나요?",
    a: "아니요, 참고용 추정치예요. 실제 은행은 일할(日割) 계산을 쓰고, 납입일·영업일, 원 단위 절사, 우대금리 충족 여부에 따라 금액이 달라져요. 계산 구조와 규모를 가늠하는 용도로 쓰고, 정확한 만기 금액은 해당 은행 상품설명서와 앱에서 확인하세요.",
  },
];

export default function SavingsCompoundCalculatorPage() {
  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "예적금 이자 계산기",
    url: "https://www.easyzetec.com/tools/savings-compound-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description:
      "예금(거치식)과 적금(월적립)의 이자를 단리·월복리 방식으로 계산하고, 이자소득세 15.4%·세금우대 9.5%·비과세를 반영한 만기 실수령액과 월별 누적 내역을 보여주는 무료 계산기.",
    publisher: {
      "@type": "Organization",
      name: "쉬운재테크",
      url: "https://www.easyzetec.com",
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "https://www.easyzetec.com" },
      {
        "@type": "ListItem",
        position: 2,
        name: "예적금 이자 계산기",
        item: "https://www.easyzetec.com/tools/savings-compound-calculator",
      },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-light)] mb-6">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
          홈
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-[var(--color-text)] font-medium">예적금 이자 계산기</span>
      </nav>

      <header className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] leading-tight">
          예적금 이자 계산기 — 단리·월복리·세후 실수령액 (2026)
        </h1>
        <p className="mt-3 text-[var(--color-text-light)]">
          예금(목돈 거치)과 적금(매월 적립)의 이자를 단리·월복리로 계산하고, 이자소득세
          15.4%·세금우대 9.5%·비과세까지 반영한 만기 실수령액을 바로 보여드려요. 월별로 원금과
          이자가 어떻게 쌓이는지 표와 그래프로도 확인할 수 있어요.
        </p>
      </header>

      {/* 계산기 */}
      <SavingsCompoundCalculator />

      {/* 설명 콘텐츠 */}
      <div className="prose max-w-none">
        <h2>예금과 적금, 이자 계산이 다른 이유</h2>
        <p>
          <strong>예금(정기예금)</strong>은 목돈을 한 번에 넣고 만기까지 거치하는 상품이고,{" "}
          <strong>적금(정기적금)</strong>은 매달 일정 금액을 나눠 넣는 상품이에요. 둘 다 같은
          &lsquo;연 4%&rsquo;라고 적혀 있어도 실제 받는 이자는 크게 달라요. 예금은 전체 원금이
          전체 기간 동안 예치되지만, 적금은 매달 넣은 돈마다 <strong>남은 개월 수만큼만</strong>{" "}
          이자가 붙기 때문이에요. 12개월 적금에서 첫 달에 넣은 돈은 12개월치 이자를 받지만,
          마지막 달에 넣은 돈은 딱 1개월치만 받아요. 그래서 적금의 체감 수익률은 표면금리의 절반
          수준이 돼요.
        </p>

        <h2>이자 계산 공식 — 단리와 월복리</h2>
        <p>이 계산기가 쓰는 공식은 은행 금융계산기와 같은 표준 방식이에요.</p>
        <blockquote>
          <p>
            <strong>예금 단리 이자 = 원금 × 연금리 × 개월 수 ÷ 12</strong>
          </p>
          <p>
            <strong>예금 월복리 만기금 = 원금 × (1 + 연금리/12)^개월 수</strong>
          </p>
          <p>
            <strong>적금 단리 총이자 = 월납입액 × 연금리 × n(n+1)/2 ÷ 12</strong> (n = 납입
            개월 수, 매월 초 납입 가정)
          </p>
        </blockquote>
        <p>
          적금 단리 공식이 낯설게 보이지만 원리는 간단해요. k번째 납입금은 (n−k+1)개월 동안
          예치되니, 각 회차의 이자(월납입액 × 연금리 × 예치개월/12)를 전부 더하면 1+2+…+n =
          n(n+1)/2가 나와요. 즉 <strong>평균 예치 기간이 (n+1)/2개월</strong>이라는 뜻이에요.
          12개월 적금이면 평균 6.5개월치 이자만 받는 셈이죠. 월복리 적금은 매달 원금과 이미 붙은
          이자에 연금리÷12를 다시 굴리는 방식으로, 회차별 납입금이 남은 개월 수만큼 매월
          복리로 불어나요.
        </p>

        <h2>이자소득세 15.4% — 세전과 세후는 다르다</h2>
        <p>
          은행이 보여주는 금리는 <strong>세전 금리</strong>예요. 이자를 받을 때는{" "}
          <strong>이자소득세 14% + 지방소득세 1.4%(소득세의 10%) = 15.4%</strong>가 자동으로
          원천징수돼요. 세전 이자가 100만원이면 실제 통장에는 84만 6,000원이 들어오는 거죠. 세율
          유형은 크게 세 가지예요.
        </p>
        <ul>
          <li>
            <strong>일반과세 15.4%</strong> — 대부분의 예·적금에 기본 적용 (소득세 14% +
            지방소득세 1.4%)
          </li>
          <li>
            <strong>세금우대 9.5%</strong> — 소득세 9% + 농어촌특별세 0.5%. 상호금융(신협·새마을금고
            등) 조합원 대상 상품 등에서 적용되며, 대상·한도·세율은 상품과 시기에 따라 달라요
          </li>
          <li>
            <strong>비과세 0%</strong> — 비과세종합저축(전 금융기관 합산 원금 5,000만원 한도).
            만 65세 이상(2026년부터 기초연금 수급 대상자 요건), 장애인, 독립유공자 등 자격 요건이
            있어요
          </li>
        </ul>
        <p>
          같은 세전 이자 35만원이라도 일반과세면 세후 29만 6,100원, 세금우대면 31만 6,750원,
          비과세면 35만원 그대로예요. 자격이 된다면 세금우대·비과세 한도부터 채우는 게 금리
          0.5%p 더 받는 것보다 효과가 클 때가 많아요. 참고로 이자·배당 등 금융소득이 연
          2,000만원을 넘으면 금융소득종합과세 대상이 되어 다른 소득과 합산 과세될 수 있어요.
        </p>

        <h2>계산 예시 (직접 따라 해보기)</h2>
        <h3>예시 1. 월 50만원 적금, 연 4%, 12개월 (단리)</h3>
        <p>
          납입 원금은 600만원. 세전 이자는 50만원 × 4% × (12×13/2) ÷ 12 = <strong>13만원</strong>
          이에요. &ldquo;600만원의 4%면 24만원 아닌가?&rdquo; 싶지만, 평균 예치 기간이
          6.5개월이라 딱 절반 수준이 나와요. 일반과세 15.4%를 떼면 세후 이자는 10만 9,980원,
          만기 실수령액은 <strong>610만 9,980원</strong>이에요. 이런 계산이 헷갈릴 때 위
          계산기에 넣으면 세후 금액과 월별 누적 표까지 한 번에 확인할 수 있어요.
        </p>
        <h3>예시 2. 1,000만원 예금, 연 3.5%, 12개월</h3>
        <p>
          단리 세전 이자는 1,000만원 × 3.5% = 35만원. 월복리로 계산하면 (1+0.035/12)^12로 약
          35만 5,700원이 붙어 <strong>차이는 5,700원 정도</strong>예요. 1년짜리 상품에서 단리와
          월복리의 차이는 생각보다 크지 않죠. 대신 세금의 영향이 더 커요. 일반과세 세후 이자는
          29만 6,100원으로, 세금으로 5만 3,900원이 빠져나가요.
        </p>
        <h3>예시 3. 같은 돈, 예금 vs 적금</h3>
        <p>
          수중에 600만원이 있다면 매달 50만원씩 적금(연 4%)에 넣는 것보다, 600만원을 통째로 연
          3.5% 예금에 넣는 쪽의 세전 이자(21만원)가 적금(13만원)보다 많아요. 적금 금리가 예금보다
          1%p 이상 높아도 목돈이 이미 있다면 예금이 유리한 경우가 많은 이유예요. 이미 있는 목돈과
          매달 모으는 돈을 나눠서 각각 예금·적금에 배치하는 게 기본 전략이에요.
        </p>

        <h2>단리 vs 월복리, 언제 의미 있게 벌어질까</h2>
        <p>
          복리는 &lsquo;이자에 이자가 붙는&rsquo; 구조라 <strong>기간이 길수록, 금리가
          높을수록</strong> 격차가 커져요. 연 3.5% 기준 1년이면 단리 대비 +0.06%p 수준이지만,
          3년이면 원금 1,000만원에 단리 105만원 vs 월복리 약 110만 5,400원으로 5만 원 넘게
          벌어져요. 다만 시중 정기예금·적금은 대부분 단리 상품이고, 월복리는 일부 특판이나
          복리식 상품에만 적용돼요. 상품설명서에서 &lsquo;이자 지급 방식&rsquo;이 단리인지
          복리인지 먼저 확인한 뒤 계산기에서 같은 방식으로 비교하세요.
        </p>

        <h2>세후 실수령액을 늘리는 현실적인 방법</h2>
        <ol>
          <li>
            <strong>세금우대·비과세 한도부터 확인한다</strong> — 자격이 된다면 세율이 15.4% →
            9.5% → 0%로 내려가는 효과가 금리 우대보다 큰 경우가 많아요.
          </li>
          <li>
            <strong>목돈은 예금, 매달 모으는 돈은 적금</strong> — 위 예시 3처럼 목돈을 적금에
            나눠 넣으면 평균 예치 기간이 짧아져 손해예요. 적금 금리를 유지하면서 목돈 이자도
            챙기는 기법이 궁금하다면{" "}
            <Link href="/blog/savings-prepay-defer-615-111-2026">적금 선납이연 방법</Link>을
            참고하세요.
          </li>
          <li>
            <strong>대기 자금은 파킹통장에</strong> — 만기 후 방치된 돈은 이자가 거의 없어요.{" "}
            <Link href="/blog/parking-account-interest-rate-2026">파킹통장 금리 비교</Link>에서
            매일 이자가 붙는 통장을 확인해 두세요.
          </li>
          <li>
            <strong>원금+이자가 보호 한도 안인지 확인한다</strong> — 예금자보호는 원금과 이자를
            합쳐 1인당 금융회사별 1억원까지예요. 자세한 기준은{" "}
            <Link href="/blog/depositor-protection-limit-100m-split-strategy-2026">
              예금자보호한도 1억원 정리
            </Link>
            에서 확인하세요.
          </li>
          <li>
            <strong>우대금리 조건을 끝까지 채운다</strong> — 급여이체·자동이체·카드실적 같은
            우대 조건은 놓치면 표면금리가 그대로 깎여요.
          </li>
        </ol>

        <h2>주의사항</h2>
        <p>
          이 계산기는 <strong>매월 초 납입·만기 일시 지급을 가정한 참고용 추정치</strong>예요.
          실제 은행은 일할(日割) 계산을 쓰기 때문에 납입일, 영업일, 윤년, 원 단위 절사에 따라
          금액이 소액 달라질 수 있어요. 또 세금우대·비과세의 대상과 한도, 세율은 세법 개정에
          따라 바뀌므로 이 페이지의 수치는 작성 시점(2026년 7월) 기준이에요.{" "}
          <strong>실제 가입 전에는 반드시 해당 금융기관의 상품설명서와 최신 세율을
          확인</strong>하세요. 본 자료는 정보 제공 목적일 뿐, 특정 금융상품 가입을 권유하지
          않아요.
        </p>

        <h2>자주 묻는 질문 (FAQ)</h2>
        {faqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}

        <h2>함께 보면 좋은 글</h2>
        <ul>
          <li>
            <Link href="/blog/depositor-protection-limit-100m-split-strategy-2026">
              예금자보호한도 1억원 2026 — 예적금 나눠 넣기, 이제 어떻게 바뀔까
            </Link>
          </li>
          <li>
            <Link href="/blog/savings-prepay-defer-615-111-2026">
              적금 선납이연 방법 2026 — 6-1-5·1-11 원리와 이자 더 챙기는 법
            </Link>
          </li>
          <li>
            <Link href="/blog/parking-account-interest-rate-2026">
              2026 파킹통장 금리 비교 — 연 3% 이상 받는 통장 TOP 5
            </Link>
          </li>
          <li>
            <Link href="/blog/savings-vs-deposit-difference-guide">
              적금 vs 예금 차이 완벽 정리 — 내 돈에 맞는 선택법
            </Link>
          </li>
        </ul>

        <p className="text-sm text-[var(--color-text-light)]">
          참고 출처:{" "}
          <a href="https://www.nts.go.kr" rel="nofollow noopener" target="_blank">
            국세청
          </a>
          (이자소득 원천징수세율 — 소득세법 제129조 이자소득 14%, 지방세법상 지방소득세 1.4%),{" "}
          <a
            href="https://portal.kfb.or.kr"
            rel="nofollow noopener"
            target="_blank"
          >
            전국은행연합회 소비자포털
          </a>
          (예·적금 금융계산기 산식),{" "}
          <a href="https://www.bok.or.kr" rel="nofollow noopener" target="_blank">
            한국은행
          </a>
          (기준금리·수신금리 통계) — 세율·산식 2026년 7월 확인.
        </p>
      </div>
    </article>
  );
}
