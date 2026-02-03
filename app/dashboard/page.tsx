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
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 glass-card border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold gradient-text">
                  Foretrack AI
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Smart Finance Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/transactions"
                className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
                title="Transactions"
              >
                <ClipboardList className="w-5 h-5 text-indigo-600 sm:mr-2" />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  Transactions
                </span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
                title="Analytics"
              >
                <BarChart3 className="w-5 h-5 text-indigo-600 sm:mr-2" />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  Analytics
                </span>
              </Link>
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-sm text-gray-600 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  All systems active
                </span>
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-10 h-10 rounded-xl ring-2 ring-indigo-500/20",
                  },
                }}
              />
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
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
        >
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Welcome back! 👋
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Here&apos;s an overview of your financial activity
            </p>
          </div>
          <CurrencySelector />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Tab Switcher */}
            <div className="glass-card rounded-2xl p-1.5 sm:p-1.5 flex gap-1 sm:gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1 sm:mx-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("expense")}
                className={`flex-1 min-w-[85px] py-3 sm:py-3 px-2 sm:px-2 rounded-xl font-medium text-xs sm:text-xs transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-1.5 ${
                  activeTab === "expense"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <Wallet className="w-4 h-4 sm:w-4 sm:h-4" />
                <span>Expense</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("income")}
                className={`flex-1 min-w-[85px] py-3 sm:py-3 px-2 sm:px-2 rounded-xl font-medium text-xs sm:text-xs transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-1.5 ${
                  activeTab === "income"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <TrendingUp className="w-4 h-4 sm:w-4 sm:h-4" />
                <span>Income</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("budget")}
                className={`flex-1 min-w-[85px] py-3 sm:py-3 px-2 sm:px-2 rounded-xl font-medium text-xs sm:text-xs transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-1.5 ${
                  activeTab === "budget"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <Target className="w-4 h-4 sm:w-4 sm:h-4" />
                <span>Budget</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("categories")}
                className={`flex-1 min-w-[85px] py-3 sm:py-3 px-2 sm:px-2 rounded-xl font-medium text-xs sm:text-xs transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-1.5 ${
                  activeTab === "categories"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                <Tags className="w-4 h-4 sm:w-4 sm:h-4" />
                <span>Categories</span>
              </motion.button>
            </div>

            {/* Form Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
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
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
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
