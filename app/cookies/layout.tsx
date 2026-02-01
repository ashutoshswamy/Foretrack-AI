import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn about how Foretrack AI uses cookies and similar technologies. Understand your choices regarding cookies on our expense tracking platform.",
  alternates: {
    canonical: "https://foretrackai.in/cookies",
  },
  openGraph: {
    title: "Cookie Policy | Foretrack AI",
    description:
      "Learn about how Foretrack AI uses cookies and similar technologies.",
    url: "https://foretrackai.in/cookies",
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
