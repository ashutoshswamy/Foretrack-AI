"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, Calendar, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useCurrency } from "@/lib/currency";

type IncomeFormProps = {
  onSuccess?: () => void;
};

const incomeSources = [
  {
    value: "Salary",
    label: "Salary",
    icon: "💼",
    color: "from-green-400 to-emerald-500",
  },
  {
    value: "Freelance",
    label: "Freelance",
    icon: "💻",
    color: "from-blue-400 to-indigo-500",
  },
  {
    value: "Business",
    label: "Business",
    icon: "🏢",
    color: "from-purple-400 to-violet-500",
  },
  {
    value: "Investments",
    label: "Investments",
    icon: "📈",
    color: "from-amber-400 to-orange-500",
  },
  {
    value: "Rental",
    label: "Rental",
    icon: "🏠",
    color: "from-teal-400 to-cyan-500",
  },
  {
    value: "Gifts",
    label: "Gifts",
    icon: "🎁",
    color: "from-pink-400 to-rose-500",
  },
  {
    value: "Refunds",
    label: "Refunds",
    icon: "💸",
    color: "from-lime-400 to-green-500",
  },
  {
    value: "Other",
    label: "Other",
    icon: "📦",
    color: "from-gray-400 to-slate-500",
  },
];

export default function IncomeForm({ onSuccess }: IncomeFormProps) {
  const { user } = useUser();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("incomes").insert([
        {
          user_id: user.id,
          amount: parseFloat(formData.amount),
          source: formData.source,
          description: formData.description,
          date: formData.date,
        },
      ]);

      if (error) throw error;

      setFormData({
        amount: "",
        source: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error adding income:", error);
      alert(
        `Failed to add income: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedSource = incomeSources.find((s) => s.value === formData.source);

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
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg"
        >
          <TrendingUp className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Add Income</h2>
          <p className="text-xs text-gray-500">Track your earnings</p>
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

      {/* Source Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Income Source
        </label>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {incomeSources.map((source) => (
            <motion.button
              key={source.value}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData({ ...formData, source: source.value })}
              className={`p-2 sm:p-3 rounded-lg sm:rounded-xl text-center transition-all duration-200 ${
                formData.source === source.value
                  ? `bg-gradient-to-br ${source.color} text-white shadow-lg scale-105`
                  : "bg-white/80 hover:bg-white hover:shadow-md"
              }`}
            >
              <span className="text-lg sm:text-xl block mb-0.5 sm:mb-1">
                {source.icon}
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium block truncate">
                {source.value}
              </span>
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {selectedSource && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 text-xs text-emerald-600 font-medium"
            >
              Selected: {selectedSource.label}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input-modern"
          placeholder="Add notes about this income"
        />
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
        disabled={loading || !formData.source}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Adding...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Income
          </span>
        )}
      </motion.button>
    </motion.form>
  );
}
