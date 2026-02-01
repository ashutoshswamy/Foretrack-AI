import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Foretrack AI protects your privacy and handles your personal data. Read our comprehensive privacy policy covering data collection, usage, and security.",
  alternates: {
    canonical: "https://foretrackai.in/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Foretrack AI",
    description:
      "Learn how Foretrack AI protects your privacy and handles your personal data.",
    url: "https://foretrackai.in/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
