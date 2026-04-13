"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Calculator, AlertTriangle, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useCurrency } from "@/lib/currency";

type BudgetStats = { id: string; category: string; spent: number; budget: number; percentage: number; period: string; };
type BudgetOverviewProps = { onUpdate?: () => void; };

const categoryConfig: { [key: string]: { icon: string; color: string; bgColor: string } } = {
  Food: { icon: "🍔", color: "from-orange-500 to-red-500", bgColor: "bg-orange-500/10" },
  Transport: { icon: "🚗", color: "from-blue-500 to-indigo-500", bgColor: "bg-blue-500/10" },
  Entertainment: { icon: "🎬", color: "from-purple-500 to-pink-500", bgColor: "bg-purple-500/10" },
  Shopping: { icon: "🛍️", color: "from-pink-500 to-rose-500", bgColor: "bg-pink-500/10" },
  Bills: { icon: "💡", color: "from-yellow-500 to-orange-500", bgColor: "bg-yellow-500/10" },
  Health: { icon: "🏥", color: "from-green-500 to-emerald-500", bgColor: "bg-green-500/10" },
  Other: { icon: "📦", color: "from-gray-500 to-slate-500", bgColor: "bg-gray-500/10" },
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

  const fetchBudgetStats = useCallback(async () => {
    if (!user) return;
    try {
      const startOfMonth = new Date(); startOfMonth.setDate(1);
      const startDate = startOfMonth.toISOString().split("T")[0];
      const { data: expenses, error: expensesError } = await supabase.from("expenses").select("category, amount").eq("user_id", user.id).gte("date", startDate);
      if (expensesError) throw expensesError;
      const { data: budgets, error: budgetsError } = await supabase.from("budgets").select("*").eq("user_id", user.id).eq("period", "monthly");
      if (budgetsError) throw budgetsError;

      const spendingByCategory: { [key: string]: number } = {};
      let total = 0;
      expenses?.forEach((expense) => { const amount = parseFloat(expense.amount.toString()); spendingByCategory[expense.category] = (spendingByCategory[expense.category] || 0) + amount; total += amount; });
      setTotalSpent(total);
      const budgetTotal = budgets?.reduce((sum, b) => sum + parseFloat(b.amount.toString()), 0) || 0;
      setTotalBudget(budgetTotal);
      const budgetStats: BudgetStats[] = budgets?.map((budget) => {
        const spent = spendingByCategory[budget.category] || 0;
        const budgetAmount = parseFloat(budget.amount.toString());
        return { id: budget.id, category: budget.category, spent, budget: budgetAmount, percentage: budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0, period: budget.period };
      }) || [];
      setStats(budgetStats);
    } catch (error) { console.error("Error fetching budget stats:", error); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { if (user) fetchBudgetStats(); }, [user, fetchBudgetStats]);

  const startEditing = (stat: BudgetStats) => { setEditingId(stat.id); setEditAmount(stat.budget.toString()); };
  const cancelEditing = () => { setEditingId(null); setEditAmount(""); };

  const saveEdit = async (id: string) => {
    if (!user) return; setSaving(true);
    try {
      const { error } = await supabase.from("budgets").update({ amount: parseFloat(editAmount) }).eq("id", id);
      if (error) throw error;
      setEditingId(null); fetchBudgetStats(); onUpdate?.();
    } catch (error) { console.error("Error updating budget:", error); alert("Failed to update budget"); } finally { setSaving(false); }
  };

  const deleteBudget = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    try {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
      fetchBudgetStats(); onUpdate?.();
    } catch (error) { console.error("Error deleting budget:", error); alert("Failed to delete budget"); }
  };

  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (loading) {
    return (
      <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-6">
        <div className="space-y-3">
          <div className="h-5 bg-[#1e1e24] rounded w-1/3 animate-pulse" />
          <div className="h-20 bg-[#1e1e24] rounded-lg animate-pulse" />
          {[1, 2].map((i) => <div key={i} className="h-12 bg-[#1e1e24] rounded-lg animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }} className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#c9a96e]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#ededef]">Budget Overview</h2>
            <p className="text-[10px] text-[#5a5a66]">This month&apos;s spending</p>
          </div>
        </div>
        <span className="text-[10px] font-medium text-[#5a5a66] bg-[#1e1e24] px-2.5 py-1 rounded-md border border-[#2a2a32]">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
      </div>

      {/* Total Spent Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#c9a96e]/15 to-[#c9a96e]/5 border border-[#c9a96e]/15 p-5 mb-5">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle,rgba(201,169,110,0.1),transparent_70%)] -translate-y-1/4 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-[#c9a96e] text-xs font-medium mb-1">Total Spent This Month</p>
          <motion.p initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }} className="text-3xl font-bold text-[#ededef] mb-3 tracking-tight">
            {formatAmount(totalSpent)}
          </motion.p>
          {totalBudget > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#8b8b96]">
                <span>Budget used</span>
                <span>{overallPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-[#2a2a32] rounded-full h-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  className={`h-1.5 rounded-full ${overallPercentage > 100 ? "bg-[#f87171]" : "bg-[#c9a96e]"}`} />
              </div>
              <p className="text-[10px] text-[#5a5a66]">
                {formatAmount(totalBudget - totalSpent)} remaining of {formatAmount(totalBudget)} budget
              </p>
            </div>
          )}
        </div>
      </div>

      {stats.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#1e1e24] border border-[#2a2a32] flex items-center justify-center">
            <Calculator className="w-6 h-6 text-[#5a5a66]" />
          </div>
          <p className="text-[#8b8b96] text-sm font-medium">No budgets set yet</p>
          <p className="text-xs text-[#5a5a66] mt-1">Create your first budget to start tracking</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {stats.map((stat, index) => {
              const config = categoryConfig[stat.category] || categoryConfig.Other;
              const isEditing = editingId === stat.id;
              return (
                <motion.div key={stat.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`group p-3 rounded-lg transition-all duration-200 ${
                    isEditing ? "bg-[#1e1e24] border border-[#c9a96e]/20" : "bg-[#1e1e24]/50 hover:bg-[#1e1e24] border border-transparent"
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                        <span className="text-sm">{config.icon}</span>
                      </div>
                      <div>
                        <span className="font-medium text-[#ededef] text-sm">{stat.category}</span>
                        <p className="text-[10px] text-[#5a5a66] flex items-center gap-1">
                          {stat.percentage > 100 ? (<><AlertTriangle className="w-2.5 h-2.5 text-[#f87171]" /> Over budget!</>) : `${(100 - stat.percentage).toFixed(0)}% remaining`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#5a5a66] text-xs">{currency.symbol}</span>
                            <input type="number" step="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)}
                              className="w-24 pl-6 pr-2 py-1.5 text-xs bg-[#16161a] border border-[#2a2a32] rounded-lg text-[#ededef] focus:border-[#c9a96e] outline-none" />
                          </div>
                          <button onClick={cancelEditing} className="p-1 rounded text-[#5a5a66] hover:bg-[#2a2a32]"><X className="w-3.5 h-3.5" /></button>
                          <button onClick={() => saveEdit(stat.id)} disabled={saving}
                            className="p-1 rounded text-[#0c0c0e] bg-[#c9a96e] hover:bg-[#d4b87e] disabled:opacity-50">
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="text-right">
                            <p className="font-semibold text-[#ededef] text-sm">{formatAmount(stat.spent)}</p>
                            <p className="text-[10px] text-[#5a5a66]">of {formatAmount(stat.budget)}</p>
                          </div>
                          <button onClick={() => startEditing(stat)}
                            className="sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-lg text-[#5a5a66] hover:text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteBudget(stat.id)}
                            className="sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-lg text-[#5a5a66] hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#2a2a32] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(stat.percentage, 100)}%` }}
                      transition={{ delay: 0.2 + index * 0.05, duration: 0.5, ease: "easeOut" }}
                      className={`h-1.5 rounded-full ${
                        stat.percentage > 100 ? "bg-[#f87171]" : stat.percentage > 80 ? "bg-[#fbbf24]" : "bg-[#34d399]"
                      }`} />
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
