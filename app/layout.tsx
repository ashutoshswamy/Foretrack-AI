import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { CurrencyProvider } from "@/lib/currency";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0c0c0e",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://foretrackai.in"),
  title: {
    default: "Foretrack AI - Smart Expense Tracking & Budget Management",
    template: "%s | Foretrack AI",
  },
  description:
    "Take control of your finances with Foretrack AI. AI-powered expense tracking, smart budget management, automated categorization, and personalized financial insights. Start saving smarter today!",
  keywords: [
    "expense tracker",
    "budget management",
    "AI finance app",
    "expense tracking app",
    "personal finance",
    "money management",
    "budget planner",
    "spending tracker",
    "financial insights",
    "smart budgeting",
    "expense categorization",
    "income tracker",
    "financial planning",
    "savings tracker",
  ],
  authors: [{ name: "Foretrack AI" }],
  creator: "Foretrack AI",
  publisher: "Foretrack AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://foretrackai.in",
    siteName: "Foretrack AI",
    title: "Foretrack AI - Smart Expense Tracking & Budget Management",
    description:
      "Take control of your finances with AI-powered expense tracking, smart budgeting, and personalized financial insights. Join 50K+ users saving smarter!",
    images: [
      {
        url: "/og-image.png",
        width: 1730,
        height: 909,
        alt: "Foretrack AI - Smart Expense Tracking & Budget Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foretrack AI - Smart Expense Tracking & Budget Management",
    description:
      "Take control of your finances with AI-powered expense tracking, smart budgeting, and personalized financial insights.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://foretrackai.in",
  },
  category: "Finance",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  verification: {
    google: "yYvANq1ViDwWDVVju8vVxnFhCaqgwWCYjgN8_6wDbD4",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Foretrack AI",
  description:
    "AI-powered expense tracking, smart budget management, and personalized financial insights",
  url: "https://foretrackai.in",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "50000",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "AI-powered expense categorization",
    "Smart budget recommendations",
    "Real-time spending analytics",
    "Multi-currency support",
    "Financial insights and reports",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PYSDSRJXHN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PYSDSRJXHN');
            `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <CurrencyProvider>{children}</CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
