import type { Metadata } from "next";
import {
  Great_Vibes,
  Playfair_Display,
  Cinzel,
  Noto_Serif,
  Be_Vietnam_Pro,
} from "next/font/google";
import "./globals.css";

/* ── Google Fonts — self-hosted by Next.js, Vietnamese subset guaranteed ── */
const greatVibes = Great_Vibes({
  weight: ["400"],
  subsets: ["latin", "latin-ext"],  // Great Vibes covers Vietnamese via latin-ext
  variable: "--font-script",
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["vietnamese"],
  variable: "--font-heading",
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["400", "500", "600"],
  subsets: ["latin"],           // Cinzel = decorative Latin only
  variable: "--font-cinzel",    // renamed: only use for ASCII text
  display: "swap",
});

const notoSerif = Noto_Serif({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["vietnamese"],      // Noto Serif = full Unicode coverage
  variable: "--font-serif",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["vietnamese"],      // Designed specifically for Vietnamese
  variable: "--font-sans",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://linhdong-wedding.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "💍 Đám Cưới Minh Đông & Diệu Linh — 20.09.2026",
  description:
    "Trân trọng kính mời bạn đến dự lễ thành hôn của Minh Đông & Diệu Linh ngày 20 tháng 09 năm 2026 tại Phú Thọ.",
  keywords: ["đám cưới", "Minh Đông", "Diệu Linh", "thiệp cưới online", "wedding 2026"],
  authors: [{ name: "Minh Đông & Diệu Linh" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
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

const fontVars = [
  greatVibes.variable,
  playfair.variable,
  cinzel.variable,
  notoSerif.variable,
  beVietnam.variable,
].join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={fontVars} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#C9A96E" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
