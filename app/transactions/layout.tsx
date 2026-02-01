import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
  description:
    "View all your transactions including expenses and income. Track your complete financial history with Foretrack AI.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
