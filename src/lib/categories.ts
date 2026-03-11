export interface Category {
  name: string;
  slug: string;
  folderName: string;
  icon: string;
  color: string;
  description: string;
  longDescription: string;
  keyTopics: string[];
  seoTitle: string;
  seoDescription: string;
}

export const categories: Category[] = [
  {
    name: "재테크 기초",
    slug: "basics",
    folderName: "basics",
    icon: "📚",
    color: "#3B82F6",
    description: "재테크 입문자를 위한 기초 가이드",
    longDescription:
      "재테크를 처음 시작하는 분들을 위한 기초 개념, 용어 정리, 첫 투자 방법까지 쉽게 설명합니다.",
    keyTopics: ["재테크 시작", "금융 용어", "저축 습관", "가계부 작성법", "비상금 만들기"],
    seoTitle: "재테크 기초 가이드 - 쉬운재테크",
    seoDescription:
      "재테크 입문자를 위한 기초 가이드. 금융 용어부터 첫 투자까지 쉽게 알려드립니다.",
  },
  {
    name: "저축·예금",
    slug: "savings",
    folderName: "savings",
    icon: "🏦",
    color: "#10B981",
    description: "적금, 예금, 파킹통장 비교 분석",
    longDescription:
      "은행 적금·예금 금리 비교, 파킹통장 추천, CMA 활용법 등 안전한 저축 전략을 다룹니다.",
    keyTopics: ["적금 추천", "예금 금리 비교", "파킹통장", "CMA", "비과세 저축"],
    seoTitle: "저축·예금 가이드 - 적금 금리 비교 | 쉬운재테크",
    seoDescription:
      "은행 적금·예금 금리 비교, 파킹통장 추천, CMA 활용법까지. 안전한 저축 전략을 알려드립니다.",
  },
  {
    name: "투자·주식",
    slug: "investing",
    folderName: "investing",
    icon: "📈",
    color: "#8B5CF6",
    description: "주식, ETF, 펀드 투자 가이드",
    longDescription:
      "주식 초보 가이드부터 ETF 추천, 해외주식 투자법, 배당주 전략까지 투자의 모든 것을 다룹니다.",
    keyTopics: ["주식 입문", "ETF 추천", "해외주식", "배당주", "펀드 비교"],
    seoTitle: "투자·주식 가이드 - ETF, 해외주식 | 쉬운재테크",
    seoDescription:
      "주식 초보 가이드부터 ETF 추천, 배당주 전략까지. 투자의 모든 것을 쉽게 설명합니다.",
  },
  {
    name: "절세·세금",
    slug: "tax",
    folderName: "tax",
    icon: "🧾",
    color: "#F59E0B",
    description: "연말정산, 세금 절약 꿀팁",
    longDescription:
      "연말정산 환급 극대화, 종합소득세 절세, 세액공제 활용법 등 합법적 절세 전략을 공유합니다.",
    keyTopics: ["연말정산", "종합소득세", "세액공제", "IRP", "ISA 계좌"],
    seoTitle: "절세·세금 가이드 - 연말정산 꿀팁 | 쉬운재테크",
    seoDescription:
      "연말정산 환급 극대화, 종합소득세 절세 방법, 세액공제 활용법을 쉽게 알려드립니다.",
  },
  {
    name: "부동산",
    slug: "real-estate",
    folderName: "real-estate",
    icon: "🏠",
    color: "#EF4444",
    description: "내 집 마련, 청약, 대출 정보",
    longDescription:
      "청약 전략, 주택담보대출 비교, 전세·월세 팁, 부동산 투자 기초까지 내 집 마련의 모든 것.",
    keyTopics: ["청약 가이드", "주택담보대출", "전세 팁", "부동산 투자", "취득세"],
    seoTitle: "부동산 가이드 - 청약, 대출, 내 집 마련 | 쉬운재테크",
    seoDescription:
      "청약 전략, 주택담보대출 비교, 전세·월세 팁까지. 내 집 마련에 필요한 모든 정보.",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getCategoryByFolder(folderName: string): Category | undefined {
  return categories.find((cat) => cat.folderName === folderName);
}
