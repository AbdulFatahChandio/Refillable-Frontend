"use client";

import { useCurrencyStore } from "@/src/store/useCurrencyStore";
import { formatPrice } from "@/src/utils/formatPrice";

export function useFormatPrice() {
  const currency = useCurrencyStore((s) => s.currency);

  return (
    n?: number | null,
    options?: Intl.NumberFormatOptions,
  ) => formatPrice(n, currency, options);
}

export function useCurrencyCode() {
  return useCurrencyStore((s) => s.currency);
}
