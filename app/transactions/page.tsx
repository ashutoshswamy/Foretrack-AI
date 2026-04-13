"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Calendar,
  Sparkles,
  Activity,
  Loader2,
  TrendingUp,
  TrendingDown,
  Trash2,
  Pencil,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  supabase,
  type Expense,
  type Income,
  type IncomeSource,
} from "@/lib/supabase";
import { useCurrency } from "@/lib/currency";

type Transaction = {
  id: string;
  type: "expense" | "income";
  amount: number;
  currency: string;
  category?: string;
  source?: IncomeSource;
  description?: string | null;
  date: string;
  created_at: string;
};

type FilterType = "all" | "expense" | "income";
type SortType = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

const categoryConfig: {
  [key: string]: { icon: string; color: string; bgColor: string };
} = {
  Food: { icon: "🍔", color: "text-orange-400", bgColor: "bg-orange-500/10" },
  Transport: { icon: "🚗", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  Entertainment: { icon: "🎬", color: "text-purple-400", bgColor: "bg-purple-500/10" },
  Shopping: { icon: "🛍️", color: "text-pink-400", bgColor: "bg-pink-500/10" },
  Bills: { icon: "💡", color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  Health: { icon: "🏥", color: "text-green-400", bgColor: "bg-green-500/10" },
  Other: { icon: "📦", color: "text-gray-400", bgColor: "bg-gray-500/10" },
};

const sourceConfig: {
  [key: string]: { icon: string; color: string; bgColor: string };
} = {
  Salary: { icon: "💼", color: "text-green-400", bgColor: "bg-green-500/10" },
  Freelance: { icon: "💻", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  Business: { icon: "🏢", color: "text-purple-400", bgColor: "bg-purple-500/10" },
  Investments: { icon: "📈", color: "text-amber-400", bgColor: "bg-amber-500/10" },
  Rental: { icon: "🏠", color: "text-teal-400", bgColor: "bg-teal-500/10" },
  Gifts: { icon: "🎁", color: "text-pink-400", bgColor: "bg-pink-500/10" },
  Refunds: { icon: "💸", color: "text-lime-400", bgColor: "bg-lime-500/10" },
  Other: { icon: "📦", color: "text-gray-400", bgColor: "bg-gray-500/10" },
};

const ITEMS_PER_PAGE = 15;

const categories = [
  "Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Other",
];

const incomeSources: IncomeSource[] = [
  "Salary", "Freelance", "Business", "Investments", "Rental", "Gifts", "Refunds", "Other",
];

export default function Transactions() {
  const { user } = useUser();
  const { formatAmount } = useCurrency();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    category: "",
    source: "" as IncomeSource,
    description: "",
    date: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [expensesRes, incomesRes] = await Promise.all([
        supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false }),
        supabase
          .from("incomes")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false }),
      ]);

      if (expensesRes.data) setExpenses(expensesRes.data);
      if (incomesRes.data) setIncomes(incomesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const transactions: Transaction[] = useMemo(() => {
    const expenseTransactions: Transaction[] = expenses.map((e) => ({
      id: e.id, type: "expense" as const, amount: e.amount, currency: e.currency,
      category: e.category, description: e.description, date: e.date, created_at: e.created_at,
    }));
    const incomeTransactions: Transaction[] = incomes.map((i) => ({
      id: i.id, type: "income" as const, amount: i.amount, currency: i.currency,
      source: i.source, description: i.description, date: i.date, created_at: i.created_at,
    }));
    return [...expenseTransactions, ...incomeTransactions];
  }, [expenses, incomes]);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(query) ||
          t.category?.toLowerCase().includes(query) ||
          t.source?.toLowerCase().includes(query),
      );
    }
    if (dateRange.start) {
      filtered = filtered.filter((t) => t.date >= dateRange.start);
    }
    if (dateRange.end) {
      filtered = filtered.filter((t) => t.date <= dateRange.end);
    }
    filtered.sort((a, b) => {
      switch (sortType) {
        case "date-desc": return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc": return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc": return b.amount - a.amount;
        case "amount-asc": return a.amount - b.amount;
        default: return 0;
      }
    });
    return filtered;
  }, [transactions, filterType, searchQuery, sortType, dateRange]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);

  const totals = useMemo(() => {
    const totalIncome = filteredAndSortedTransactions
      .filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredAndSortedTransactions
      .filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalExpense, net: totalIncome - totalExpense };
  }, [filteredAndSortedTransactions]);

  const deleteTransaction = async (transaction: Transaction) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    setDeletingId(transaction.id);
    try {
      const table = transaction.type === "expense" ? "expenses" : "incomes";
      const { error } = await supabase.from(table).delete().eq("id", transaction.id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction");
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      amount: transaction.amount.toString(),
      category: transaction.category || "",
      source: (transaction.source as IncomeSource) || "Other",
      description: transaction.description || "",
      date: transaction.date,
    });
  };

  const cancelEditing = () => {
    setEditingTransaction(null);
    setEditForm({ amount: "", category: "", source: "Other", description: "", date: "" });
  };

  const saveEdit = async () => {
    if (!user || !editingTransaction) return;
    setSaving(true);
    try {
      if (editingTransaction.type === "expense") {
        const { error } = await supabase.from("expenses").update({
          amount: parseFloat(editForm.amount), category: editForm.category,
          description: editForm.description || null, date: editForm.date,
        }).eq("id", editingTransaction.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("incomes").update({
          amount: parseFloat(editForm.amount), source: editForm.source,
          description: editForm.description || null, date: editForm.date,
        }).eq("id", editingTransaction.id);
        if (error) throw error;
      }
      cancelEditing();
      fetchData();
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const getTransactionConfig = (transaction: Transaction) => {
    if (transaction.type === "income") {
      const source = transaction.source || "Other";
      return sourceConfig[source] || sourceConfig.Other;
    }
    const category = transaction.category || "Other";
    return categoryConfig[category] || categoryConfig.Other;
  };

  const resetFilters = () => {
    setSearchQuery(""); setFilterType("all"); setSortType("date-desc");
    setDateRange({ start: "", end: "" }); setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-[#c9a96e] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#0c0c0e]" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#c9a96e]" />
            <span className="text-[#5a5a66] text-sm">Loading transactions...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.04),transparent_70%)]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-[#16161a] border-b border-[#2a2a32]"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-lg bg-[#1e1e24] border border-[#2a2a32] flex items-center justify-center hover:border-[#c9a96e]/30 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#8b8b96]" />
              </Link>
              <div>
                <h1 className="text-sm sm:text-base font-semibold text-[#ededef] tracking-tight">
                  All Transactions
                </h1>
                <p className="text-[10px] text-[#5a5a66] hidden sm:block uppercase tracking-wide">
                  Complete financial history
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e1e24] border border-[#2a2a32]">
                <Activity className="w-3.5 h-3.5 text-[#c9a96e]" />
                <span className="text-xs text-[#5a5a66]">
                  {filteredAndSortedTransactions.length} transactions
                </span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5"
        >
          <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#34d399]/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#34d399]" />
              </div>
              <div>
                <p className="text-[10px] text-[#5a5a66] uppercase tracking-wide">Total Income</p>
                <p className="text-base font-bold text-[#34d399]">
                  {formatAmount(totals.totalIncome)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f87171]/10 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-[#f87171]" />
              </div>
              <div>
                <p className="text-[10px] text-[#5a5a66] uppercase tracking-wide">Total Expenses</p>
                <p className="text-base font-bold text-[#f87171]">
                  {formatAmount(totals.totalExpense)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                totals.net >= 0 ? "bg-[#c9a96e]/10" : "bg-[#f87171]/10"
              }`}>
                {totals.net >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-[#c9a96e]" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-[#f87171]" />
                )}
              </div>
              <div>
                <p className="text-[10px] text-[#5a5a66] uppercase tracking-wide">Net Balance</p>
                <p className={`text-base font-bold ${
                  totals.net >= 0 ? "text-[#c9a96e]" : "text-[#f87171]"
                }`}>
                  {formatAmount(totals.net)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#16161a] border border-[#2a2a32] rounded-xl p-4 mb-5"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a66]" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] placeholder-[#5a5a66] focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]/20 transition-all outline-none text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all ${
                showFilters
                  ? "bg-[#c9a96e]/10 border-[#c9a96e]/30 text-[#c9a96e]"
                  : "border-[#2a2a32] text-[#8b8b96] hover:border-[#c9a96e]/30"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-[#2a2a32] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => { setFilterType(e.target.value as FilterType); setCurrentPage(1); }}
                      className="w-full px-3 py-2 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] text-sm focus:border-[#c9a96e] outline-none"
                    >
                      <option value="all">All Transactions</option>
                      <option value="income">Income Only</option>
                      <option value="expense">Expenses Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Sort By</label>
                    <select
                      value={sortType}
                      onChange={(e) => setSortType(e.target.value as SortType)}
                      className="w-full px-3 py-2 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] text-sm focus:border-[#c9a96e] outline-none"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="amount-desc">Highest Amount</option>
                      <option value="amount-asc">Lowest Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">From</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => { setDateRange((prev) => ({ ...prev, start: e.target.value })); setCurrentPage(1); }}
                      className="w-full px-3 py-2 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] text-sm focus:border-[#c9a96e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">To</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => { setDateRange((prev) => ({ ...prev, end: e.target.value })); setCurrentPage(1); }}
                      className="w-full px-3 py-2 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] text-sm focus:border-[#c9a96e] outline-none"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button onClick={resetFilters} className="text-xs text-[#c9a96e] hover:text-[#d4b87e] font-medium">
                    Reset all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#16161a] border border-[#2a2a32] rounded-xl overflow-hidden"
        >
          {paginatedTransactions.length > 0 ? (
            <>
              <div className="divide-y divide-[#1f1f27]">
                <AnimatePresence mode="popLayout">
                  {paginatedTransactions.map((transaction, index) => {
                    const config = getTransactionConfig(transaction);
                    const isDeleting = deletingId === transaction.id;
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className={`group p-4 hover:bg-[#1e1e24] transition-colors ${isDeleting ? "opacity-40" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${config.bgColor} flex items-center justify-center text-base sm:text-lg shrink-0`}>
                            {config.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`font-medium text-sm ${config.color}`}>
                                {transaction.type === "income" ? transaction.source : transaction.category}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                                transaction.type === "income"
                                  ? "bg-[#34d399]/10 text-[#34d399]"
                                  : "bg-[#f87171]/10 text-[#f87171]"
                              }`}>
                                {transaction.type === "income" ? "Income" : "Expense"}
                              </span>
                            </div>
                            {transaction.description && (
                              <p className="text-xs text-[#5a5a66] truncate">{transaction.description}</p>
                            )}
                            <p className="text-[10px] text-[#5a5a66] mt-0.5 flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`font-semibold text-sm ${
                              transaction.type === "income" ? "text-[#34d399]" : "text-[#f87171]"
                            }`}>
                              {transaction.type === "income" ? "+" : "-"}{formatAmount(transaction.amount)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => startEditing(transaction)}
                              disabled={isDeleting}
                              className="p-1.5 rounded-lg text-[#5a5a66] hover:text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteTransaction(transaction)}
                              disabled={isDeleting}
                              className="p-1.5 rounded-lg text-[#5a5a66] hover:text-[#f87171] hover:bg-[#f87171]/10 transition-colors disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <div className="border-t border-[#2a2a32] p-4 flex items-center justify-between">
                  <p className="text-xs text-[#5a5a66]">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-[#2a2a32] hover:bg-[#1e1e24] text-[#8b8b96] disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-medium text-[#8b8b96] px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-[#2a2a32] hover:bg-[#1e1e24] text-[#8b8b96] disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#1e1e24] border border-[#2a2a32] flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-[#5a5a66]" />
              </div>
              <h3 className="text-sm font-semibold text-[#8b8b96] mb-1">No transactions found</h3>
              <p className="text-xs text-[#5a5a66] mb-4">
                {searchQuery || filterType !== "all" || dateRange.start || dateRange.end
                  ? "Try adjusting your filters" : "Start adding expenses and income"}
              </p>
              {(searchQuery || filterType !== "all" || dateRange.start || dateRange.end) && (
                <button onClick={resetFilters} className="text-xs text-[#c9a96e] hover:text-[#d4b87e] font-medium">
                  Reset all filters
                </button>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={cancelEditing}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#16161a] border border-[#2a2a32] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[#2a2a32] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#ededef]">
                  Edit {editingTransaction.type === "income" ? "Income" : "Expense"}
                </h3>
                <button onClick={cancelEditing} className="p-1.5 rounded-lg hover:bg-[#1e1e24] text-[#5a5a66]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Amount</label>
                  <input type="number" step="0.01" value={editForm.amount}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] text-sm focus:border-[#c9a96e] outline-none" placeholder="0.00"
                  />
                </div>
                {editingTransaction.type === "expense" ? (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Category</label>
                    <select value={editForm.category}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] text-sm focus:border-[#c9a96e] outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{categoryConfig[cat]?.icon} {cat}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Source</label>
                    <select value={editForm.source}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, source: e.target.value as IncomeSource }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] text-sm focus:border-[#c9a96e] outline-none"
                    >
                      {incomeSources.map((src) => (
                        <option key={src} value={src}>{sourceConfig[src]?.icon} {src}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Description</label>
                  <input type="text" value={editForm.description}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] text-sm focus:border-[#c9a96e] outline-none" placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5a5a66] uppercase tracking-wide mb-1.5">Date</label>
                  <input type="date" value={editForm.date}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] text-sm focus:border-[#c9a96e] outline-none"
                  />
                </div>
              </div>
              <div className="px-5 py-4 border-t border-[#2a2a32] flex items-center justify-end gap-3">
                <button onClick={cancelEditing} disabled={saving}
                  className="px-4 py-2 rounded-lg border border-[#2a2a32] text-[#8b8b96] hover:bg-[#1e1e24] text-sm transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={saveEdit} disabled={saving || !editForm.amount || !editForm.date}
                  className="px-4 py-2 rounded-lg bg-[#c9a96e] text-[#0c0c0e] font-medium text-sm hover:bg-[#d4b87e] transition-all disabled:opacity-50 flex items-center gap-2">
                  {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</> : <><Check className="w-3.5 h-3.5" />Save</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
