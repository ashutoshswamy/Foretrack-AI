import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Start Free",
  description:
    "Create your free Foretrack AI account today. Get AI-powered expense tracking, smart budgeting, and personalized financial insights. No credit card required.",
  alternates: {
    canonical: "https://foretrackai.in/sign-up",
  },
  openGraph: {
    title: "Sign Up Free | Foretrack AI",
    description:
      "Join 50K+ users managing their finances smarter with AI. Create your free account now!",
    url: "https://foretrackai.in/sign-up",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
