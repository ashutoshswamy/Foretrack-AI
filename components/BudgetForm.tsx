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
  { value: "Food", label: "Food & Dining", icon: "🍔", color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  { value: "Transport", label: "Transport", icon: "🚗", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  { value: "Entertainment", label: "Entertainment", icon: "🎬", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  { value: "Shopping", label: "Shopping", icon: "🛍️", color: "bg-pink-500/15 text-pink-400 border-pink-500/20" },
  { value: "Bills", label: "Bills & Utilities", icon: "💡", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  { value: "Health", label: "Health & Fitness", icon: "🏥", color: "bg-green-500/15 text-green-400 border-green-500/20" },
  { value: "Other", label: "Other", icon: "📦", color: "bg-gray-500/15 text-gray-400 border-gray-500/20" },
];

const periods = [
  { value: "weekly", label: "Weekly", icon: "W" },
  { value: "monthly", label: "Monthly", icon: "M" },
  { value: "yearly", label: "Yearly", icon: "Y" },
];

export default function BudgetForm({ onSuccess }: BudgetFormProps) {
  const { user } = useUser();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "", amount: "", period: "monthly" as "monthly" | "weekly" | "yearly",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("budgets").insert([{
        user_id: user.id, category: formData.category,
        amount: parseFloat(formData.amount), period: formData.period,
      }]);
      if (error) throw error;
      setFormData({ category: "", amount: "", period: "monthly" });
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Error adding budget:", error);
      if (error && typeof error === "object" && "code" in error && error.code === "23505") {
        alert("A budget for this category and period already exists");
      } else {
        alert("Failed to add budget");
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find((c) => c.value === formData.category);

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-lg bg-[#60a5fa] flex items-center justify-center">
          <Shield className="w-4 h-4 text-[#0c0c0e]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#ededef]">Set Budget</h2>
          <p className="text-[10px] text-[#5a5a66]">Control your spending limits</p>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Category</label>
        <div className="grid grid-cols-4 gap-1.5">
          {categories.map((cat) => (
            <button key={cat.value} type="button"
              onClick={() => setFormData({ ...formData, category: cat.value })}
              className={`p-2 rounded-lg text-center transition-all duration-200 border ${
                formData.category === cat.value
                  ? cat.color
                  : "bg-[#1e1e24] border-[#2a2a32] hover:border-[#3a3a42]"
              }`}
            >
              <span className="text-base block mb-0.5">{cat.icon}</span>
              <span className={`text-[9px] font-medium block truncate ${formData.category === cat.value ? "" : "text-[#5a5a66]"}`}>{cat.value}</span>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {selectedCategory && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mt-1.5 text-[10px] text-[#60a5fa] font-medium">
              Selected: {selectedCategory.label}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Budget Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a66] text-sm font-medium">{currency.symbol}</span>
          <input type="number" step="0.01" required value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="input-modern text-base font-semibold" style={{ paddingLeft: "2rem" }} placeholder="0.00" />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Period</label>
        <div className="grid grid-cols-3 gap-2">
          {periods.map((period) => (
            <button key={period.value} type="button"
              onClick={() => setFormData({ ...formData, period: period.value as "monthly" | "weekly" | "yearly" })}
              className={`py-2.5 rounded-lg text-center transition-all duration-200 border text-xs font-medium ${
                formData.period === period.value
                  ? "bg-[#60a5fa]/15 text-[#60a5fa] border-[#60a5fa]/20"
                  : "bg-[#1e1e24] border-[#2a2a32] text-[#5a5a66] hover:border-[#3a3a42]"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading || !formData.category}
        className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-[#0c0c0e] bg-[#60a5fa] hover:bg-[#93bbfd] disabled:bg-[#2a2a32] disabled:text-[#5a5a66] disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
        {loading ? (
          <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Setting...</span>
        ) : (
          <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Set Budget</span>
        )}
      </button>
    </motion.form>
  );
}
