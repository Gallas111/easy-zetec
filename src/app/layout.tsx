import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
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
        url: "https://www.easyzetec.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "쉬운재테크 - 누구나 쉽게 시작하는 재테크",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "쉬운재테크 - 누구나 쉽게 시작하는 재테크",
    description:
      "재테크 초보도 쉽게 따라할 수 있는 저축, 투자, 절세 가이드.",
    images: ["https://www.easyzetec.com/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "msapplication-TileColor": "#0D9488",
    "theme-color": "#0D9488",
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
      logo: {
        "@type": "ImageObject",
        url: "https://www.easyzetec.com/icon-512x512.png",
      },
    },
  };

  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/icon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-site-verification" content="CTE7IlDhB9EWswa-1uO4R_P0mgl96dLTIKrYQWczf-A" />
        <meta name="naver-site-verification" content="d29fbbad151bce7158310a25af19168e476a7707" />
        <meta name="theme-color" content="#0D9488" />
        <meta name="msapplication-TileColor" content="#0D9488" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
