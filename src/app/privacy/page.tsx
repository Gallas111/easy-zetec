import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
        개인정보처리방침
      </h1>
      <div className="prose">
        <p>
          쉬운재테크(이하 &quot;사이트&quot;)는 이용자의 개인정보를 중요시하며,
          개인정보보호법을 준수합니다.
        </p>
        <h2>수집하는 개인정보</h2>
        <p>
          본 사이트는 별도의 회원가입 절차 없이 운영되며, 이용자의 개인정보를
          직접 수집하지 않습니다.
        </p>
        <h2>쿠키 및 분석 도구</h2>
        <p>
          사이트 이용 통계 분석을 위해 Google Analytics를 사용할 수 있으며, 이
          과정에서 쿠키가 수집될 수 있습니다.
        </p>
        <h2>광고</h2>
        <p>
          본 사이트는 Google AdSense를 통해 광고를 게재할 수 있으며, 광고
          제공을 위해 쿠키가 사용될 수 있습니다.
        </p>
        <h2>문의</h2>
        <p>
          개인정보 관련 문의사항은 사이트 관리자에게 연락해주시기 바랍니다.
        </p>
      </div>
    </div>
  );
}
