"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, RefreshCw, AlertTriangle, Trophy, Lightbulb, Target, Rocket,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import type { FinancialInsight, ExpenseData, BudgetData } from "@/lib/gemini";

const iconMap: { [key: string]: React.ReactNode } = {
  "🚀": <Rocket className="w-3.5 h-3.5" />,
  "💡": <Lightbulb className="w-3.5 h-3.5" />,
  "⚠️": <AlertTriangle className="w-3.5 h-3.5" />,
  "🏆": <Trophy className="w-3.5 h-3.5" />,
  "🎯": <Target className="w-3.5 h-3.5" />,
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
        .from("expenses").select("category, amount, description, date")
        .eq("user_id", user.id).gte("date", startDate);
      if (expensesError) throw expensesError;

      const { data: budgetsData, error: budgetsError } = await supabase
        .from("budgets").select("*").eq("user_id", user.id).eq("period", "monthly");
      if (budgetsError) throw budgetsError;

      const spendingByCategory: { [key: string]: number } = {};
      let totalSpent = 0;

      const expenses: ExpenseData[] = expensesData?.map((e) => {
        const amount = parseFloat(e.amount.toString());
        spendingByCategory[e.category] = (spendingByCategory[e.category] || 0) + amount;
        totalSpent += amount;
        return { category: e.category, amount, description: e.description, date: e.date };
      }) || [];

      const budgets: BudgetData[] = budgetsData?.map((b) => {
        const budgetAmount = parseFloat(b.amount.toString());
        const spent = spendingByCategory[b.category] || 0;
        return { category: b.category, amount: budgetAmount, spent, percentage: budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0 };
      }) || [];

      if (expenses.length === 0) {
        setInsights([{ type: "tip", title: "Start Tracking", message: "Add your first expense to unlock AI-powered financial insights!", icon: "🚀" }]);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/ai/insights", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses, budgets, totalSpent }),
      });
      if (!response.ok) throw new Error("Failed to fetch insights");
      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError("Unable to load AI insights");
      setInsights([{ type: "tip", title: "Track Your Spending", message: "Keep logging your expenses to get personalized AI insights.", icon: "💡" }]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchInsights(); }, [fetchInsights]);

  const getTypeStyles = (type: FinancialInsight["type"]) => {
    switch (type) {
      case "warning": return { bg: "bg-[#fbbf24]", border: "border-[#fbbf24]/15", bgLight: "bg-[#fbbf24]/8", icon: <AlertTriangle className="w-3.5 h-3.5" /> };
      case "achievement": return { bg: "bg-[#34d399]", border: "border-[#34d399]/15", bgLight: "bg-[#34d399]/8", icon: <Trophy className="w-3.5 h-3.5" /> };
      case "suggestion": return { bg: "bg-[#60a5fa]", border: "border-[#60a5fa]/15", bgLight: "bg-[#60a5fa]/8", icon: <Target className="w-3.5 h-3.5" /> };
      default: return { bg: "bg-[#c9a96e]", border: "border-[#c9a96e]/15", bgLight: "bg-[#c9a96e]/8", icon: <Lightbulb className="w-3.5 h-3.5" /> };
    }
  };

  if (loading) {
    return (
      <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-9 h-9 rounded-lg bg-[#c9a96e] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#0c0c0e]" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-[#ededef] text-sm">AI Insights</h3>
            <p className="text-[10px] text-[#5a5a66]">Analyzing your finances...</p>
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#1e1e24] rounded-lg p-4 h-16 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }} className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#c9a96e] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#0c0c0e]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#ededef] text-sm">AI Insights</h3>
            <p className="text-[10px] text-[#5a5a66]">Powered by Gemini</p>
          </div>
        </div>
        <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}
          onClick={fetchInsights} disabled={loading}
          className="p-2 rounded-lg hover:bg-[#1e1e24] transition-colors text-[#5a5a66] hover:text-[#c9a96e]">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-xs text-[#fbbf24] bg-[#fbbf24]/8 border border-[#fbbf24]/15 rounded-lg p-3 mb-3">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {insights.map((insight, index) => {
            const styles = getTypeStyles(insight.type);
            return (
              <motion.div key={index}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2, delay: index * 0.06 }}
                className={`p-3 rounded-lg ${styles.bgLight} border ${styles.border} transition-colors`}>
                <div className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-md ${styles.bg} flex items-center justify-center flex-shrink-0 text-[#0c0c0e]`}>
                    {iconMap[insight.icon] || styles.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#ededef] text-xs">{insight.title}</h4>
                    <p className="text-xs text-[#8b8b96] mt-0.5 leading-relaxed">{insight.message}</p>
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
