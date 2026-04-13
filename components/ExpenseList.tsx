"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Trash2, Package, Pencil, X, Check, Loader2 } from "lucide-react";
import { supabase, type Expense } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useCurrency } from "@/lib/currency";

type ExpenseListProps = { refreshTrigger?: number; onUpdate?: () => void; };

const categoryConfig: { [key: string]: { icon: string; color: string; bgColor: string } } = {
  Food: { icon: "🍔", color: "text-orange-400", bgColor: "bg-orange-500/10" },
  Transport: { icon: "🚗", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  Entertainment: { icon: "🎬", color: "text-purple-400", bgColor: "bg-purple-500/10" },
  Shopping: { icon: "🛍️", color: "text-pink-400", bgColor: "bg-pink-500/10" },
  Bills: { icon: "💡", color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  Health: { icon: "🏥", color: "text-green-400", bgColor: "bg-green-500/10" },
  Other: { icon: "📦", color: "text-gray-400", bgColor: "bg-gray-500/10" },
};

const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Other"];

export default function ExpenseList({ refreshTrigger, onUpdate }: ExpenseListProps) {
  const { user } = useUser();
  const { formatAmount, currency } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ amount: "", category: "", description: "", date: "" });
  const [saving, setSaving] = useState(false);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("expenses").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(10);
      if (error) throw error;
      setExpenses(data || []);
    } catch (error) { console.error("Error fetching expenses:", error); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { if (user) fetchExpenses(); }, [user, refreshTrigger, fetchExpenses]);

  const deleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      fetchExpenses(); onUpdate?.();
    } catch (error) { console.error("Error deleting expense:", error); alert("Failed to delete expense"); }
  };

  const startEditing = (expense: Expense) => {
    setEditingId(expense.id);
    setEditForm({ amount: expense.amount.toString(), category: expense.category, description: expense.description || "", date: expense.date });
  };
  const cancelEditing = () => { setEditingId(null); setEditForm({ amount: "", category: "", description: "", date: "" }); };

  const saveEdit = async (id: string) => {
    if (!user) return; setSaving(true);
    try {
      const { error } = await supabase.from("expenses").update({
        amount: parseFloat(editForm.amount), category: editForm.category, description: editForm.description, date: editForm.date,
      }).eq("id", id);
      if (error) throw error;
      setEditingId(null); fetchExpenses(); onUpdate?.();
    } catch (error) { console.error("Error updating expense:", error); alert("Failed to update expense"); } finally { setSaving(false); }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-5">
        <div className="space-y-3">
          <div className="h-5 bg-[#1e1e24] rounded w-1/3 animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#1e1e24] rounded-lg animate-pulse">
              <div className="w-10 h-10 bg-[#2a2a32] rounded-lg" />
              <div className="flex-1 space-y-1.5"><div className="h-3 bg-[#2a2a32] rounded w-1/2" /><div className="h-2 bg-[#2a2a32] rounded w-1/4" /></div>
              <div className="h-4 bg-[#2a2a32] rounded w-14" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }} className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#ededef]">Recent Expenses</h2>
            <p className="text-[10px] text-[#5a5a66]">Your latest transactions</p>
          </div>
        </div>
        <span className="text-[10px] font-medium text-[#c9a96e] bg-[#c9a96e]/10 px-2.5 py-1 rounded-md">
          {expenses.length} items
        </span>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-[#1e1e24] border border-[#2a2a32] flex items-center justify-center">
            <Package className="w-7 h-7 text-[#5a5a66]" />
          </div>
          <p className="text-[#8b8b96] text-sm font-medium">No expenses yet</p>
          <p className="text-xs text-[#5a5a66] mt-1">Add your first expense to start tracking</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {expenses.map((expense, index) => {
              const config = categoryConfig[expense.category] || categoryConfig.Other;
              const isEditing = editingId === expense.id;
              return (
                <motion.div key={expense.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`group p-3 rounded-lg transition-all duration-200 ${
                    isEditing ? "bg-[#1e1e24] border border-[#c9a96e]/20" : "bg-[#1e1e24]/50 hover:bg-[#1e1e24] border border-transparent"
                  }`}>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#5a5a66] mb-1">Amount</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#5a5a66] text-xs">{currency.symbol}</span>
                            <input type="number" step="0.01" value={editForm.amount}
                              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                              className="w-full pl-6 pr-2 py-1.5 text-xs bg-[#16161a] border border-[#2a2a32] rounded-lg text-[#ededef] focus:border-[#c9a96e] outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#5a5a66] mb-1">Date</label>
                          <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className="w-full px-2 py-1.5 text-xs bg-[#16161a] border border-[#2a2a32] rounded-lg text-[#ededef] focus:border-[#c9a96e] outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#5a5a66] mb-1">Category</label>
                        <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full px-2 py-1.5 text-xs bg-[#16161a] border border-[#2a2a32] rounded-lg text-[#ededef] focus:border-[#c9a96e] outline-none">
                          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#5a5a66] mb-1">Description</label>
                        <input type="text" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full px-2 py-1.5 text-xs bg-[#16161a] border border-[#2a2a32] rounded-lg text-[#ededef] focus:border-[#c9a96e] outline-none" placeholder="Description" />
                      </div>
                      <div className="flex justify-end gap-1.5">
                        <button onClick={cancelEditing} className="p-1.5 rounded text-[#5a5a66] hover:bg-[#2a2a32]"><X className="w-3.5 h-3.5" /></button>
                        <button onClick={() => saveEdit(expense.id)} disabled={saving}
                          className="p-1.5 rounded text-[#0c0c0e] bg-[#c9a96e] hover:bg-[#d4b87e] disabled:opacity-50 flex items-center gap-1">
                          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                        <span className="text-base">{config.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#ededef] text-sm truncate">{expense.description || expense.category}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-medium ${config.color} bg-[#1e1e24] px-1.5 py-0.5 rounded`}>{expense.category}</span>
                          <span className="text-[10px] text-[#5a5a66]">{formatDate(expense.date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-[#f87171]">-{formatAmount(parseFloat(expense.amount.toString()))}</span>
                        <button onClick={() => startEditing(expense)}
                          className="p-1.5 rounded-lg text-[#5a5a66] hover:text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-all sm:opacity-0 sm:group-hover:opacity-100">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteExpense(expense.id)}
                          className="p-1.5 rounded-lg text-[#5a5a66] hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all sm:opacity-0 sm:group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
