"use client";

import { useEffect, useState, useMemo } from "react";
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

const sourceConfig: {
  [key: string]: { icon: string; color: string; bgColor: string };
} = {
  Salary: {
    icon: "💼",
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
  },
  Freelance: {
    icon: "💻",
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-100 to-indigo-100",
  },
  Business: {
    icon: "🏢",
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-100 to-violet-100",
  },
  Investments: {
    icon: "📈",
    color: "text-amber-600",
    bgColor: "bg-gradient-to-br from-amber-100 to-orange-100",
  },
  Rental: {
    icon: "🏠",
    color: "text-teal-600",
    bgColor: "bg-gradient-to-br from-teal-100 to-cyan-100",
  },
  Gifts: {
    icon: "🎁",
    color: "text-pink-600",
    bgColor: "bg-gradient-to-br from-pink-100 to-rose-100",
  },
  Refunds: {
    icon: "💸",
    color: "text-lime-600",
    bgColor: "bg-gradient-to-br from-lime-100 to-green-100",
  },
  Other: {
    icon: "📦",
    color: "text-gray-600",
    bgColor: "bg-gradient-to-br from-gray-100 to-slate-100",
  },
};

const ITEMS_PER_PAGE = 15;

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Health",
  "Other",
];

const incomeSources: IncomeSource[] = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Rental",
  "Gifts",
  "Refunds",
  "Other",
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

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
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
  };

  const transactions: Transaction[] = useMemo(() => {
    const expenseTransactions: Transaction[] = expenses.map((e) => ({
      id: e.id,
      type: "expense" as const,
      amount: e.amount,
      currency: e.currency,
      category: e.category,
      description: e.description,
      date: e.date,
      created_at: e.created_at,
    }));

    const incomeTransactions: Transaction[] = incomes.map((i) => ({
      id: i.id,
      type: "income" as const,
      amount: i.amount,
      currency: i.currency,
      source: i.source,
      description: i.description,
      date: i.date,
      created_at: i.created_at,
    }));

    return [...expenseTransactions, ...incomeTransactions];
  }, [expenses, incomes]);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(query) ||
          t.category?.toLowerCase().includes(query) ||
          t.source?.toLowerCase().includes(query),
      );
    }

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter((t) => t.date >= dateRange.start);
    }
    if (dateRange.end) {
      filtered = filtered.filter((t) => t.date <= dateRange.end);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortType) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, filterType, searchQuery, sortType, dateRange]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE,
  );

  const totals = useMemo(() => {
    const totalIncome = filteredAndSortedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredAndSortedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalExpense, net: totalIncome - totalExpense };
  }, [filteredAndSortedTransactions]);

  const deleteTransaction = async (transaction: Transaction) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setDeletingId(transaction.id);
    try {
      const table = transaction.type === "expense" ? "expenses" : "incomes";
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", transaction.id);

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
    setEditForm({
      amount: "",
      category: "",
      source: "Other",
      description: "",
      date: "",
    });
  };

  const saveEdit = async () => {
    if (!user || !editingTransaction) return;
    setSaving(true);

    try {
      if (editingTransaction.type === "expense") {
        const { error } = await supabase
          .from("expenses")
          .update({
            amount: parseFloat(editForm.amount),
            category: editForm.category,
            description: editForm.description || null,
            date: editForm.date,
          })
          .eq("id", editingTransaction.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("incomes")
          .update({
            amount: parseFloat(editForm.amount),
            source: editForm.source,
            description: editForm.description || null,
            date: editForm.date,
          })
          .eq("id", editingTransaction.id);

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
      year: "numeric",
      month: "short",
      day: "numeric",
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
    setSearchQuery("");
    setFilterType("all");
    setSortType("date-desc");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            <span className="text-gray-600">Loading transactions...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 glass-card border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center hover:bg-white/70 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-base sm:text-xl font-bold gradient-text">
                  All Transactions
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                  View your complete financial history
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-sm text-gray-600 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  {filteredAndSortedTransactions.length} transactions
                </span>
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-xl ring-2 ring-indigo-500/20",
                  },
                }}
              />
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
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Income</p>
                <p className="text-lg font-bold text-green-600">
                  {formatAmount(totals.totalIncome)}
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Expenses</p>
                <p className="text-lg font-bold text-red-600">
                  {formatAmount(totals.totalExpense)}
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  totals.net >= 0
                    ? "bg-gradient-to-br from-indigo-400 to-purple-500"
                    : "bg-gradient-to-br from-orange-400 to-red-500"
                }`}
              >
                {totals.net >= 0 ? (
                  <ArrowUpRight className="w-5 h-5 text-white" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500">Net Balance</p>
                <p
                  className={`text-lg font-bold ${
                    totals.net >= 0 ? "text-indigo-600" : "text-orange-600"
                  }`}
                >
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
          className="glass-card rounded-2xl p-4 sm:p-5 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                showFilters
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Transaction Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value as FilterType);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50"
                    >
                      <option value="all">All Transactions</option>
                      <option value="income">Income Only</option>
                      <option value="expense">Expenses Only</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortType}
                      onChange={(e) => setSortType(e.target.value as SortType)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="amount-desc">Highest Amount</option>
                      <option value="amount-asc">Lowest Amount</option>
                    </select>
                  </div>

                  {/* Date Range Start */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => {
                        setDateRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }));
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50"
                    />
                  </div>

                  {/* Date Range End */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => {
                        setDateRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }));
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white/50"
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
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
          className="glass-card rounded-2xl overflow-hidden"
        >
          {paginatedTransactions.length > 0 ? (
            <>
              <div className="divide-y divide-gray-100">
                <AnimatePresence mode="popLayout">
                  {paginatedTransactions.map((transaction, index) => {
                    const config = getTransactionConfig(transaction);
                    const isDeleting = deletingId === transaction.id;

                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className={`p-4 sm:p-5 hover:bg-white/50 transition-colors ${
                          isDeleting ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Icon */}
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${config.bgColor} flex items-center justify-center text-lg sm:text-xl shrink-0`}
                          >
                            {config.icon}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-medium ${config.color}`}>
                                {transaction.type === "income"
                                  ? transaction.source
                                  : transaction.category}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  transaction.type === "income"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {transaction.type === "income"
                                  ? "Income"
                                  : "Expense"}
                              </span>
                            </div>
                            {transaction.description && (
                              <p className="text-sm text-gray-500 truncate">
                                {transaction.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(transaction.date)}
                            </p>
                          </div>

                          {/* Amount */}
                          <div className="text-right shrink-0">
                            <p
                              className={`font-semibold text-sm sm:text-base ${
                                transaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {formatAmount(transaction.amount)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => startEditing(transaction)}
                              disabled={isDeleting}
                              className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-500 transition-colors disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTransaction(transaction)}
                              disabled={isDeleting}
                              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-100 p-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredAndSortedTransactions.length,
                    )}{" "}
                    of {filteredAndSortedTransactions.length} transactions
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium px-3">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No transactions found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery ||
                filterType !== "all" ||
                dateRange.start ||
                dateRange.end
                  ? "Try adjusting your filters to see more results"
                  : "Start adding expenses and income to see them here"}
              </p>
              {(searchQuery ||
                filterType !== "all" ||
                dateRange.start ||
                dateRange.end) && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={cancelEditing}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit{" "}
                  {editingTransaction.type === "income" ? "Income" : "Expense"}
                </h3>
                <button
                  onClick={cancelEditing}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>

                {/* Category or Source */}
                {editingTransaction.type === "expense" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {categoryConfig[cat]?.icon} {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source
                    </label>
                    <select
                      value={editForm.source}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          source: e.target.value as IncomeSource,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    >
                      {incomeSources.map((src) => (
                        <option key={src} value={src}>
                          {sourceConfig[src]?.icon} {src}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="Optional description"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={cancelEditing}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving || !editForm.amount || !editForm.date}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
