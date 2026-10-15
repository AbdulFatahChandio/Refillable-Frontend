export function formatPrice(
  n?: number | null,
  currency = "AED",
  options?: Intl.NumberFormatOptions,
) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";

  try {
    const symbol = getCurrencySymbol(currency);
    const amount = new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
      ...options,
      // amount only — currency comes from symbol
      style: "decimal",
    }).format(n);

    return `${symbol} ${amount}`;
  } catch {
    return `${getCurrencySymbol(currency)}${n.toFixed(2)}`;
  }
}

export function getCurrencySymbol(currency: string) {
  try {
    const part = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((p) => p.type === "currency");

    return part?.value || currency;
  } catch {
    return currency;
  }
}
