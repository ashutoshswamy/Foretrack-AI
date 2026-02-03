"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Calculator,
  AlertTriangle,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { supabase, type Budget } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useCurrency } from "@/lib/currency";

type BudgetStats = {
  id: string;
  category: string;
  spent: number;
  budget: number;
  percentage: number;
  period: string;
};

type BudgetOverviewProps = {
  onUpdate?: () => void;
};

const categoryConfig: {
  [key: string]: { icon: string; color: string; bgColor: string };
} = {
  Food: {
    icon: "🍔",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-100",
  },
  Transport: {
    icon: "🚗",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-100",
  },
  Entertainment: {
    icon: "🎬",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-100",
  },
  Shopping: {
    icon: "🛍️",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-100",
  },
  Bills: {
    icon: "💡",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-100",
  },
  Health: {
    icon: "🏥",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-100",
  },
  Other: {
    icon: "📦",
    color: "from-gray-500 to-slate-500",
    bgColor: "bg-gray-100",
  },
};

export default function BudgetOverview({ onUpdate }: BudgetOverviewProps) {
  const { user } = useUser();
  const { formatAmount, currency } = useCurrency();
  const [stats, setStats] = useState<BudgetStats[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBudgetStats();
    }
  }, [user]);

  const fetchBudgetStats = async () => {
    if (!user) return;

    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const startDate = startOfMonth.toISOString().split("T")[0];

      const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select("category, amount")
        .eq("user_id", user.id)
        .gte("date", startDate);

      if (expensesError) throw expensesError;

      const { data: budgets, error: budgetsError } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("period", "monthly");

      if (budgetsError) throw budgetsError;

      const spendingByCategory: { [key: string]: number } = {};
      let total = 0;

      expenses?.forEach((expense) => {
        const amount = parseFloat(expense.amount.toString());
        spendingByCategory[expense.category] =
          (spendingByCategory[expense.category] || 0) + amount;
        total += amount;
      });

      setTotalSpent(total);

      const budgetTotal =
        budgets?.reduce((sum, b) => sum + parseFloat(b.amount.toString()), 0) ||
        0;
      setTotalBudget(budgetTotal);

      const budgetStats: BudgetStats[] =
        budgets?.map((budget) => {
          const spent = spendingByCategory[budget.category] || 0;
          const budgetAmount = parseFloat(budget.amount.toString());
          return {
            id: budget.id,
            category: budget.category,
            spent,
            budget: budgetAmount,
            percentage: budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0,
            period: budget.period,
          };
        }) || [];

      setStats(budgetStats);
    } catch (error) {
      console.error("Error fetching budget stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (stat: BudgetStats) => {
    setEditingId(stat.id);
    setEditAmount(stat.budget.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditAmount("");
  };

  const saveEdit = async (id: string) => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("budgets")
        .update({ amount: parseFloat(editAmount) })
        .eq("id", id);

      if (error) throw error;

      setEditingId(null);
      fetchBudgetStats();
      onUpdate?.();
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Failed to update budget");
    } finally {
      setSaving(false);
    }
  };

  const deleteBudget = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;

    try {
      const { error } = await supabase.from("budgets").delete().eq("id", id);

      if (error) throw error;
      fetchBudgetStats();
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Failed to delete budget");
    }
  };

  const overallPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="h-24 bg-gray-200 rounded"
          />
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
                  delay: i * 0.1,
                }}
                className="h-12 bg-gray-200 rounded"
              />
            ))}
          </div>
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
          >
            <BarChart3 className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Budget Overview</h2>
            <p className="text-xs text-gray-500">This month&apos;s spending</p>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-white/50 px-3 py-1 rounded-full">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Total Spent Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 mb-6"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"
        />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">
            Total Spent This Month
          </p>
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-4xl font-bold text-white mb-4"
          >
            {formatAmount(totalSpent)}
          </motion.p>
          {totalBudget > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/80">
                <span>Budget used</span>
                <span>{overallPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className={`h-2 rounded-full ${
                    overallPercentage > 100 ? "bg-red-400" : "bg-white"
                  }`}
                />
              </div>
              <p className="text-xs text-white/60">
                {formatAmount(totalBudget - totalSpent)} remaining of{" "}
                {formatAmount(totalBudget)} budget
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {stats.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center"
          >
            <Calculator className="w-8 h-8 text-gray-400" />
          </motion.div>
          <p className="text-gray-500 font-medium">No budgets set yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first budget to start tracking
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {stats.map((stat, index) => {
              const config =
                categoryConfig[stat.category] || categoryConfig.Other;
              const isEditing = editingId === stat.id;

              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-xl transition-all duration-200 group ${
                    isEditing
                      ? "bg-white shadow-lg ring-2 ring-emerald-500/20"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}
                      >
                        <span className="text-lg">{config.icon}</span>
                      </motion.div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          {stat.category}
                        </span>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          {stat.percentage > 100 ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              Over budget!
                            </>
                          ) : (
                            `${(100 - stat.percentage).toFixed(0)}% remaining`
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                              {currency.symbol}
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="w-28 pl-7 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={cancelEditing}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => saveEdit(stat.id)}
                            disabled={saving}
                            className="p-1.5 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                          >
                            {saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </motion.button>
                        </div>
                      ) : (
                        <>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {formatAmount(stat.spent)}
                            </p>
                            <p className="text-xs text-gray-500">
                              of {formatAmount(stat.budget)}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEditing(stat)}
                            className="sm:opacity-0 sm:group-hover:opacity-100 p-2 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all duration-200"
                            title="Edit budget"
                          >
                            <Pencil className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteBudget(stat.id)}
                            className="sm:opacity-0 sm:group-hover:opacity-100 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                            title="Delete budget"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(stat.percentage, 100)}%`,
                        }}
                        transition={{
                          delay: 0.3 + index * 0.1,
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                        className={`h-2.5 rounded-full bg-gradient-to-r ${
                          stat.percentage > 100
                            ? "from-red-500 to-red-600"
                            : stat.percentage > 80
                              ? "from-amber-500 to-orange-500"
                              : config.color
                        }`}
                      />
                    </div>
                    {stat.percentage > 100 && (
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute top-0 right-0 w-1 h-2.5 bg-red-600 rounded-full"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
