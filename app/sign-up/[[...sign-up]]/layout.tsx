import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a free Foretrack AI account with Google and start tracking expenses, setting budgets, and getting AI-powered financial insights.",
  alternates: {
    canonical: "https://foretrackai.in/sign-up",
  },
  openGraph: {
    title: "Sign Up | Foretrack AI",
    description:
      "Create a free Foretrack AI account with Google and start tracking expenses, setting budgets, and getting AI-powered financial insights.",
    url: "https://foretrackai.in/sign-up",
    images: [
      { url: "/og-image.png", width: 1730, height: 909, alt: "Foretrack AI" },
    ],
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
