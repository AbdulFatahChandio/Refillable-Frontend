"use client";

import { useMemo } from "react";
import {
  COUNTRIES_CURRENCIES,
  getUniqueCurrencies,
} from "@/src/utils/countries-currencies";
import { useCurrencyStore } from "@/src/store/useCurrencyStore";
import { getCurrencySymbol } from "@/src/utils/formatPrice";

export default function CurrencySelector() {
  const currency = useCurrencyStore((s) => s.currency);
  const setFromCountry = useCurrencyStore((s) => s.setFromCountry);

  const options = useMemo(
    () =>
      getUniqueCurrencies().map(({ currency, country }) => ({
        currency,
        country,
        label: `${currency} (${getCurrencySymbol(currency)})`,
      })),
    [],
  );

  return (
    <label className="inline-flex items-center gap-2 text-[12px] normal-case tracking-normal text-primary">
      <span className="sr-only">Country / Currency</span>
      <select
        aria-label="Select country currency"
        value={currency}
        onChange={(e) => {
          const next = COUNTRIES_CURRENCIES.find(
            (country) => country.currency === e.target.value,
          );
          if (next) setFromCountry(next);
        }}
        className="min-w-[100px] bg-transparent border border-brown text-primary uppercase py-1.5 ps-2 pe-7 text-[11px] md:text-[12px] outline-none cursor-pointer appearance-none bg-[length:10px] bg-[right_8px_center] bg-no-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23020202' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        }}
      >
        {options.map((option) => (
          <option
            key={option.currency}
            value={option.currency}
            className="text-primary bg-secondary"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
