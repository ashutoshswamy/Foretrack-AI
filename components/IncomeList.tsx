"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Trash2,
  ArrowRight,
  Package,
  Pencil,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { supabase, type Income, type IncomeSource } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useCurrency } from "@/lib/currency";

type IncomeListProps = {
  refreshTrigger?: number;
  onUpdate?: () => void;
};

const sourceConfig: {
  [key: string]: { icon: string; color: string; bgColor: string };
} = {
  Salary: {
    icon: "💼",
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
  },
  Freelance: {
    icon: "💻",
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-100 to-indigo-100",
  },
  Business: {
    icon: "🏢",
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-100 to-violet-100",
  },
  Investments: {
    icon: "📈",
    color: "text-amber-600",
    bgColor: "bg-gradient-to-br from-amber-100 to-orange-100",
  },
  Rental: {
    icon: "🏠",
    color: "text-teal-600",
    bgColor: "bg-gradient-to-br from-teal-100 to-cyan-100",
  },
  Gifts: {
    icon: "🎁",
    color: "text-pink-600",
    bgColor: "bg-gradient-to-br from-pink-100 to-rose-100",
  },
  Refunds: {
    icon: "💸",
    color: "text-lime-600",
    bgColor: "bg-gradient-to-br from-lime-100 to-green-100",
  },
  Other: {
    icon: "📦",
    color: "text-gray-600",
    bgColor: "bg-gradient-to-br from-gray-100 to-slate-100",
  },
};

const incomeSources: IncomeSource[] = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Rental",
  "Gifts",
  "Refunds",
  "Other",
];

export default function IncomeList({
  refreshTrigger,
  onUpdate,
}: IncomeListProps) {
  const { user } = useUser();
  const { formatAmount, currency } = useCurrency();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    source: "",
    description: "",
    date: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchIncomes();
    }
  }, [user, refreshTrigger]);

  const fetchIncomes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("incomes")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(10);

      if (error) throw error;
      setIncomes(data || []);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteIncome = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income?")) return;

    try {
      const { error } = await supabase.from("incomes").delete().eq("id", id);

      if (error) throw error;
      fetchIncomes();
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income");
    }
  };

  const startEditing = (income: Income) => {
    setEditingId(income.id);
    setEditForm({
      amount: income.amount.toString(),
      source: income.source,
      description: income.description || "",
      date: income.date,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ amount: "", source: "", description: "", date: "" });
  };

  const saveEdit = async (id: string) => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("incomes")
        .update({
          amount: parseFloat(editForm.amount),
          source: editForm.source,
          description: editForm.description,
          date: editForm.date,
        })
        .eq("id", id);

      if (error) throw error;

      setEditingId(null);
      fetchIncomes();
      onUpdate?.();
    } catch (error) {
      console.error("Error updating income:", error);
      alert("Failed to update income");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"
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
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg"
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Income</h2>
            <p className="text-xs text-gray-500">
              Last {incomes.length} entries
            </p>
          </div>
        </div>
      </div>

      {incomes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 px-4"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center"
          >
            <Package className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No income recorded yet
          </h3>
          <p className="text-gray-500 text-sm">
            Start tracking your income to see them here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {incomes.map((income, index) => {
              const config = sourceConfig[income.source] || sourceConfig.Other;
              const isEditing = editingId === income.id;

              return (
                <motion.div
                  key={income.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative rounded-xl overflow-hidden ${config.bgColor} hover:shadow-lg transition-all duration-300`}
                >
                  {isEditing ? (
                    // Edit Mode
                    <div className="p-4 space-y-3">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-600 mb-1 block">
                            Amount ({currency.symbol})
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                amount: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-600 mb-1 block">
                            Source
                          </label>
                          <select
                            value={editForm.source}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                source: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            {incomeSources.map((source) => (
                              <option key={source} value={source}>
                                {source}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-600 mb-1 block">
                            Description
                          </label>
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Optional description"
                          />
                        </div>
                        <div className="w-32">
                          <label className="text-xs text-gray-600 mb-1 block">
                            Date
                          </label>
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) =>
                              setEditForm({ ...editForm, date: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={cancelEditing}
                          className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-white/50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => saveEdit(income.id)}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-lg text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-1"
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="p-4 flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-2xl shadow-sm"
                      >
                        {config.icon}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${config.color}`}>
                            {income.source}
                          </span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatDate(income.date)}
                          </span>
                        </div>
                        {income.description && (
                          <p className="text-sm text-gray-600 truncate mt-0.5">
                            {income.description}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold text-emerald-600">
                          +{formatAmount(income.amount)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEditing(income)}
                          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteIncome(income.id)}
                          className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
