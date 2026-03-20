// Currency configuration and formatting utilities

export type CurrencyCode = 'USD' | 'ILS' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'MXN' | 'BRL' | 'ARS' | 'CLP'

export interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  name: string
  locale: string
  position: 'before' | 'after'
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', position: 'before' },
  ILS: { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', locale: 'he-IL', position: 'before' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', position: 'before' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', position: 'before' },
  CAD: { code: 'CAD', symbol: '$', name: 'Canadian Dollar', locale: 'en-CA', position: 'before' },
  AUD: { code: 'AUD', symbol: '$', name: 'Australian Dollar', locale: 'en-AU', position: 'before' },
  MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso', locale: 'es-MX', position: 'before' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', position: 'before' },
  ARS: { code: 'ARS', symbol: '$', name: 'Argentine Peso', locale: 'es-AR', position: 'before' },
  CLP: { code: 'CLP', symbol: '$', name: 'Chilean Peso', locale: 'es-CL', position: 'before' },
}

export const CURRENCY_OPTIONS = Object.values(CURRENCIES).map(c => ({
  value: c.code,
  label: `${c.symbol} ${c.name} (${c.code})`,
}))

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number | null | undefined,
  currencyCode: CurrencyCode = 'USD'
): string {
  if (amount === null || amount === undefined) return '-'
  
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD
  
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    // Fallback formatting
    const formatted = amount.toFixed(2)
    return currency.position === 'before' 
      ? `${currency.symbol}${formatted}` 
      : `${formatted}${currency.symbol}`
  }
}

/**
 * Get currency symbol only
 */
export function getCurrencySymbol(currencyCode: CurrencyCode = 'USD'): string {
  return CURRENCIES[currencyCode]?.symbol || '$'
}

/**
 * Parse a currency string to number
 */
export function parseCurrencyInput(value: string): number {
  // Remove currency symbols and formatting
  const cleaned = value.replace(/[^0-9.-]/g, '')
  return parseFloat(cleaned) || 0
}
