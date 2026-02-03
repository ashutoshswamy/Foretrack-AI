"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Trash2,
  ArrowRight,
  Package,
  Pencil,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { supabase, type Expense } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useCurrency } from "@/lib/currency";

type ExpenseListProps = {
  refreshTrigger?: number;
  onUpdate?: () => void;
};

const categoryConfig: {
  [key: string]: { icon: string; color: string; bgColor: string };
} = {
  Food: {
    icon: "🍔",
    color: "text-orange-600",
    bgColor: "bg-gradient-to-br from-orange-100 to-red-100",
  },
  Transport: {
    icon: "🚗",
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-100 to-indigo-100",
  },
  Entertainment: {
    icon: "🎬",
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-100 to-pink-100",
  },
  Shopping: {
    icon: "🛍️",
    color: "text-pink-600",
    bgColor: "bg-gradient-to-br from-pink-100 to-rose-100",
  },
  Bills: {
    icon: "💡",
    color: "text-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100",
  },
  Health: {
    icon: "🏥",
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
  },
  Other: {
    icon: "📦",
    color: "text-gray-600",
    bgColor: "bg-gradient-to-br from-gray-100 to-slate-100",
  },
};

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Health",
  "Other",
];

export default function ExpenseList({
  refreshTrigger,
  onUpdate,
}: ExpenseListProps) {
  const { user } = useUser();
  const { formatAmount, currency } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user, refreshTrigger]);

  const fetchExpenses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(10);

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;
      fetchExpenses();
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
    }
  };

  const startEditing = (expense: Expense) => {
    setEditingId(expense.id);
    setEditForm({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description || "",
      date: expense.date,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ amount: "", category: "", description: "", date: "" });
  };

  const saveEdit = async (id: string) => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("expenses")
        .update({
          amount: parseFloat(editForm.amount),
          category: editForm.category,
          description: editForm.description,
          date: editForm.date,
        })
        .eq("id", id);

      if (error) throw error;

      setEditingId(null);
      fetchExpenses();
      onUpdate?.();
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense");
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
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </motion.div>
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
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
          >
            <ClipboardList className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Expenses</h2>
            <p className="text-xs text-gray-500">Your latest transactions</p>
          </div>
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full"
        >
          {expenses.length} items
        </motion.span>
      </div>

      {expenses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"
          >
            <Package className="w-10 h-10 text-indigo-400" />
          </motion.div>
          <p className="text-gray-600 font-medium">No expenses yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Add your first expense to start tracking
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {expenses.map((expense, index) => {
              const config =
                categoryConfig[expense.category] || categoryConfig.Other;
              const isEditing = editingId === expense.id;

              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`group p-4 rounded-xl transition-all duration-300 ${
                    isEditing
                      ? "bg-white shadow-lg ring-2 ring-indigo-500/20"
                      : "bg-white/50 hover:bg-white hover:shadow-lg"
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                              {currency.symbol}
                            </span>
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
                              className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) =>
                              setEditForm({ ...editForm, date: e.target.value })
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Category
                        </label>
                        <select
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
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
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Description"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={cancelEditing}
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => saveEdit(expense.id)}
                          disabled={saving}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
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
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center shadow-sm`}
                      >
                        <span className="text-2xl">{config.icon}</span>
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {expense.description || expense.category}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-xs font-medium ${config.color} bg-white/50 px-2 py-0.5 rounded-full`}
                          >
                            {expense.category}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-lg font-bold text-gray-900">
                      -{formatAmount(parseFloat(expense.amount.toString()))}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => startEditing(expense)}
                      className="p-2 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Edit expense"
                    >
                      <Pencil className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
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
