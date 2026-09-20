import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Foretrack AI with Google to track expenses, manage budgets, and get AI-powered financial insights.",
  alternates: {
    canonical: "https://foretrackai.in/sign-in",
  },
  openGraph: {
    title: "Sign In | Foretrack AI",
    description:
      "Sign in to Foretrack AI with Google to track expenses, manage budgets, and get AI-powered financial insights.",
    url: "https://foretrackai.in/sign-in",
    images: [
      { url: "/og-image.png", width: 1730, height: 909, alt: "Foretrack AI" },
    ],
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
