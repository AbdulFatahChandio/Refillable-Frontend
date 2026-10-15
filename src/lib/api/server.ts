import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/src/utils/api/endpoints";
import {
  CategoryType,
  IPaginator,
  ProductType,
} from "@/src/ts-types/generated";
import {
  CURRENCY_COOKIE,
  DEFAULT_COUNTRY,
} from "@/src/utils/countries-currencies";

const API_URL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

type FetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

async function getServerCurrency() {
  try {
    const jar = await cookies();
    return jar.get(CURRENCY_COOKIE)?.value || DEFAULT_COUNTRY.currency;
  } catch {
    return DEFAULT_COUNTRY.currency;
  }
}

async function serverFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  options: FetchOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_REST_API_ENDPOINT is not configured");
  }

  const url = new URL(
    path.startsWith("http") ? path : `${API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const currency = await getServerCurrency();

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "X-Currency": currency,
    },
    next: {
      revalidate: options.revalidate ?? 3600,
      tags: options.tags,
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} for ${url.pathname}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchProducts(
  params?: Record<string, string | number | boolean | undefined>,
) {
  return serverFetch<IPaginator<ProductType>>(
    `public/${API_ENDPOINTS.PRODUCTS}`,
    params,
    { tags: ["products"] },
  );
}

export async function fetchProductById(id: string | number) {
  return serverFetch<{ data: { product: ProductType; relatedProducts: ProductType[] } }>(
    `public/${API_ENDPOINTS.PRODUCT_BY_ID}/${id}`,
    undefined,
    { tags: [`product-${id}`] },
  );
}

export async function fetchProductBySlug(slug: string) {
  const numericId = slug.match(/-(\d+)$/)?.[1];
  if (numericId) {
    return fetchProductById(numericId);
  }

  const list = await fetchProducts({ limit: 100, search: slug });
  const match = list.data.find((p) => p.slug === slug);
  if (!match?.id) {
    return null;
  }
  return fetchProductById(match.id);
}

export async function fetchCategories(
  params?: Record<string, string | number | boolean | undefined>,
) {
  return serverFetch<IPaginator<CategoryType>>(
    API_ENDPOINTS.CATEGORIES,
    { limit: 999, depth: 3, ...params },
    { tags: ["categories"] },
  );
}

export async function fetchAllProducts() {
  const allProducts: ProductType[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const res = await fetchProducts({ limit: 100, page });
    allProducts.push(...res.data);
    totalPages = res.meta?.totalPages ?? 1;
    page += 1;
  }

  return allProducts;
}
