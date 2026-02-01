"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, Sparkles, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useCurrency } from "@/lib/currency";

type ExpenseFormProps = {
  onSuccess?: () => void;
};

const categories = [
  {
    value: "Food",
    label: "Food & Dining",
    icon: "🍔",
    color: "from-orange-400 to-red-500",
  },
  {
    value: "Transport",
    label: "Transport",
    icon: "🚗",
    color: "from-blue-400 to-indigo-500",
  },
  {
    value: "Entertainment",
    label: "Entertainment",
    icon: "🎬",
    color: "from-purple-400 to-pink-500",
  },
  {
    value: "Shopping",
    label: "Shopping",
    icon: "🛍️",
    color: "from-pink-400 to-rose-500",
  },
  {
    value: "Bills",
    label: "Bills & Utilities",
    icon: "💡",
    color: "from-yellow-400 to-orange-500",
  },
  {
    value: "Health",
    label: "Health & Fitness",
    icon: "🏥",
    color: "from-green-400 to-emerald-500",
  },
  {
    value: "Other",
    label: "Other",
    icon: "📦",
    color: "from-gray-400 to-slate-500",
  },
];

export default function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const { user } = useUser();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [categorizing, setCategorizing] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const autoCategorize = useCallback(async (description: string) => {
    if (description.length < 3) return;

    setCategorizing(true);
    try {
      const response = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (response.ok) {
        const data = await response.json();
        if (
          data.category &&
          categories.find((c) => c.value === data.category)
        ) {
          setFormData((prev) => ({ ...prev, category: data.category }));
        }
      }
    } catch (error) {
      console.error("Auto-categorize error:", error);
    } finally {
      setCategorizing(false);
    }
  }, []);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const description = e.target.value;
    setFormData({ ...formData, description });

    if (description.length >= 3 && !formData.category) {
      const timeoutId = setTimeout(() => {
        autoCategorize(description);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("expenses").insert([
        {
          user_id: user.id,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        },
      ]);

      if (error) throw error;

      setFormData({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert(
        `Failed to add expense: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(
    (c) => c.value === formData.category,
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-6 space-y-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
        >
          <Plus className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Add Expense</h2>
          <p className="text-xs text-gray-500">Track your spending</p>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            {currency.symbol}
          </span>
          <input
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="input-modern text-lg font-semibold"
            style={{ paddingLeft: "2.5rem" }}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData({ ...formData, category: cat.value })}
              className={`p-2 sm:p-3 rounded-lg sm:rounded-xl text-center transition-all duration-200 ${
                formData.category === cat.value
                  ? `bg-gradient-to-br ${cat.color} text-white shadow-lg scale-105`
                  : "bg-white/80 hover:bg-white hover:shadow-md"
              }`}
            >
              <span className="text-lg sm:text-xl block mb-0.5 sm:mb-1">
                {cat.icon}
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium block truncate">
                {cat.value}
              </span>
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {selectedCategory && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 text-xs text-indigo-600 font-medium"
            >
              Selected: {selectedCategory.label}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
          <AnimatePresence>
            {categorizing && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-2 text-xs text-indigo-500 font-normal inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                AI suggesting category...
              </motion.span>
            )}
          </AnimatePresence>
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.description}
            onChange={handleDescriptionChange}
            className="input-modern pr-10"
            placeholder="What did you spend on? (AI will suggest category)"
          />
          <AnimatePresence>
            {categorizing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Date
        </label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="input-modern"
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading || !formData.category}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Adding...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Expense
          </span>
        )}
      </motion.button>
    </motion.form>
  );
}
