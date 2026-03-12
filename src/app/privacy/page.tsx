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
        <p className="text-sm text-gray-500 mb-4">
          최종 수정일: 2026년 3월 12일
        </p>
        <p>
          쉬운재테크(이하 &quot;사이트&quot;)는 이용자의 개인정보를 중요시하며,
          「개인정보 보호법」 및 관련 법령을 준수합니다. 본 개인정보처리방침은
          사이트가 어떤 정보를 수집하고, 어떻게 이용 및 보호하는지에 대해
          설명합니다.
        </p>

        <h2>1. 수집하는 개인정보</h2>
        <p>
          본 사이트는 별도의 회원가입 절차 없이 운영되며, 이용자의 이름, 이메일
          등 개인정보를 직접 수집하지 않습니다. 다만, 아래 서비스 이용 과정에서
          자동으로 생성·수집되는 정보가 있을 수 있습니다.
        </p>
        <ul>
          <li>IP 주소, 브라우저 유형, 운영체제 정보</li>
          <li>방문 일시, 페이지 조회 기록</li>
          <li>유입 경로 (검색엔진, 외부 링크 등)</li>
          <li>화면 해상도, 기기 유형 (데스크톱/모바일)</li>
        </ul>

        <h2>2. Google Analytics 4 (GA4) 사용</h2>
        <p>
          본 사이트는 방문자 통계 분석을 위해{" "}
          <strong>Google Analytics 4 (측정 ID: G-DS08DB4NVH)</strong>를
          사용합니다. GA4는 Google LLC에서 제공하는 웹 분석 서비스로, 쿠키 및
          유사 기술을 통해 다음과 같은 정보를 수집합니다.
        </p>
        <ul>
          <li>페이지 조회수 및 방문자 수</li>
          <li>세션 지속 시간 및 이탈률</li>
          <li>사용자 인구통계 정보 (대략적인 위치, 연령대, 관심사 등)</li>
          <li>이벤트 기반 사용자 행동 데이터 (스크롤, 클릭 등)</li>
        </ul>
        <p>
          수집된 데이터는 익명으로 처리되며, 개인을 식별할 수 없는 형태로
          분석됩니다. Google의 데이터 처리에 대한 자세한 내용은{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Google 개인정보처리방침
          </a>
          을 참고하시기 바랍니다.
        </p>

        <h2>3. Google AdSense 광고 및 쿠키</h2>
        <p>
          본 사이트는{" "}
          <strong>
            Google AdSense (게시자 ID: ca-pub-1022869499967960)
          </strong>
          를 통해 광고를 게재합니다. Google AdSense는 맞춤 광고를 제공하기 위해
          쿠키를 사용하며, 다음과 같은 방식으로 작동합니다.
        </p>
        <ul>
          <li>
            Google은 사용자의 이전 웹사이트 방문 기록을 기반으로 관심사에 맞는
            광고를 표시합니다.
          </li>
          <li>
            DART 쿠키를 사용하여 사용자의 다른 사이트 방문 기록을 기반으로
            광고를 게재할 수 있습니다.
          </li>
          <li>
            제3자 광고 네트워크가 광고 제공을 위해 쿠키, 웹 비콘 등을 사용할 수
            있습니다.
          </li>
        </ul>
        <p>
          맞춤 광고를 원하지 않는 경우,{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Google 광고 설정
          </a>
          에서 맞춤 광고를 비활성화할 수 있습니다.
        </p>

        <h2>4. 쿠키 (Cookie) 사용 안내</h2>
        <p>
          쿠키란 웹사이트가 사용자의 브라우저에 저장하는 작은 텍스트 파일입니다.
          본 사이트에서 사용되는 쿠키의 유형은 다음과 같습니다.
        </p>
        <ul>
          <li>
            <strong>필수 쿠키:</strong> 사이트의 기본 기능 제공을 위해 필요한
            쿠키
          </li>
          <li>
            <strong>분석 쿠키:</strong> Google Analytics를 통한 방문자 통계
            분석용 쿠키 (_ga, _ga_* 등)
          </li>
          <li>
            <strong>광고 쿠키:</strong> Google AdSense를 통한 맞춤 광고 제공용
            쿠키
          </li>
        </ul>
        <p>
          이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
          있습니다. 다만, 쿠키를 비활성화할 경우 사이트 이용에 일부 제한이
          발생할 수 있습니다.
        </p>

        <h2>5. 이용자의 권리</h2>
        <p>
          이용자는 개인정보와 관련하여 다음과 같은 권리를 행사할 수 있습니다.
        </p>
        <ul>
          <li>
            <strong>정보 열람권:</strong> 본 사이트가 수집한 자신의 데이터에
            대한 열람을 요청할 수 있습니다.
          </li>
          <li>
            <strong>삭제 요청권:</strong> 수집된 개인정보의 삭제를 요청할 수
            있습니다.
          </li>
          <li>
            <strong>처리 정지 요청권:</strong> 개인정보 처리의 정지를 요청할 수
            있습니다.
          </li>
          <li>
            <strong>쿠키 거부권:</strong> 브라우저 설정을 통해 쿠키 수집을
            거부할 수 있습니다.
          </li>
          <li>
            <strong>Google Analytics 차단:</strong>{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Analytics 차단 브라우저 부가기능
            </a>
            을 설치하여 데이터 수집을 차단할 수 있습니다.
          </li>
        </ul>

        <h2>6. 개인정보의 보유 및 파기</h2>
        <p>
          자동 수집된 로그 데이터는 Google Analytics의 데이터 보존 설정에 따라
          관리되며, 보존 기간이 경과한 데이터는 자동으로 삭제됩니다. 본 사이트는
          이용자의 개인정보를 별도로 저장하지 않습니다.
        </p>

        <h2>7. 개인정보처리방침의 변경</h2>
        <p>
          본 개인정보처리방침은 법령 변경이나 서비스 변경에 따라 수정될 수
          있으며, 변경 시 사이트에 공지합니다.
        </p>

        <h2>8. 문의처</h2>
        <p>
          개인정보 처리에 관한 문의, 열람·삭제 요청 등은 아래 연락처로
          문의해주시기 바랍니다.
        </p>
        <ul>
          <li>
            <strong>사이트명:</strong> 쉬운재테크
          </li>
          <li>
            <strong>이메일:</strong> [이메일 주소를 입력하세요]
          </li>
        </ul>
      </div>
    </div>
  );
}
