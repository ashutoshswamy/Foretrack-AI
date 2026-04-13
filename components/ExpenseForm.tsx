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
  { value: "Food", label: "Food & Dining", icon: "🍔", color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  { value: "Transport", label: "Transport", icon: "🚗", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  { value: "Entertainment", label: "Entertainment", icon: "🎬", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  { value: "Shopping", label: "Shopping", icon: "🛍️", color: "bg-pink-500/15 text-pink-400 border-pink-500/20" },
  { value: "Bills", label: "Bills & Utilities", icon: "💡", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  { value: "Health", label: "Health & Fitness", icon: "🏥", color: "bg-green-500/15 text-green-400 border-green-500/20" },
  { value: "Other", label: "Other", icon: "📦", color: "bg-gray-500/15 text-gray-400 border-gray-500/20" },
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
        if (data.category && categories.find((c) => c.value === data.category)) {
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
      const timeoutId = setTimeout(() => { autoCategorize(description); }, 500);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("expenses").insert([{
        user_id: user.id, amount: parseFloat(formData.amount),
        category: formData.category, description: formData.description, date: formData.date,
      }]);
      if (error) { console.error("Supabase error:", error.message, error.details, error.hint); throw new Error(error.message || "Database error"); }
      setFormData({ amount: "", category: "", description: "", date: new Date().toISOString().split("T")[0] });
      onSuccess?.();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert(`Failed to add expense: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
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
        <div className="w-9 h-9 rounded-lg bg-[#c9a96e] flex items-center justify-center">
          <Plus className="w-4 h-4 text-[#0c0c0e]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#ededef]">Add Expense</h2>
          <p className="text-[10px] text-[#5a5a66]">Track your spending</p>
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
              className="mt-1.5 text-[10px] text-[#c9a96e] font-medium">
              Selected: {selectedCategory.label}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">
          Description
          <AnimatePresence>
            {categorizing && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="ml-2 text-[#c9a96e] normal-case tracking-normal inline-flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AI suggesting...
              </motion.span>
            )}
          </AnimatePresence>
        </label>
        <div className="relative">
          <input type="text" value={formData.description} onChange={handleDescriptionChange}
            className="input-modern pr-10" placeholder="What did you spend on?" />
          <AnimatePresence>
            {categorizing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-[#c9a96e] animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" /> Date
        </label>
        <input type="date" required value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="input-modern" />
      </div>

      <button type="submit" disabled={loading || !formData.category}
        className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-[#0c0c0e] bg-[#c9a96e] hover:bg-[#d4b87e] disabled:bg-[#2a2a32] disabled:text-[#5a5a66] disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Adding...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Expense
          </span>
        )}
      </button>
    </motion.form>
  );
}
