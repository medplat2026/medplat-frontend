/** Full naira display with grouping (e.g. ₦500,000). */
export function formatFullNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

/** Naira with space before amount (e.g. ₦ 40,000) for chart labels. */
export function formatNairaSpaced(amount: number): string {
  return `₦ ${amount.toLocaleString("en-NG")}`;
}

/** Compact display for large naira amounts (e.g. ₦ 12.0M). */
export function formatCompactNaira(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
    return `₦ ${formatted}M`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    const formatted = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1);
    return `₦ ${formatted}K`;
  }
  return `₦ ${amount.toLocaleString("en-NG")}`;
}
