import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Foretrack AI to access your expense tracking dashboard, budget management tools, and personalized financial insights.",
  alternates: {
    canonical: "https://foretrackai.in/sign-in",
  },
  openGraph: {
    title: "Sign In | Foretrack AI",
    description:
      "Sign in to access your personal finance dashboard and AI-powered insights.",
    url: "https://foretrackai.in/sign-in",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
