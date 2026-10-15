"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  COUNTRY_COOKIE,
  DEFAULT_COUNTRY,
  findCountryByCode,
  type CountryCurrency,
} from "@/src/utils/countries-currencies";
import {
  markCurrencyReady,
  syncCurrencyCookies,
  useCurrencyStore,
} from "@/src/store/useCurrencyStore";
import { refreshCartPricesForCurrency } from "@/src/utils/refreshCartPrices";

async function fetchWithTimeout(url: string, ms = 3500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function resolveCountry(
  countryCode?: string | null,
  currency?: string | null,
  countryName?: string | null,
): CountryCurrency | null {
  const byCode = findCountryByCode(countryCode);
  if (byCode) return byCode;
  if (countryCode && currency) {
    return {
      countryCode: countryCode.toUpperCase(),
      countryName: countryName || countryCode.toUpperCase(),
      currency: currency.toUpperCase(),
    };
  }
  return null;
}

async function detectViaIpapi(): Promise<CountryCurrency | null> {
  const res = await fetchWithTimeout("https://ipapi.co/json/");
  if (!res.ok) return null;
  const data = (await res.json()) as {
    country_code?: string;
    currency?: string;
    country_name?: string;
    error?: boolean;
  };
  if (data.error) return null;
  return resolveCountry(data.country_code, data.currency, data.country_name);
}

async function detectViaIpwho(): Promise<CountryCurrency | null> {
  const res = await fetchWithTimeout("https://ipwho.is/");
  if (!res.ok) return null;
  const data = (await res.json()) as {
    success?: boolean;
    country_code?: string;
    country?: string;
    currency?: { code?: string };
  };
  if (data.success === false) return null;
  return resolveCountry(data.country_code, data.currency?.code, data.country);
}

/** Race free geo APIs so the first successful result wins. */
async function detectCountryFromIp(): Promise<CountryCurrency | null> {
  const tasks = [detectViaIpapi(), detectViaIpwho()].map((p) =>
    p.then((country) => {
      if (!country) throw new Error("empty");
      return country;
    }),
  );

  try {
    return await Promise.any(tasks);
  } catch {
    return null;
  }
}

/** Detect visitor country on first visit and keep React Query in sync with currency. */
export default function CurrencyInit() {
  const queryClient = useQueryClient();
  const setFromCountry = useCurrencyStore((s) => s.setFromCountry);
  const detecting = useRef(false);

  useEffect(() => {
    const onCurrencyChange = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          currency: string;
          previousCurrency?: string;
          isDetection?: boolean;
        }>
      ).detail;

      // First-load detection: axios already waited for the correct cookie —
      // don't refetch. Manual switches only refresh price-dependent data.
      if (!detail?.isDetection) {
        // Defer so collections (and similar) can reset page→1 in the same
        // currency update before we refetch active list queries.
        window.setTimeout(() => {
          const priceQueryKeys = new Set([
            "products",
            "product",
            "collection",
            "collections",
            "wishlist",
          ]);

          // Drop cached page>1 lists so infinite-scroll never resumes mid-list
          // with a mixed-currency product set.
          queryClient.removeQueries({
            predicate: (query) => {
              const root = query.queryKey[0];
              if (root !== "products" && root !== "collection") return false;
              const params = query.queryKey.find(
                (part): part is Record<string, unknown> =>
                  typeof part === "object" &&
                  part !== null &&
                  !Array.isArray(part) &&
                  "page" in part,
              );
              return Boolean(params && Number(params.page) > 1);
            },
          });

          void queryClient.invalidateQueries({
            predicate: (query) => {
              const root = query.queryKey[0];
              return typeof root === "string" && priceQueryKeys.has(root);
            },
            refetchType: "active",
          });
        }, 0);
      }

      if (
        detail?.previousCurrency &&
        detail.previousCurrency !== detail.currency
      ) {
        void refreshCartPricesForCurrency();
      }
    };

    window.addEventListener("currencyChange", onCurrencyChange);
    return () => window.removeEventListener("currencyChange", onCurrencyChange);
  }, [queryClient]);

  useEffect(() => {
    if (detecting.current) return;
    detecting.current = true;

    const init = async () => {
      try {
        // Wait for zustand persist rehydration
        await new Promise<void>((resolve) => {
          if (useCurrencyStore.persist.hasHydrated()) {
            resolve();
            return;
          }
          const unsub = useCurrencyStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
          });
        });

        const { hasPreference, countryCode } = useCurrencyStore.getState();

        // User manually picked a currency — never override with IP
        if (hasPreference) {
          const country =
            findCountryByCode(countryCode) ??
            findCountryByCode(Cookies.get(COUNTRY_COOKIE)) ??
            DEFAULT_COUNTRY;
          syncCurrencyCookies(country);
          return;
        }

        const cookieCountry = Cookies.get(COUNTRY_COOKIE);
        const stored =
          findCountryByCode(cookieCountry) || findCountryByCode(countryCode);

        // Reuse a previously auto-detected country (skip repeat IP calls).
        // Always re-detect when still on the AED default — it may be a failed first visit.
        if (stored && stored.countryCode !== DEFAULT_COUNTRY.countryCode) {
          setFromCountry(stored, { isDetection: true });
          return;
        }

        // Auto-detect from IP (e.g. Pakistan → PKR)
        const detected = await detectCountryFromIp();
        if (detected) {
          setFromCountry(detected, { isDetection: true });
          return;
        }

        setFromCountry(stored ?? DEFAULT_COUNTRY, { isDetection: true });
      } finally {
        // Unblock axios — cookies are set (or default) before this runs
        markCurrencyReady();
      }
    };

    void init();
  }, [setFromCountry]);

  return null;
}
