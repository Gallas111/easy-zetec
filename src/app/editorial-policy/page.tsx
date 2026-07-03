import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "편집·출처 정책 — 쉬운재테크",
  description:
    "쉬운재테크의 사실검증 절차, 수치 출처 원칙(금융위·한국은행·국세청·은행연합회 등 1차 출처), 수정 이력 정책, 광고와 콘텐츠 분리 원칙을 안내합니다.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "편집·출처 정책",
    url: "https://www.easyzetec.com/editorial-policy",
    description:
      "쉬운재테크의 사실검증 절차, 수치 출처 원칙, 수정 이력 정책, 광고와 콘텐츠 분리 원칙",
    publisher: { "@id": "https://www.easyzetec.com/#organization" },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
        편집·출처 정책
      </h1>
      <div className="prose">
        <p>
          쉬운재테크는 금리·세율·정책처럼 <strong>돈에 직접 영향을 주는 정보</strong>를
          다룹니다. 잘못된 숫자 하나가 독자의 손해로 이어질 수 있기 때문에, 모든 콘텐츠는
          아래 정책에 따라 작성·검증·수정됩니다. 이 페이지는 저희가 스스로에게 적용하는
          기준을 투명하게 공개하기 위한 것입니다.
        </p>

        <h2>1. 사실검증 절차</h2>
        <ol>
          <li>
            <strong>초안 단계</strong> — 글에 들어가는 모든 수치(금리, 세율, 한도, 시행일,
            공제액)는 작성 시점에 아래 1차 출처에서 직접 확인한 값만 사용합니다. 다른 블로그나
            커뮤니티 글을 수치의 근거로 삼지 않습니다.
          </li>
          <li>
            <strong>교차 확인</strong> — 핵심 수치는 가능한 한 두 개 이상의 공식 자료로 교차
            확인합니다. 출처 간 수치가 엇갈리면 본문에 그 사실과 각 기준 시점을 함께 밝힙니다.
          </li>
          <li>
            <strong>기준 시점 명시</strong> — 정책·세법·금리처럼 바뀌는 정보는 본문에
            &ldquo;2026년 7월 기준&rdquo;처럼 확인 시점을 명시합니다.
          </li>
          <li>
            <strong>계산 검증</strong> — 시뮬레이션·예시 계산은 공식과 입력값을 본문에
            공개하고, 발행 전 계산을 재검산합니다. 계산기 도구는 산식과 가정을 페이지 하단에
            명시합니다.
          </li>
        </ol>

        <h2>2. 수치 출처 원칙 — 1차 출처만 인용</h2>
        <p>금융·세무 수치의 근거로는 다음과 같은 공식 기관 자료를 우선 사용합니다.</p>
        <ul>
          <li>
            <strong>금융위원회·금융감독원</strong> — 대출 규제(DSR·LTV), 금융 정책, 금융상품
            공시
          </li>
          <li>
            <strong>한국은행</strong> — 기준금리, 수신·여신 금리 통계(ECOS)
          </li>
          <li>
            <strong>국세청·기획재정부</strong> — 세율, 공제 한도, 세법 개정 사항
          </li>
          <li>
            <strong>전국은행연합회</strong> — 은행별 금리 비교 공시, 금융계산기 산식
          </li>
          <li>
            <strong>예금보험공사</strong> — 예금자보호제도
          </li>
          <li>
            <strong>법령(국가법령정보센터)</strong> — 소득세법·지방세법·조세특례제한법 등 조문
          </li>
        </ul>
        <p>
          개별 상품 정보(금리·우대조건)는 해당 금융회사의 공식 상품설명서·공시 자료를
          기준으로 하며, 변동 가능성이 있는 정보에는 확인 시점을 붙입니다.
        </p>

        <h2>3. 수정 이력 정책</h2>
        <ul>
          <li>
            사실 오류·법령 변경·수치 변경이 확인되면 <strong>확인 후 24시간 내</strong> 본문을
            정정합니다.
          </li>
          <li>
            의미 있는 수정(수치·결론이 바뀌는 경우)은 본문 상단 또는 해당 문단에 수정 사실과
            수정일을 표기하고, 글의 <code>updated</code>(수정일) 메타데이터를 갱신합니다.
          </li>
          <li>
            오탈자·문장 다듬기 같은 경미한 수정은 별도 표기 없이 반영될 수 있습니다.
          </li>
          <li>
            독자 제보로 오류가 확인된 경우에도 동일한 절차로 정정합니다. 제보는{" "}
            <Link href="/contact">문의 페이지</Link>를 통해
            받습니다.
          </li>
        </ul>

        <h2>4. 광고와 콘텐츠 분리 원칙</h2>
        <ul>
          <li>
            본 사이트는 Google AdSense 등 광고로 운영 비용을 충당합니다. 광고는 자동 배치되며,{" "}
            <strong>광고주가 글의 주제·결론·추천에 관여하지 않습니다</strong>.
          </li>
          <li>
            특정 금융회사·상품으로부터 대가를 받고 순위나 평가를 바꾸지 않습니다. 대가성
            콘텐츠를 게재하게 될 경우 해당 글에 명확히 표기합니다.
          </li>
          <li>
            클릭을 유도하기 위해 수익률·혜택을 과장하지 않으며, 상품의 장점과 단점을 함께
            다룹니다.
          </li>
        </ul>

        <h2>5. 투자권유가 아닙니다 (면책)</h2>
        <p>
          쉬운재테크의 모든 콘텐츠와 계산기는 <strong>일반적인 정보 제공 목적</strong>으로만
          제작됩니다. 특정 금융상품의 매수·가입 권유, 투자자문, 세무자문이 아니며, 저희는
          금융투자업 인가를 받은 기관이 아닙니다. 금리·세율·규제는 수시로 바뀌므로 실제
          금융 의사결정 전에는 반드시 해당 금융기관과 정부 기관의 최신 공식 자료를 확인하고,
          필요하면 세무사·투자자문업자 등 자격 있는 전문가와 상담하세요. 콘텐츠를 참고한
          의사결정의 책임은 이용자 본인에게 있습니다.
        </p>

        <h2>운영 주체</h2>
        <p>
          이 사이트는 <strong>쉬운재테크 편집팀</strong>이 운영합니다. 편집팀 구성과 콘텐츠
          제작 과정은 <Link href="/about">소개 페이지</Link>에서 확인할 수 있습니다. 저희는
          특정 자격(투자자문업자·세무사 등)을 보유했다고 주장하지 않으며, 그 대신 위의 1차
          출처 인용 원칙과 검증 절차로 정보의 정확성을 관리합니다.
        </p>

        <p className="text-sm text-[var(--color-text-light)]">
          이 정책은 2026년 7월에 마지막으로 갱신되었습니다. 정책 자체가 바뀌면 이 페이지에
          반영합니다.
        </p>
      </div>
    </div>
  );
}
