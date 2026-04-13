"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChat() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your AI financial assistant. Ask me anything about your spending, budgets, or for money-saving tips!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const getFinancialContext = useCallback(async () => {
    if (!user) return { expenses: [], budgets: [], totalSpent: 0 };
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const startDate = startOfMonth.toISOString().split("T")[0];
      const { data: expensesData } = await supabase.from("expenses").select("category, amount, description, date").eq("user_id", user.id).gte("date", startDate);
      const { data: budgetsData } = await supabase.from("budgets").select("*").eq("user_id", user.id).eq("period", "monthly");
      const spendingByCategory: { [key: string]: number } = {};
      let totalSpent = 0;
      const expenses = expensesData?.map((e) => {
        const amount = parseFloat(e.amount.toString());
        spendingByCategory[e.category] = (spendingByCategory[e.category] || 0) + amount;
        totalSpent += amount;
        return { category: e.category, amount, description: e.description, date: e.date };
      }) || [];
      const budgets = budgetsData?.map((b) => {
        const budgetAmount = parseFloat(b.amount.toString());
        const spent = spendingByCategory[b.category] || 0;
        return { category: b.category, amount: budgetAmount, spent, percentage: budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0 };
      }) || [];
      return { expenses, budgets, totalSpent };
    } catch { return { expenses: [], budgets: [], totalSpent: 0 }; }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    try {
      const context = await getFinancialContext();
      const response = await fetch("/api/ai/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, context }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I had trouble processing that. Please try again!" }]);
    } finally { setLoading(false); }
  };

  const suggestedQuestions = ["How am I doing this month?", "Where can I save money?", "Am I over budget?"];

  return (
    <>
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 rounded-xl bg-[#c9a96e] text-[#0c0c0e] shadow-lg shadow-[#c9a96e]/20 hover:shadow-xl hover:shadow-[#c9a96e]/25 transition-all duration-300 z-50 flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-[4.5rem] sm:bottom-24 right-0 sm:right-6 w-full sm:w-96 h-[calc(100vh-5rem)] sm:h-[480px] bg-[#16161a] sm:rounded-xl border border-[#2a2a32] shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-[#1e1e24] border-b border-[#2a2a32]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#c9a96e] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#0c0c0e]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#ededef] text-sm flex items-center gap-1.5">
                    Foretrack AI <Sparkles className="w-3 h-3 text-[#c9a96e]" />
                  </h3>
                  <p className="text-[10px] text-[#5a5a66]">Your financial assistant</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl ${
                      message.role === "user"
                        ? "bg-[#c9a96e] text-[#0c0c0e] rounded-br-sm"
                        : "bg-[#1e1e24] text-[#ededef] rounded-bl-sm border border-[#2a2a32]"
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1e1e24] p-3 rounded-xl rounded-bl-sm border border-[#2a2a32]">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="w-1.5 h-1.5 bg-[#5a5a66] rounded-full"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <AnimatePresence>
              {messages.length <= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 pb-2">
                  <p className="text-[10px] text-[#5a5a66] mb-1.5">Try asking:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedQuestions.map((q, i) => (
                      <button key={i} onClick={() => setInput(q)}
                        className="text-[10px] px-2.5 py-1 rounded-md bg-[#c9a96e]/10 text-[#c9a96e] hover:bg-[#c9a96e]/15 border border-[#c9a96e]/15 transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="p-3 border-t border-[#2a2a32]">
              <div className="flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your finances..."
                  className="flex-1 px-3 py-2.5 rounded-lg bg-[#1e1e24] border border-[#2a2a32] text-[#ededef] placeholder-[#5a5a66] focus:border-[#c9a96e] focus:ring-1 focus:ring-[#c9a96e]/20 outline-none text-sm"
                  disabled={loading} />
                <button type="submit" disabled={loading || !input.trim()}
                  className="px-3.5 py-2.5 rounded-lg bg-[#c9a96e] text-[#0c0c0e] font-medium hover:bg-[#d4b87e] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
