"use client";

import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Target,
  Activity,
  Sparkles,
  Tags,
  BarChart3,
  TrendingUp,
  ClipboardList,
} from "lucide-react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import IncomeForm from "@/components/IncomeForm";
import IncomeList from "@/components/IncomeList";
import BudgetOverview from "@/components/BudgetOverview";
import BudgetForm from "@/components/BudgetForm";
import AIInsights from "@/components/AIInsights";
import AIChat from "@/components/AIChat";
import CurrencySelector from "@/components/CurrencySelector";
import CategoryManager from "@/components/CategoryManager";

export default function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "expense" | "income" | "budget" | "categories"
  >("expense");

  const handleExpenseAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen animated-bg">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.04),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(52,211,153,0.03),transparent_70%)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 bg-[#16161a] border-b border-[#2a2a32]"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#c9a96e] flex items-center justify-center">
                <Sparkles className="w-[18px] h-[18px] text-[#0c0c0e]" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold text-[#ededef] tracking-tight">
                  Foretrack AI
                </h1>
                <p className="text-[10px] text-[#5a5a66] hidden sm:block tracking-wide uppercase">
                  Smart Finance Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/transactions"
                className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg bg-[#1e1e24] border border-[#2a2a32] hover:border-[#c9a96e]/30 transition-colors"
                title="Transactions"
              >
                <ClipboardList className="w-4 h-4 text-[#8b8b96] sm:mr-2" />
                <span className="hidden sm:inline text-xs font-medium text-[#8b8b96]">
                  Transactions
                </span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg bg-[#1e1e24] border border-[#2a2a32] hover:border-[#c9a96e]/30 transition-colors"
                title="Analytics"
              >
                <BarChart3 className="w-4 h-4 text-[#8b8b96] sm:mr-2" />
                <span className="hidden sm:inline text-xs font-medium text-[#8b8b96]">
                  Analytics
                </span>
              </Link>
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e1e24] border border-[#2a2a32]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                <span className="text-xs text-[#5a5a66] flex items-center gap-1.5">
                  <Activity className="w-3 h-3" />
                  All systems active
                </span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
        >
          <div>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#ededef] mb-1 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-[#5a5a66]">
              Here&apos;s an overview of your financial activity
            </p>
          </div>
          <CurrencySelector />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-5"
          >
            {/* Tab Switcher */}
            <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-1 flex gap-1 overflow-x-auto scrollbar-hide">
              {[
                {
                  id: "expense" as const,
                  icon: Wallet,
                  label: "Expense",
                  active: "bg-[#c9a96e] text-[#0c0c0e]",
                },
                {
                  id: "income" as const,
                  icon: TrendingUp,
                  label: "Income",
                  active: "bg-[#34d399] text-[#0c0c0e]",
                },
                {
                  id: "budget" as const,
                  icon: Target,
                  label: "Budget",
                  active: "bg-[#60a5fa] text-[#0c0c0e]",
                },
                {
                  id: "categories" as const,
                  icon: Tags,
                  label: "Categories",
                  active: "bg-[#f59e0b] text-[#0c0c0e]",
                },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[80px] py-2.5 px-2 rounded-lg font-medium text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    activeTab === tab.id
                      ? tab.active
                      : "text-[#5a5a66] hover:text-[#8b8b96] hover:bg-[#1e1e24]"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Form Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "expense" ? (
                  <ExpenseForm onSuccess={handleExpenseAdded} />
                ) : activeTab === "income" ? (
                  <IncomeForm onSuccess={handleExpenseAdded} />
                ) : activeTab === "budget" ? (
                  <BudgetForm onSuccess={handleExpenseAdded} />
                ) : (
                  <CategoryManager onUpdate={handleExpenseAdded} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Column - Overview & List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-5"
          >
            <AIInsights key={`insights-${refreshTrigger}`} />
            <BudgetOverview
              key={refreshTrigger}
              onUpdate={handleExpenseAdded}
            />
            <IncomeList
              refreshTrigger={refreshTrigger}
              onUpdate={handleExpenseAdded}
            />
            <ExpenseList
              refreshTrigger={refreshTrigger}
              onUpdate={handleExpenseAdded}
            />
          </motion.div>
        </div>
      </main>

      {/* AI Chat */}
      <AIChat />
    </div>
  );
}
