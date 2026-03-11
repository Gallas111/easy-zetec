import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.easyzetec.com"),
  title: {
    default: "쉬운재테크 - 누구나 쉽게 시작하는 재테크",
    template: "%s | 쉬운재테크",
  },
  description:
    "재테크 초보도 쉽게 따라할 수 있는 저축, 투자, 절세 가이드. 적금 비교부터 ETF 투자, 연말정산 꿀팁까지.",
  keywords: [
    "재테크",
    "저축",
    "투자",
    "절세",
    "적금 추천",
    "ETF",
    "연말정산",
    "주식 초보",
    "재테크 기초",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.easyzetec.com",
    siteName: "쉬운재테크",
    title: "쉬운재테크 - 누구나 쉽게 시작하는 재테크",
    description:
      "재테크 초보도 쉽게 따라할 수 있는 저축, 투자, 절세 가이드.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "쉬운재테크",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "쉬운재테크 - 누구나 쉽게 시작하는 재테크",
    description:
      "재테크 초보도 쉽게 따라할 수 있는 저축, 투자, 절세 가이드.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "쉬운재테크",
    url: "https://www.easyzetec.com",
    description:
      "재테크 초보도 쉽게 따라할 수 있는 저축, 투자, 절세 가이드",
    publisher: {
      "@type": "Organization",
      name: "쉬운재테크",
    },
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
