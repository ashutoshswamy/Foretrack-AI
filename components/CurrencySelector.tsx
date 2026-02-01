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
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 hover:border-indigo-300 transition-colors"
      >
        <Coins className="w-4 h-4 text-indigo-600" />
        <span className="font-medium text-gray-700">{currency.code}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            >
              <div className="p-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Select Currency
                  </span>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => handleSelect(curr)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      currency.code === curr.code
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-indigo-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-semibold text-sm text-gray-700">
                        {curr.symbol}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{curr.code}</p>
                        <p className="text-xs text-gray-500">{curr.name}</p>
                      </div>
                    </div>
                    {currency.code === curr.code && (
                      <Check className="w-4 h-4 text-indigo-600" />
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
