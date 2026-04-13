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
  { value: "Salary", label: "Salary", icon: "💼", color: "bg-green-500/15 text-green-400 border-green-500/20" },
  { value: "Freelance", label: "Freelance", icon: "💻", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  { value: "Business", label: "Business", icon: "🏢", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  { value: "Investments", label: "Investments", icon: "📈", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  { value: "Rental", label: "Rental", icon: "🏠", color: "bg-teal-500/15 text-teal-400 border-teal-500/20" },
  { value: "Gifts", label: "Gifts", icon: "🎁", color: "bg-pink-500/15 text-pink-400 border-pink-500/20" },
  { value: "Refunds", label: "Refunds", icon: "💸", color: "bg-lime-500/15 text-lime-400 border-lime-500/20" },
  { value: "Other", label: "Other", icon: "📦", color: "bg-gray-500/15 text-gray-400 border-gray-500/20" },
];

export default function IncomeForm({ onSuccess }: IncomeFormProps) {
  const { user } = useUser();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "", source: "", description: "", date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("incomes").insert([{
        user_id: user.id, amount: parseFloat(formData.amount),
        source: formData.source, description: formData.description, date: formData.date,
      }]);
      if (error) throw error;
      setFormData({ amount: "", source: "", description: "", date: new Date().toISOString().split("T")[0] });
      onSuccess?.();
    } catch (error) {
      console.error("Error adding income:", error);
      alert(`Failed to add income: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedSource = incomeSources.find((s) => s.value === formData.source);

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-lg bg-[#34d399] flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-[#0c0c0e]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#ededef]">Add Income</h2>
          <p className="text-[10px] text-[#5a5a66]">Track your earnings</p>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a66] text-sm font-medium">{currency.symbol}</span>
          <input type="number" step="0.01" required value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="input-modern text-base font-semibold" style={{ paddingLeft: "2rem" }} placeholder="0.00" />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Income Source</label>
        <div className="grid grid-cols-4 gap-1.5">
          {incomeSources.map((source) => (
            <button key={source.value} type="button"
              onClick={() => setFormData({ ...formData, source: source.value })}
              className={`p-2 rounded-lg text-center transition-all duration-200 border ${
                formData.source === source.value
                  ? source.color
                  : "bg-[#1e1e24] border-[#2a2a32] hover:border-[#3a3a42]"
              }`}
            >
              <span className="text-base block mb-0.5">{source.icon}</span>
              <span className={`text-[9px] font-medium block truncate ${formData.source === source.value ? "" : "text-[#5a5a66]"}`}>{source.value}</span>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {selectedSource && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mt-1.5 text-[10px] text-[#34d399] font-medium">
              Selected: {selectedSource.label}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Description (Optional)</label>
        <input type="text" value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-modern" placeholder="Add notes about this income" />
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" /> Date
        </label>
        <input type="date" required value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="input-modern" />
      </div>

      <button type="submit" disabled={loading || !formData.source}
        className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-[#0c0c0e] bg-[#34d399] hover:bg-[#4ade80] disabled:bg-[#2a2a32] disabled:text-[#5a5a66] disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
        {loading ? (
          <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Adding...</span>
        ) : (
          <span className="flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Income</span>
        )}
      </button>
    </motion.form>
  );
}
