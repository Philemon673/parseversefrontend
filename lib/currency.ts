/**
 * currency.ts
 * Single source of truth for currency formatting across the entire frontend.
 * The currency symbol is set via the NEXT_PUBLIC_CURRENCY environment variable.
 *
 * Usage:
 *   import { CURRENCY_SYMBOL, formatCurrency } from "@/lib/currency";
 *
 *   formatCurrency(4500)   → "FCFA 4,500"
 *   formatCurrency(-1200)  → "-FCFA 1,200"
 *   CURRENCY_SYMBOL        → "FCFA"
 */

export const CURRENCY_SYMBOL: string =
  process.env.NEXT_PUBLIC_CURRENCY || "FCFA";

/**
 * Formats a numeric amount as a currency string using the app's currency symbol.
 * Preserves sign for negative values (used in payouts/deductions).
 *
 * @param amount  - The numeric amount (can be negative)
 * @param decimals - Number of decimal places (default 0 for FCFA-style currencies)
 */
export function formatCurrency(
  amount: number,
  decimals: number = 0,
): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const sign = amount < 0 ? "-" : "";
  return `${sign}${CURRENCY_SYMBOL} ${formatted}`;
}

/**
 * Same as formatCurrency but prefixes a "+" for positive values.
 * Useful for transaction lists where direction matters.
 */
export function formatCurrencySigned(amount: number, decimals: number = 0): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const sign = amount < 0 ? "-" : "+";
  return `${sign}${CURRENCY_SYMBOL} ${formatted}`;
}
