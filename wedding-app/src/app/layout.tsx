import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://wedding.vercel.app"),
  title: "💍 Đám Cưới Minh Đông & Diệu Linh — 20.09.2026",
  description:
    "Trân trọng kính mời bạn đến dự lễ thành hôn của Minh Đông & Diệu Linh ngày 20 tháng 09 năm 2026 tại Phú Thọ.",
  keywords: ["đám cưới", "Minh Đông", "Diệu Linh", "thiệp cưới online", "wedding 2026"],
  authors: [{ name: "Minh Đông & Diệu Linh" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://wedding.vercel.app",
    siteName: "Đám Cưới Minh Đông & Diệu Linh",
    title: "💍 Minh Đông & Diệu Linh — 20.09.2026",
    description:
      "Trân trọng kính mời bạn đến dự lễ thành hôn của chúng tôi. Ngày 20 tháng 09 năm 2026 tại Phú Thọ.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Thiệp cưới Minh Đông & Diệu Linh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "💍 Minh Đông & Diệu Linh — 20.09.2026",
    description: "Trân trọng kính mời bạn đến dự lễ thành hôn của chúng tôi.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#C9A96E" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
