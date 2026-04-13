"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ChevronDown, Check, Coins } from "lucide-react";
import { useCurrency, currencies, type Currency } from "@/lib/currency";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e1e24] border border-[#2a2a32] hover:border-[#c9a96e]/30 transition-colors"
      >
        <Coins className="w-4 h-4 text-[#c9a96e]" />
        <span className="font-medium text-[#ededef] text-sm">{currency.code}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#5a5a66] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-[#16161a] rounded-xl shadow-2xl shadow-black/50 border border-[#2a2a32] overflow-hidden z-50"
            >
              <div className="p-3 border-b border-[#2a2a32] bg-[#1e1e24]">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#5a5a66]" />
                  <span className="text-sm font-medium text-[#ededef]">Select Currency</span>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleSelect(curr)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      currency.code === curr.code
                        ? "bg-[#c9a96e]/10 text-[#c9a96e]"
                        : "text-[#ededef] hover:bg-[#1e1e24]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#2a2a32] flex items-center justify-center font-semibold text-sm text-[#ededef]">
                        {curr.symbol}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{curr.code}</p>
                        <p className="text-xs text-[#5a5a66]">{curr.name}</p>
                      </div>
                    </div>
                    {currency.code === curr.code && (
                      <Check className="w-4 h-4 text-[#c9a96e]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
