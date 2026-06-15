// Re-exports from the shared currency utility.
// All components that import from here continue to work without changes.
export { CURRENCY_SYMBOL, formatCurrency, formatCurrencySigned } from "@/lib/currency";

export default function DummyFormatterPage() {
  return null;
}