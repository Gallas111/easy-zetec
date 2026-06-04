import type { Metadata } from "next";
import Link from "next/link";
import DsrCalculator from "@/components/DsrCalculator";

export const metadata: Metadata = {
  title: "DSR 계산기 — 내 대출한도·총부채원리금상환비율 2026",
  description:
    "연소득과 기존 대출만 넣으면 DSR(총부채원리금상환비율)과 대출 가능 한도를 바로 계산해 드려요. 2026년 스트레스 DSR 3단계, 은행권 40%·제2금융권 50% 규제 반영.",
  keywords: [
    "DSR 계산기",
    "총부채원리금상환비율",
    "대출한도 계산기",
    "스트레스 DSR",
    "DSR 40%",
    "주담대 한도",
    "DSR DTI 차이",
  ],
  alternates: {
    canonical: "/tools/dsr-calculator",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.easyzetec.com/tools/dsr-calculator",
    siteName: "쉬운재테크",
    title: "DSR 계산기 — 내 대출한도·총부채원리금상환비율 2026",
    description:
      "연소득과 기존 대출만 넣으면 DSR과 대출 가능 한도를 바로 계산. 2026 스트레스 DSR 3단계 반영.",
    images: [
      {
        url: "https://www.easyzetec.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "DSR 계산기 - 쉬운재테크",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSR 계산기 — 내 대출한도·총부채원리금상환비율 2026",
    description: "연소득·기존 대출로 DSR과 대출 한도를 바로 계산해 보세요.",
    images: ["https://www.easyzetec.com/images/og-image.png"],
  },
};

const faqs = [
  {
    q: "DSR이 정확히 뭔가요?",
    a: "DSR(총부채원리금상환비율)은 내 연소득에서 1년 동안 갚아야 하는 모든 대출의 원금과 이자가 차지하는 비율이에요. 주택담보대출뿐 아니라 신용대출, 학자금, 자동차 할부까지 거의 모든 가계대출의 연간 원리금을 합쳐 계산해요.",
  },
  {
    q: "DSR 한도는 몇 퍼센트인가요?",
    a: "2026년 기준 차주단위 DSR 규제 한도는 은행권(제1금융권) 40%, 제2금융권 50%예요. 즉 은행에서 대출받을 때는 연소득의 40%를 넘는 원리금이 나오면 대출이 제한돼요.",
  },
  {
    q: "스트레스 DSR이 뭔가요? 왜 한도가 줄어드나요?",
    a: "스트레스 DSR은 앞으로 금리가 오를 가능성을 대비해, 대출 심사 때 실제 금리에 가산금리(스트레스 금리)를 더해 더 보수적으로 계산하는 제도예요. 가산금리만큼 원리금이 커지므로 같은 소득이라도 받을 수 있는 한도가 줄어들어요.",
  },
  {
    q: "DTI와 DSR은 어떻게 다른가요?",
    a: "DTI(총부채상환비율)는 주택담보대출의 원리금에 더해 다른 대출은 '이자만' 반영해요. 반면 DSR은 모든 대출의 '원금+이자'를 전부 반영하기 때문에 훨씬 엄격해요. 그래서 같은 사람이라도 DSR로 계산하면 한도가 더 작게 나와요.",
  },
  {
    q: "DSR 계산에 전세자금대출도 포함되나요?",
    a: "2026년 6월 기준 전세자금대출, 중도금대출, 정책서민금융상품 등 일부 대출은 DSR 산정에서 제외되거나 이자만 반영돼요. 다만 정책은 바뀔 수 있으니 실행 전 은행에 꼭 확인하세요.",
  },
  {
    q: "DSR 한도를 늘리려면 어떻게 해야 하나요?",
    a: "① 대출 기간을 늘려 연간 원리금을 줄이거나 ② 기존 신용대출·카드론을 먼저 상환해 분모를 비우거나 ③ 소득을 입증할 수 있는 자료(상여·임대소득 등)를 보강하는 방법이 있어요. 금리 유형을 고정형으로 바꾸면 스트레스 금리 부담도 줄어요.",
  },
  {
    q: "이 계산기 결과가 실제 은행 한도와 같나요?",
    a: "아니요, 참고용 추정치예요. 실제 한도는 LTV(담보인정비율), 방공제, 보증한도, 은행별 내규에 따라 달라져요. 정확한 한도는 반드시 해당 금융기관에서 확인해야 해요.",
  },
];

export default function DsrCalculatorPage() {
  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DSR 계산기",
    url: "https://www.easyzetec.com/tools/dsr-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description:
      "연소득과 기존 대출, 신규 대출 조건을 입력하면 DSR(총부채원리금상환비율)과 대출 가능 한도를 계산하는 무료 계산기. 2026년 스트레스 DSR 3단계 규제 반영.",
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
        name: "DSR 계산기",
        item: "https://www.easyzetec.com/tools/dsr-calculator",
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
        <span className="text-[var(--color-text)] font-medium">DSR 계산기</span>
      </nav>

      <header className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] leading-tight">
          DSR 계산기 — 내 대출한도·총부채원리금상환비율 (2026)
        </h1>
        <p className="mt-3 text-[var(--color-text-light)]">
          연소득과 기존 대출, 받고 싶은 신규 대출 조건만 입력하면 지금 내 DSR이 몇 퍼센트인지,
          그리고 규제 한도(은행 40% / 제2금융 50%) 안에서 얼마까지 더 빌릴 수 있는지 바로
          계산해 드려요. 2026년 현행 스트레스 DSR 3단계까지 반영했어요.
        </p>
      </header>

      {/* 계산기 */}
      <DsrCalculator />

      {/* 설명 콘텐츠 */}
      <div className="prose max-w-none">
        <h2>DSR(총부채원리금상환비율)이란?</h2>
        <p>
          DSR은 <strong>Debt Service Ratio</strong>, 우리말로 <strong>총부채원리금상환비율</strong>이에요.
          내 1년 소득에서 모든 대출의 원금과 이자를 갚는 데 들어가는 돈이 몇 퍼센트를 차지하는지
          나타내는 지표죠. 쉽게 말해 &ldquo;내가 버는 돈에 비해 갚을 빚이 얼마나 많은가&rdquo;를 한 숫자로
          보여 주는 거예요. 정부가 가계부채를 관리하기 위해 도입한 핵심 규제라서, 집을 사거나 큰돈을
          빌릴 계획이 있다면 반드시 알아야 하는 개념이에요.
        </p>
        <p>
          DSR이 중요한 이유는 단순해요. 아무리 담보가 좋고 신용점수가 높아도, DSR이 규제 한도를
          넘으면 은행이 대출을 내줄 수 없거든요. 즉 <strong>DSR이 사실상 내 대출 한도의 천장</strong>을
          결정하는 셈이에요. 그래서 대출을 알아보기 전에 내 DSR부터 계산해 보는 게 순서예요.
        </p>

        <h2>DSR 계산 공식</h2>
        <p>DSR을 구하는 공식은 다음과 같아요.</p>
        <blockquote>
          <strong>DSR(%) = (모든 대출의 연간 원리금 상환액 합계 ÷ 연소득) × 100</strong>
        </blockquote>
        <p>
          분자에는 <strong>주택담보대출 + 신용대출 + 기타대출(학자금·자동차 할부·카드론 등)</strong>의
          1년치 원금과 이자를 모두 더한 금액이 들어가요. 분모는 세전 연소득이고요. 여기서 핵심은
          &lsquo;원금까지&rsquo; 모두 반영한다는 점이에요. 그래서 이자만 따지던 과거 지표보다 훨씬 깐깐해요.
        </p>
        <p>
          원리금은 보통 <strong>원리금균등상환</strong> 방식으로 계산해요. 매달 같은 금액을 갚는
          방식인데, 월 상환액 공식은 <code>원금 × 월이율 × (1+월이율)^개월수 ÷ ((1+월이율)^개월수 − 1)</code>
          이에요. 위 계산기는 이 공식을 그대로 적용해 신규 대출의 연간 원리금을 산출하고, 기존 대출
          원리금과 합쳐 DSR을 계산해요.
        </p>

        <h2>2026년 DSR 규제 — 한도와 스트레스 DSR 3단계</h2>
        <p>
          2026년 6월 현재 적용되는 <strong>차주단위 DSR 규제 한도</strong>는 다음과 같아요.
        </p>
        <ul>
          <li>
            <strong>은행권(제1금융권): 40%</strong> — 연소득의 40%를 넘는 연간 원리금이 나오면 대출 제한
          </li>
          <li>
            <strong>제2금융권(저축은행·캐피탈·보험 등): 50%</strong>
          </li>
        </ul>
        <p>
          여기에 더해 2025년 7월 1일부터 <strong>스트레스 DSR 3단계</strong>가 시행 중이에요.
          스트레스 DSR은 미래에 금리가 오를 위험에 대비해, 대출 심사 시 실제 약정 금리에
          <strong> 스트레스 금리(가산금리)</strong>를 더해 더 보수적으로 한도를 계산하는 제도예요.
        </p>
        <ul>
          <li>
            <strong>기본 스트레스 금리: 1.5%p</strong> (3단계 기준)
          </li>
          <li>
            <strong>수도권·규제지역 주택담보대출</strong>: 기본 스트레스 금리를 100% 적용 → 약 1.5%p 가산
          </li>
          <li>
            <strong>지방 주택담보대출</strong>: 2026년 상반기(1월~6월)까지 한시적으로 2단계(50%, 약 0.75%p)
            유예 적용
          </li>
          <li>
            <strong>금리 유형별 차등</strong>: 변동형은 100%, 혼합형은 약 60%, 주기형은 약 30% 수준으로
            적용돼요. 고정형 비중이 높을수록 스트레스 부담이 줄어드는 구조예요.
          </li>
        </ul>
        <p>
          핵심은 <strong>스트레스 금리만큼 원리금이 커져서 받을 수 있는 한도가 줄어든다</strong>는
          점이에요. 예를 들어 실제 금리가 4.5%라도 심사는 6.0%(4.5%+1.5%p)로 계산하니, 같은 소득이라도
          한도가 수천만 원씩 줄어들 수 있어요. 위 계산기에서 &lsquo;스트레스 DSR 적용&rsquo; 체크박스를 켜고 끄면
          그 차이를 바로 비교할 수 있어요. (수치는 2026년 6월 기준이며, 정책은 변경될 수 있어요.)
        </p>

        <h2>DSR 계산 예시 (직접 따라 해보기)</h2>
        <h3>예시 1. 연봉 5,000만원 직장인의 신규 주담대</h3>
        <p>
          기존 대출이 없는 연소득 5,000만원 직장인이 금리 4.5%, 30년 만기로 주택담보대출을 받는다고
          해볼게요. 은행권 한도는 40%이므로 연간 원리금이 2,000만원(월 약 167만원)을 넘으면 안 돼요.
          스트레스 금리 1.5%p를 더한 6.0%로 심사하면, DSR 40%를 채우는 대출 한도는 대략
          <strong> 2억 7천만원대</strong>로 계산돼요. 같은 조건에서 스트레스를 빼고 4.5%로만 계산하면
          3억원이 넘으니, 스트레스 DSR 때문에 약 3천만원 이상 한도가 줄어드는 셈이죠.
        </p>
        <h3>예시 2. 기존 신용대출이 있는 경우</h3>
        <p>
          같은 연봉 5,000만원이지만 이미 신용대출 연 원리금이 600만원 있다면, 분자에 600만원이
          먼저 차지해요. 한도 2,000만원에서 600만원을 빼면 신규 대출에 쓸 수 있는 여력은 1,400만원뿐이라,
          주담대 한도가 그만큼 더 줄어들어요. <strong>기존 대출을 정리하면 DSR 여력이 곧바로 늘어나는</strong>
          이유가 여기에 있어요.
        </p>
        <h3>예시 3. 제2금융권을 이용하면?</h3>
        <p>
          같은 조건에서 제2금융권(한도 50%)을 이용하면 한도가 40%보다 높게 잡혀 더 많이 빌릴 수
          있어요. 다만 금리가 보통 더 높아 총이자 부담이 커지므로, 단순히 한도만 보고 결정하면 안 돼요.
        </p>

        <h2>DSR과 DTI의 차이</h2>
        <p>
          많이 헷갈리는 두 지표를 정리하면 이래요.
        </p>
        <ul>
          <li>
            <strong>DTI(총부채상환비율)</strong>: 주택담보대출은 원금+이자를 보지만, 나머지 대출은
            <strong> 이자만</strong> 반영해요. 상대적으로 느슨하죠.
          </li>
          <li>
            <strong>DSR(총부채원리금상환비율)</strong>: 모든 대출의 <strong>원금+이자</strong>를 전부
            반영해요. 훨씬 엄격해서 한도가 더 작게 나와요.
          </li>
        </ul>
        <p>
          쉽게 말해 <strong>DSR이 DTI보다 깐깐한 상위 개념</strong>이에요. 요즘 가계대출 규제의 중심은
          DTI가 아니라 DSR이라, 대출 한도를 가늠할 때는 DSR을 기준으로 보는 게 맞아요.
        </p>

        <h2>DSR 한도를 늘리는 현실적인 방법</h2>
        <ol>
          <li>
            <strong>대출 기간을 늘린다</strong> — 만기를 길게 하면 연간 원리금이 줄어 DSR이 낮아져요.
            단, 총이자는 늘어나니 트레이드오프를 따져야 해요.
          </li>
          <li>
            <strong>기존 고금리 대출(카드론·신용대출)을 먼저 갚는다</strong> — 분자가 비워지면서 신규
            대출 여력이 즉시 늘어나요. 가장 효과가 빠른 방법이에요.
          </li>
          <li>
            <strong>소득을 더 인정받는다</strong> — 상여금, 임대소득, 사업소득 등 입증 가능한 소득
            자료를 보강하면 분모가 커져 DSR이 내려가요.
          </li>
          <li>
            <strong>고정금리 상품을 고른다</strong> — 변동형보다 혼합형·고정형의 스트레스 금리 적용
            비율이 낮아 심사상 유리할 수 있어요.
          </li>
          <li>
            <strong>DSR 미산정·완화 대상을 활용한다</strong> — 일부 정책금융·전세자금대출 등은 산정에서
            제외되거나 완화돼요. 자격이 된다면 활용도가 높아요.
          </li>
        </ol>

        <h2>주의사항</h2>
        <p>
          이 계산기는 <strong>원리금균등상환을 가정한 참고용 추정치</strong>예요. 실제 대출 한도는 DSR
          외에도 <strong>LTV(담보인정비율), 방공제, 보증한도, 은행별 내규</strong> 등 여러 요소로 함께
          결정돼요. 또한 스트레스 금리·규제 비율·지역 차등은 정부 정책에 따라 수시로 바뀌므로, 이 글의
          수치는 작성 시점(2026년 6월)을 기준으로 한 값이에요. <strong>실제 대출을 실행하기 전에는 반드시
          해당 금융기관과 정부의 최신 공식 발표를 확인</strong>하세요. 본 자료는 정보 제공 목적일 뿐,
          특정 금융상품 가입을 권유하거나 대출 승인을 보장하지 않아요.
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
            <Link href="/blog/mortgage-loan-calculator-guide-2026">
              주담대 금리 계산기 활용법 — 월 상환액 직접 계산하기
            </Link>
          </li>
          <li>
            <Link href="/blog/mortgage-rate-comparison-2026-guide">
              주담대 금리 비교 2026 — 은행별 금리와 갈아타기 방법
            </Link>
          </li>
          <li>
            <Link href="/blog/mortgage-refinance-skip-cases-2026">
              주담대 갈아타기, 오히려 손해 보는 경우 — 대환 전 체크리스트
            </Link>
          </li>
          <li>
            <Link href="/blog/housing-pension-eligibility-monthly-payment-2026">
              주택연금 가입 조건과 월 수령액 — 2026 기준 정리
            </Link>
          </li>
        </ul>

        <p className="text-sm text-[var(--color-text-light)]">
          참고 출처:{" "}
          <a
            href="https://www.fsc.go.kr"
            rel="nofollow noopener"
            target="_blank"
          >
            금융위원회
          </a>
          {", "}
          <a
            href="https://portal.kfb.or.kr/compare/stress_loan_overview.php"
            rel="nofollow noopener"
            target="_blank"
          >
            전국은행연합회 소비자포털(스트레스 금리 개요)
          </a>{" "}
          — 스트레스 DSR 3단계 시행방안 및 가산금리 기준(2026년 6월 확인).
        </p>
      </div>
    </article>
  );
}
