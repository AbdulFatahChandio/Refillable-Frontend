"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import {
  COUNTRY_COOKIE,
  CURRENCY_COOKIE,
  DEFAULT_COUNTRY,
  findCountryByCode,
  type CountryCurrency,
} from "@/src/utils/countries-currencies";

type CurrencyState = {
  currency: string;
  countryCode: string;
  countryName: string;
  hasPreference: boolean;
  /** False until CurrencyInit finishes (IP detect / cookie / preference). */
  isCurrencyReady: boolean;
  setFromCountry: (country: CountryCurrency, options?: { isDetection?: boolean }) => void;
};

let resolveCurrencyReady: (() => void) | null = null;
let currencyReadyPromise: Promise<void> | null = null;

/** Axios / queries wait here so the first request never sends default AED. */
export function whenCurrencyReady(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (useCurrencyStore.getState().isCurrencyReady) return Promise.resolve();
  if (!currencyReadyPromise) {
    currencyReadyPromise = new Promise((resolve) => {
      resolveCurrencyReady = resolve;
    });
  }
  return currencyReadyPromise;
}

export function markCurrencyReady() {
  if (useCurrencyStore.getState().isCurrencyReady) return;
  useCurrencyStore.setState({ isCurrencyReady: true });
  resolveCurrencyReady?.();
  resolveCurrencyReady = null;
  currencyReadyPromise = null;
}

const cookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  expires: 365,
};

export function syncCurrencyCookies(country: CountryCurrency) {
  Cookies.set(CURRENCY_COOKIE, country.currency, cookieOptions);
  Cookies.set(COUNTRY_COOKIE, country.countryCode, cookieOptions);
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: DEFAULT_COUNTRY.currency,
      countryCode: DEFAULT_COUNTRY.countryCode,
      countryName: DEFAULT_COUNTRY.countryName,
      hasPreference: false,
      isCurrencyReady: false,

      setFromCountry: (country, options) => {
        const prevCurrency = get().currency;
        const isDetection = Boolean(options?.isDetection);
        syncCurrencyCookies(country);
        set({
          currency: country.currency,
          countryCode: country.countryCode,
          countryName: country.countryName,
          // Only manual picks should stick forever; IP detection must stay overridable
          hasPreference: isDetection ? false : true,
        });

        if (typeof window !== "undefined" && prevCurrency !== country.currency) {
          window.dispatchEvent(
            new CustomEvent("currencyChange", {
              detail: {
                currency: country.currency,
                previousCurrency: prevCurrency,
                isDetection,
              },
            }),
          );
        }
      },
    }),
    {
      name: "currency-storage",
      version: 1,
      // Reset wrongly persisted "preference" from earlier detection bug so IP can run again
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<{
          currency: string;
          countryCode: string;
          countryName: string;
          hasPreference: boolean;
        }>;
        return {
          currency: state.currency ?? DEFAULT_COUNTRY.currency,
          countryCode: state.countryCode ?? DEFAULT_COUNTRY.countryCode,
          countryName: state.countryName ?? DEFAULT_COUNTRY.countryName,
          hasPreference: false,
        };
      },
      partialize: (state) => ({
        currency: state.currency,
        countryCode: state.countryCode,
        countryName: state.countryName,
        hasPreference: state.hasPreference,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Don't write default AED cookies before IP detection finishes
        if (!state.hasPreference && state.countryCode === DEFAULT_COUNTRY.countryCode) {
          return;
        }
        const country =
          findCountryByCode(state.countryCode) ?? DEFAULT_COUNTRY;
        syncCurrencyCookies(country);
      },
    },
  ),
);

export function getStoredCurrency(): string {
  if (typeof window === "undefined") return DEFAULT_COUNTRY.currency;
  return (
    Cookies.get(CURRENCY_COOKIE) ||
    useCurrencyStore.getState().currency ||
    DEFAULT_COUNTRY.currency
  );
}
