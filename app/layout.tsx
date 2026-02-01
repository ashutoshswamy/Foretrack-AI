import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CurrencyProvider } from "@/lib/currency";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafbfc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
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
    google: "your-google-verification-code",
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
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className={`${poppins.variable} font-sans antialiased`}>
          <CurrencyProvider>{children}</CurrencyProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
