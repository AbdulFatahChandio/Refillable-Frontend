"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useMemo } from "react";

type QueryValue = string | string[];

/**
 * App Router compatibility layer for code migrated from Pages Router.
 */
export function useAppRouter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const query = useMemo(() => {
    const q: Record<string, QueryValue> = {};

    searchParams?.forEach((value, key) => {
      q[key] = value;
    });

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) return;
        q[key] = value;
      });
    }

    return q;
  }, [searchParams, params]);

  const asPath = useMemo(() => {
    const qs = searchParams?.toString() ?? "";
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchParams]);

  const push = useCallback(
    (url: string) => {
      router.push(url);
    },
    [router],
  );

  const replace = useCallback(
    (url: string) => {
      router.replace(url);
    },
    [router],
  );

  const back = useCallback(() => {
    router.back();
  }, [router]);

  return {
    pathname,
    query,
    asPath,
    isReady: true,
    push,
    replace,
    back,
  };
}
