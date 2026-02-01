"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
];

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
  loading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [currency, setCurrencyState] = useState<Currency>(currencies[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      loadUserCurrency();
    } else if (isLoaded && !user) {
      // Load from localStorage for non-authenticated users
      const saved = localStorage.getItem("foretrack_currency");
      if (saved) {
        const found = currencies.find((c) => c.code === saved);
        if (found) setCurrencyState(found);
      }
      setLoading(false);
    }
  }, [user, isLoaded]);

  const loadUserCurrency = async () => {
    if (!user) return;

    try {
      // First try to get from localStorage as fallback
      const saved = localStorage.getItem("foretrack_currency");
      if (saved) {
        const found = currencies.find((c) => c.code === saved);
        if (found) setCurrencyState(found);
      }

      const { data, error } = await supabase
        .from("user_settings")
        .select("currency")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading currency from DB:", error);
        // Continue with localStorage value or default
      } else if (data?.currency) {
        const found = currencies.find((c) => c.code === data.currency);
        if (found) {
          setCurrencyState(found);
          localStorage.setItem("foretrack_currency", found.code);
        }
      }
    } catch (error) {
      console.error("Error loading currency:", error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrency = async (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("foretrack_currency", newCurrency.code);

    if (user) {
      try {
        const { error } = await supabase.from("user_settings").upsert(
          {
            user_id: user.id,
            currency: newCurrency.code,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );

        if (error) console.error("Error saving currency:", error);
      } catch (error) {
        console.error("Error saving currency:", error);
      }
    }
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatAmount, loading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
