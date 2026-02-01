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
  DollarSign,
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
    color: "text-orange-600",
    bgColor: "bg-gradient-to-br from-orange-100 to-red-100",
    chartColor: "#f97316",
  },
  Transport: {
    icon: "🚗",
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-100 to-indigo-100",
    chartColor: "#3b82f6",
  },
  Entertainment: {
    icon: "🎬",
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-100 to-pink-100",
    chartColor: "#a855f7",
  },
  Shopping: {
    icon: "🛍️",
    color: "text-pink-600",
    bgColor: "bg-gradient-to-br from-pink-100 to-rose-100",
    chartColor: "#ec4899",
  },
  Bills: {
    icon: "💡",
    color: "text-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100",
    chartColor: "#eab308",
  },
  Health: {
    icon: "🏥",
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
    chartColor: "#22c55e",
  },
  Other: {
    icon: "📦",
    color: "text-gray-600",
    bgColor: "bg-gradient-to-br from-gray-100 to-slate-100",
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

    // Category breakdown
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

    // Daily spending for the period
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

    // Top spending categories
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
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

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
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/dashboard"
                className="p-1.5 sm:p-2 rounded-xl hover:bg-white/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-base sm:text-xl font-bold gradient-text">
                    Analytics
                  </h1>
                  <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                    Financial Insights
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-gray-600">
                  {analytics.transactionCount} transactions
                </span>
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-xl ring-2 ring-indigo-500/20",
                  },
                }}
              />
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
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
        >
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Financial Overview 📊
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Analyze your spending patterns and track your financial health
            </p>
          </div>
          <div className="glass-card rounded-xl p-1 flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
            {(["week", "month", "quarter", "year"] as TimeRange[]).map(
              (range) => (
                <motion.button
                  key={range}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 capitalize whitespace-nowrap ${
                    timeRange === range
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-white/50"
                  }`}
                >
                  {range}
                </motion.button>
              ),
            )}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {/* Total Expenses */}
          <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div
                className={`flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-medium ${
                  analytics.expenseChange > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {analytics.expenseChange > 0 ? (
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                {Math.abs(analytics.expenseChange).toFixed(1)}%
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
              Total Expenses
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {formatAmount(analytics.totalExpenses)}
            </p>
          </div>

          {/* Total Income */}
          <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div
                className={`flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-medium ${
                  analytics.incomeChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {analytics.incomeChange >= 0 ? (
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                {Math.abs(analytics.incomeChange).toFixed(1)}%
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
              Total Income
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {formatAmount(analytics.totalIncome)}
            </p>
          </div>

          {/* Net Savings */}
          <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
              <div
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                  analytics.netSavings >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {analytics.netSavings >= 0 ? "Surplus" : "Deficit"}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
              Net Savings
            </p>
            <p
              className={`text-lg sm:text-2xl font-bold ${
                analytics.netSavings >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatAmount(Math.abs(analytics.netSavings))}
            </p>
          </div>

          {/* Savings Rate */}
          <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
              Savings Rate
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {analytics.savingsRate.toFixed(1)}%
            </p>
            <div className="mt-1.5 sm:mt-2 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(Math.max(analytics.savingsRate, 0), 100)}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  analytics.savingsRate >= 20
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : analytics.savingsRate >= 10
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                      : "bg-gradient-to-r from-red-500 to-pink-500"
                }`}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  Spending by Category
                </h3>
                <p className="text-sm text-gray-500">Where your money goes</p>
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center text-lg`}
                          >
                            {config.icon}
                          </span>
                          <span className="font-medium text-gray-900">
                            {category}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatAmount(amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: config.chartColor }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <PieChart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No expense data for this period</p>
              </div>
            )}
          </motion.div>

          {/* Budget Utilization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Budget Status</h3>
                <p className="text-sm text-gray-500">
                  Track your budget limits
                </p>
              </div>
            </div>

            {budgets.length > 0 ? (
              <div className="space-y-4">
                {/* Overall Budget */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">
                      Overall Budget
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        budgetUtilization <= 80
                          ? "bg-green-100 text-green-700"
                          : budgetUtilization <= 100
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {budgetUtilization.toFixed(0)}% used
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatAmount(analytics.totalExpenses)}
                    </span>
                    <span className="text-gray-500">
                      / {formatAmount(totalBudget)}
                    </span>
                  </div>
                  <div className="h-3 bg-white rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(budgetUtilization, 100)}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        budgetUtilization <= 80
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : budgetUtilization <= 100
                            ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                            : "bg-gradient-to-r from-red-500 to-pink-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Individual Budgets */}
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                      className="flex items-center gap-4"
                    >
                      <span
                        className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center text-lg flex-shrink-0`}
                      >
                        {config.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 truncate">
                            {budget.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatAmount(spent)} /{" "}
                            {formatAmount(budget.amount)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              utilization <= 80
                                ? "bg-green-500"
                                : utilization <= 100
                                  ? "bg-amber-500"
                                  : "bg-red-500"
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
              <div className="text-center py-12 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No budgets set up yet</p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Create a budget
                  <ArrowUpRight className="w-4 h-4" />
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
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Quick Insights</h3>
              <p className="text-sm text-gray-500">Key metrics at a glance</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(analytics.avgDailySpending)}
              </p>
              <p className="text-sm text-gray-500">Avg. Daily Spending</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
              <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {analytics.transactionCount}
              </p>
              <p className="text-sm text-gray-500">Transactions</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(analytics.categoryBreakdown).length}
              </p>
              <p className="text-sm text-gray-500">Active Categories</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50">
              <Target className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {budgets.length}
              </p>
              <p className="text-sm text-gray-500">Active Budgets</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
