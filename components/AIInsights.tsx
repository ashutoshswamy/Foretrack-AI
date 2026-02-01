"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Trophy,
  Lightbulb,
  Target,
  Rocket,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import type { FinancialInsight, ExpenseData, BudgetData } from "@/lib/gemini";

const iconMap: { [key: string]: React.ReactNode } = {
  "🚀": <Rocket className="w-4 h-4" />,
  "💡": <Lightbulb className="w-4 h-4" />,
  "⚠️": <AlertTriangle className="w-4 h-4" />,
  "🏆": <Trophy className="w-4 h-4" />,
  "🎯": <Target className="w-4 h-4" />,
};

export default function AIInsights() {
  const { user } = useUser();
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const startDate = startOfMonth.toISOString().split("T")[0];

      const { data: expensesData, error: expensesError } = await supabase
        .from("expenses")
        .select("category, amount, description, date")
        .eq("user_id", user.id)
        .gte("date", startDate);

      if (expensesError) throw expensesError;

      const { data: budgetsData, error: budgetsError } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("period", "monthly");

      if (budgetsError) throw budgetsError;

      const spendingByCategory: { [key: string]: number } = {};
      let totalSpent = 0;

      const expenses: ExpenseData[] =
        expensesData?.map((e) => {
          const amount = parseFloat(e.amount.toString());
          spendingByCategory[e.category] =
            (spendingByCategory[e.category] || 0) + amount;
          totalSpent += amount;
          return {
            category: e.category,
            amount,
            description: e.description,
            date: e.date,
          };
        }) || [];

      const budgets: BudgetData[] =
        budgetsData?.map((b) => {
          const budgetAmount = parseFloat(b.amount.toString());
          const spent = spendingByCategory[b.category] || 0;
          return {
            category: b.category,
            amount: budgetAmount,
            spent,
            percentage: budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0,
          };
        }) || [];

      if (expenses.length === 0) {
        setInsights([
          {
            type: "tip",
            title: "Start Tracking",
            message:
              "Add your first expense to unlock AI-powered financial insights!",
            icon: "🚀",
          },
        ]);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses, budgets, totalSpent }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError("Unable to load AI insights");
      setInsights([
        {
          type: "tip",
          title: "Track Your Spending",
          message:
            "Keep logging your expenses to get personalized AI insights.",
          icon: "💡",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const getTypeStyles = (type: FinancialInsight["type"]) => {
    switch (type) {
      case "warning":
        return {
          bg: "from-amber-500 to-orange-600",
          border: "border-amber-200",
          bgLight: "bg-amber-50",
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      case "achievement":
        return {
          bg: "from-emerald-500 to-green-600",
          border: "border-emerald-200",
          bgLight: "bg-emerald-50",
          icon: <Trophy className="w-4 h-4" />,
        };
      case "suggestion":
        return {
          bg: "from-blue-500 to-cyan-600",
          border: "border-blue-200",
          bgLight: "bg-blue-50",
          icon: <Target className="w-4 h-4" />,
        };
      default:
        return {
          bg: "from-indigo-500 to-purple-600",
          border: "border-indigo-200",
          bgLight: "bg-indigo-50",
          icon: <Lightbulb className="w-4 h-4" />,
        };
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold text-gray-900">AI Insights</h3>
            <p className="text-xs text-gray-500">Analyzing your finances...</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="bg-gray-100 rounded-xl p-4 h-20"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">AI Insights</h3>
            <p className="text-xs text-gray-500">Powered by Gemini</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={fetchInsights}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-500 hover:text-indigo-600"
          title="Refresh insights"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-amber-600 bg-amber-50 rounded-lg p-3 mb-4"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {insights.map((insight, index) => {
            const styles = getTypeStyles(insight.type);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`p-4 rounded-xl ${styles.bgLight} border ${styles.border} transition-shadow hover:shadow-md cursor-default`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${styles.bg} flex items-center justify-center flex-shrink-0 shadow-sm text-white`}
                  >
                    {iconMap[insight.icon] || styles.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
