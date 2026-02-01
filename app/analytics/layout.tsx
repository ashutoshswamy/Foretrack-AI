import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "View detailed financial analytics and spending reports. Analyze your expenses by category, track trends, and understand your financial habits with AI insights.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
