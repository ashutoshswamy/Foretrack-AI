"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useCurrency } from "@/lib/currency";

type BudgetFormProps = {
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

const periods = [
  { value: "weekly", label: "Weekly", icon: "📅" },
  { value: "monthly", label: "Monthly", icon: "🗓️" },
  { value: "yearly", label: "Yearly", icon: "📆" },
];

export default function BudgetForm({ onSuccess }: BudgetFormProps) {
  const { user } = useUser();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly" as "monthly" | "weekly" | "yearly",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("budgets").insert([
        {
          user_id: user.id,
          category: formData.category,
          amount: parseFloat(formData.amount),
          period: formData.period,
        },
      ]);

      if (error) throw error;

      setFormData({
        category: "",
        amount: "",
        period: "monthly",
      });

      onSuccess?.();
    } catch (error: unknown) {
      console.error("Error adding budget:", error);
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23505"
      ) {
        alert("A budget for this category and period already exists");
      } else {
        alert("Failed to add budget");
      }
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
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"
        >
          <Shield className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Set Budget</h2>
          <p className="text-xs text-gray-500">Control your spending limits</p>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData({ ...formData, category: cat.value })}
              className={`p-3 rounded-xl text-center transition-all duration-200 ${
                formData.category === cat.value
                  ? `bg-gradient-to-br ${cat.color} text-white shadow-lg scale-105`
                  : "bg-white/80 hover:bg-white hover:shadow-md"
              }`}
            >
              <span className="text-xl block mb-1">{cat.icon}</span>
              <span className="text-[10px] font-medium block truncate">
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
              className="mt-2 text-xs text-emerald-600 font-medium"
            >
              Selected: {selectedCategory.label}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Budget Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Amount
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

      {/* Period Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Period
        </label>
        <div className="grid grid-cols-3 gap-2">
          {periods.map((period) => (
            <motion.button
              key={period.value}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setFormData({
                  ...formData,
                  period: period.value as "monthly" | "weekly" | "yearly",
                })
              }
              className={`p-3 rounded-xl text-center transition-all duration-200 ${
                formData.period === period.value
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
                  : "bg-white/80 hover:bg-white hover:shadow-md text-gray-700"
              }`}
            >
              <span className="text-lg block mb-1">{period.icon}</span>
              <span className="text-xs font-medium">{period.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading || !formData.category}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Setting...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Set Budget
          </span>
        )}
      </motion.button>
    </motion.form>
  );
}
