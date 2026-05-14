const CURRENCY_SYMBOL = process.env.NEXT_PUBLIC_CURRENCY || "FCFA";

export function formatCurrency(amount) {
  return `${CURRENCY_SYMBOL}${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export { CURRENCY_SYMBOL };