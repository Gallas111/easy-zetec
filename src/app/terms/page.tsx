import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">
        이용약관
      </h1>
      <div className="prose">
        <h2>서비스 이용</h2>
        <p>
          쉬운재테크는 재테크 관련 정보를 제공하는 블로그 서비스입니다.
          모든 콘텐츠는 정보 제공 목적으로만 작성되었습니다.
        </p>
        <h2>면책 조항</h2>
        <p>
          본 사이트에서 제공하는 정보는 투자 권유가 아니며, 금융 상품의 매매를
          권장하지 않습니다. 투자에 따른 손익은 이용자 본인에게 귀속됩니다.
        </p>
        <h2>저작권</h2>
        <p>
          본 사이트의 모든 콘텐츠에 대한 저작권은 쉬운재테크에 있으며, 무단
          복제 및 배포를 금지합니다.
        </p>
        <h2>약관 변경</h2>
        <p>
          본 약관은 사전 고지 없이 변경될 수 있으며, 변경된 약관은 사이트에
          게시하는 것으로 효력이 발생합니다.
        </p>
      </div>
    </div>
  );
}
