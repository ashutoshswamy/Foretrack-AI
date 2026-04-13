"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PiggyBank,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  BarChart3,
  Activity,
  Wallet,
  Target,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { supabase, type Expense, type Budget } from "@/lib/supabase";
import { useCurrency } from "@/lib/currency";

const categoryConfig: {
  [key: string]: {
    icon: string;
    color: string;
    bgColor: string;
    chartColor: string;
  };
} = {
  Food: {
    icon: "🍔",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    chartColor: "#f97316",
  },
  Transport: {
    icon: "🚗",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    chartColor: "#3b82f6",
  },
  Entertainment: {
    icon: "🎬",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    chartColor: "#a855f7",
  },
  Shopping: {
    icon: "🛍️",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    chartColor: "#ec4899",
  },
  Bills: {
    icon: "💡",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    chartColor: "#eab308",
  },
  Health: {
    icon: "🏥",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    chartColor: "#22c55e",
  },
  Other: {
    icon: "📦",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    chartColor: "#6b7280",
  },
};

type TimeRange = "week" | "month" | "quarter" | "year";

export default function Analytics() {
  const { user } = useUser();
  const { formatAmount } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [expensesRes, budgetsRes] = await Promise.all([
        supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false }),
        supabase
          .from("budgets")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true),
      ]);

      if (expensesRes.data) setExpenses(expensesRes.data);
      if (budgetsRes.data) setBudgets(budgetsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const getDateRange = (range: TimeRange) => {
    const now = new Date();
    const start = new Date();

    switch (range) {
      case "week":
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        start.setMonth(now.getMonth() - 3);
        break;
      case "year":
        start.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { start, end: now };
  };

  const filteredExpenses = useMemo(() => {
    const { start, end } = getDateRange(timeRange);
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  }, [expenses, timeRange]);

  const previousPeriodExpenses = useMemo(() => {
    const { start, end } = getDateRange(timeRange);
    const periodLength = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - periodLength);
    const prevEnd = start;

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= prevStart && expenseDate < prevEnd;
    });
  }, [expenses, timeRange]);

  const analytics = useMemo(() => {
    const totalExpenses = filteredExpenses
      .filter((e) => e.transaction_type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalIncome = filteredExpenses
      .filter((e) => e.transaction_type === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    const prevTotalExpenses = previousPeriodExpenses
      .filter((e) => e.transaction_type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    const prevTotalIncome = previousPeriodExpenses
      .filter((e) => e.transaction_type === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    const expenseChange = prevTotalExpenses
      ? ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100
      : 0;

    const incomeChange = prevTotalIncome
      ? ((totalIncome - prevTotalIncome) / prevTotalIncome) * 100
      : 0;

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    const categoryBreakdown = filteredExpenses
      .filter((e) => e.transaction_type === "expense")
      .reduce(
        (acc, expense) => {
          const category = expense.category || "Other";
          acc[category] = (acc[category] || 0) + expense.amount;
          return acc;
        },
        {} as Record<string, number>,
      );

    const dailySpending = filteredExpenses
      .filter((e) => e.transaction_type === "expense")
      .reduce(
        (acc, expense) => {
          const date = expense.date;
          acc[date] = (acc[date] || 0) + expense.amount;
          return acc;
        },
        {} as Record<string, number>,
      );

    const avgDailySpending =
      Object.values(dailySpending).length > 0
        ? Object.values(dailySpending).reduce((a, b) => a + b, 0) /
          Object.values(dailySpending).length
        : 0;

    const sortedCategories = Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      totalExpenses,
      totalIncome,
      netSavings,
      savingsRate,
      expenseChange,
      incomeChange,
      categoryBreakdown,
      sortedCategories,
      avgDailySpending,
      transactionCount: filteredExpenses.length,
    };
  }, [filteredExpenses, previousPeriodExpenses]);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const budgetUtilization =
    totalBudget > 0 ? (analytics.totalExpenses / totalBudget) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 text-[#c9a96e] animate-spin" />
          <p className="text-[#5a5a66] text-sm">Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.04),transparent_70%)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-[#16161a] border-b border-[#2a2a32]"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="p-1.5 rounded-lg hover:bg-[#1e1e24] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#8b8b96]" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#c9a96e] flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-[#0c0c0e]" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-semibold text-[#ededef] tracking-tight">
                    Analytics
                  </h1>
                  <p className="text-[10px] text-[#5a5a66] hidden sm:block uppercase tracking-wide">
                    Financial Insights
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e1e24] border border-[#2a2a32]">
                <Activity className="w-3.5 h-3.5 text-[#c9a96e]" />
                <span className="text-xs text-[#5a5a66]">
                  {analytics.transactionCount} transactions
                </span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#ededef] mb-1 tracking-tight">
              Financial Overview
            </h2>
            <p className="text-sm text-[#5a5a66]">
              Analyze your spending patterns and track your financial health
            </p>
          </div>
          <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-1 flex gap-1 overflow-x-auto scrollbar-hide">
            {(["week", "month", "quarter", "year"] as TimeRange[]).map(
              (range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`flex-1 min-w-[65px] px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200 capitalize ${
                    timeRange === range
                      ? "bg-[#c9a96e] text-[#0c0c0e]"
                      : "text-[#5a5a66] hover:text-[#8b8b96] hover:bg-[#1e1e24]"
                  }`}
                >
                  {range}
                </button>
              ),
            )}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {/* Total Expenses */}
          <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#f87171]/10 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-[#f87171]" />
              </div>
              <div
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  analytics.expenseChange > 0
                    ? "text-[#f87171]"
                    : "text-[#34d399]"
                }`}
              >
                {analytics.expenseChange > 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(analytics.expenseChange).toFixed(1)}%
              </div>
            </div>
            <p className="text-xs text-[#5a5a66] mb-0.5">Total Expenses</p>
            <p className="text-lg font-bold text-[#ededef]">
              {formatAmount(analytics.totalExpenses)}
            </p>
          </div>

          {/* Total Income */}
          <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#34d399]/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#34d399]" />
              </div>
              <div
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  analytics.incomeChange >= 0
                    ? "text-[#34d399]"
                    : "text-[#f87171]"
                }`}
              >
                {analytics.incomeChange >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(analytics.incomeChange).toFixed(1)}%
              </div>
            </div>
            <p className="text-xs text-[#5a5a66] mb-0.5">Total Income</p>
            <p className="text-lg font-bold text-[#ededef]">
              {formatAmount(analytics.totalIncome)}
            </p>
          </div>

          {/* Net Savings */}
          <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-[#c9a96e]" />
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                  analytics.netSavings >= 0
                    ? "bg-[#34d399]/10 text-[#34d399]"
                    : "bg-[#f87171]/10 text-[#f87171]"
                }`}
              >
                {analytics.netSavings >= 0 ? "Surplus" : "Deficit"}
              </span>
            </div>
            <p className="text-xs text-[#5a5a66] mb-0.5">Net Savings</p>
            <p
              className={`text-lg font-bold ${
                analytics.netSavings >= 0 ? "text-[#34d399]" : "text-[#f87171]"
              }`}
            >
              {formatAmount(Math.abs(analytics.netSavings))}
            </p>
          </div>

          {/* Savings Rate */}
          <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-[#fbbf24]" />
              </div>
            </div>
            <p className="text-xs text-[#5a5a66] mb-0.5">Savings Rate</p>
            <p className="text-lg font-bold text-[#ededef]">
              {analytics.savingsRate.toFixed(1)}%
            </p>
            <div className="mt-2 h-1.5 bg-[#2a2a32] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(Math.max(analytics.savingsRate, 0), 100)}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  analytics.savingsRate >= 20
                    ? "bg-[#34d399]"
                    : analytics.savingsRate >= 10
                      ? "bg-[#fbbf24]"
                      : "bg-[#f87171]"
                }`}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-[#c9a96e]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ededef] text-sm">
                  Spending by Category
                </h3>
                <p className="text-xs text-[#5a5a66]">Where your money goes</p>
              </div>
            </div>

            {analytics.sortedCategories.length > 0 ? (
              <div className="space-y-4">
                {analytics.sortedCategories.map(([category, amount], index) => {
                  const config =
                    categoryConfig[category] || categoryConfig.Other;
                  const percentage =
                    analytics.totalExpenses > 0
                      ? (amount / analytics.totalExpenses) * 100
                      : 0;

                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center text-sm`}
                          >
                            {config.icon}
                          </span>
                          <span className="font-medium text-[#ededef] text-sm">
                            {category}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#ededef] text-sm">
                            {formatAmount(amount)}
                          </p>
                          <p className="text-[10px] text-[#5a5a66]">
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-[#2a2a32] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.08 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: config.chartColor }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-[#5a5a66]">
                <PieChart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No expense data for this period</p>
              </div>
            )}
          </motion.div>

          {/* Budget Utilization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#34d399]/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-[#34d399]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ededef] text-sm">
                  Budget Status
                </h3>
                <p className="text-xs text-[#5a5a66]">
                  Track your budget limits
                </p>
              </div>
            </div>

            {budgets.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#c9a96e]/5 border border-[#c9a96e]/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#ededef] text-sm">
                      Overall Budget
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                        budgetUtilization <= 80
                          ? "bg-[#34d399]/10 text-[#34d399]"
                          : budgetUtilization <= 100
                            ? "bg-[#fbbf24]/10 text-[#fbbf24]"
                            : "bg-[#f87171]/10 text-[#f87171]"
                      }`}
                    >
                      {budgetUtilization.toFixed(0)}% used
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-[#ededef]">
                      {formatAmount(analytics.totalExpenses)}
                    </span>
                    <span className="text-[#5a5a66] text-sm">
                      / {formatAmount(totalBudget)}
                    </span>
                  </div>
                  <div className="h-2 bg-[#2a2a32] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(budgetUtilization, 100)}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        budgetUtilization <= 80
                          ? "bg-[#34d399]"
                          : budgetUtilization <= 100
                            ? "bg-[#fbbf24]"
                            : "bg-[#f87171]"
                      }`}
                    />
                  </div>
                </div>

                {budgets.slice(0, 4).map((budget, index) => {
                  const spent =
                    analytics.categoryBreakdown[budget.category] || 0;
                  const utilization =
                    budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                  const config =
                    categoryConfig[budget.category] || categoryConfig.Other;

                  return (
                    <motion.div
                      key={budget.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <span
                        className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center text-sm flex-shrink-0`}
                      >
                        {config.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-[#ededef] text-sm truncate">
                            {budget.category}
                          </span>
                          <span className="text-xs text-[#5a5a66]">
                            {formatAmount(spent)} / {formatAmount(budget.amount)}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#2a2a32] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              utilization <= 80
                                ? "bg-[#34d399]"
                                : utilization <= 100
                                  ? "bg-[#fbbf24]"
                                  : "bg-[#f87171]"
                            }`}
                            style={{
                              width: `${Math.min(utilization, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-[#5a5a66]">
                <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No budgets set up yet</p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 mt-3 text-[#c9a96e] hover:text-[#d4b87e] text-sm font-medium"
                >
                  Create a budget
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#fbbf24]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#ededef] text-sm">
                Quick Insights
              </h3>
              <p className="text-xs text-[#5a5a66]">Key metrics at a glance</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Calendar,
                value: formatAmount(analytics.avgDailySpending),
                label: "Avg. Daily Spending",
                color: "#60a5fa",
              },
              {
                icon: Activity,
                value: analytics.transactionCount.toString(),
                label: "Transactions",
                color: "#a855f7",
              },
              {
                icon: PieChart,
                value: Object.keys(analytics.categoryBreakdown).length.toString(),
                label: "Active Categories",
                color: "#34d399",
              },
              {
                icon: Target,
                value: budgets.length.toString(),
                label: "Active Budgets",
                color: "#fbbf24",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl bg-[#1e1e24] border border-[#2a2a32]"
              >
                <stat.icon
                  className="w-6 h-6 mx-auto mb-2"
                  style={{ color: stat.color }}
                />
                <p className="text-lg font-bold text-[#ededef]">{stat.value}</p>
                <p className="text-xs text-[#5a5a66]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
