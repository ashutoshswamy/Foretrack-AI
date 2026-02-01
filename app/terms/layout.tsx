import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read Foretrack AI's Terms of Service. Understand your rights and responsibilities when using our AI-powered expense tracking and budget management platform.",
  alternates: {
    canonical: "https://foretrackai.in/terms",
  },
  openGraph: {
    title: "Terms of Service | Foretrack AI",
    description:
      "Read Foretrack AI's Terms of Service for our expense tracking platform.",
    url: "https://foretrackai.in/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
