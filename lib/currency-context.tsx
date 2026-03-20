"use client"

import { createContext, useContext, type ReactNode } from "react"
import { formatCurrency, getCurrencySymbol, type CurrencyCode } from "./currency"

interface CurrencyContextValue {
  currency: CurrencyCode
  format: (amount: number | null | undefined) => string
  symbol: string
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  format: (amount) => formatCurrency(amount, "USD"),
  symbol: "$",
})

interface CurrencyProviderProps {
  children: ReactNode
  currency?: CurrencyCode | string | null
}

export function CurrencyProvider({ children, currency = "USD" }: CurrencyProviderProps) {
  const currencyCode = (currency as CurrencyCode) || "USD"
  
  const value: CurrencyContextValue = {
    currency: currencyCode,
    format: (amount) => formatCurrency(amount, currencyCode),
    symbol: getCurrencySymbol(currencyCode),
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
