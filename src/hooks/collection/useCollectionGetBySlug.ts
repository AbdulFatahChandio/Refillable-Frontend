import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { SingleCollectionType } from "../../ts-types/generated";
import { useCurrencyStore } from "@/src/store/useCurrencyStore";

export const fetchCollectionBySlug = async (
  slug: string,
  params?: Record<string, any>,
): Promise<SingleCollectionType> => {
  const res = await api.get<SingleCollectionType>(
    `/${API_ENDPOINTS.COLLECTION_BY_SLUG}/${slug}/listing`,
    { params },
  );
  return res.data;
};

export function useCollectionGetBySlug(
  slug: string,
  params?: Record<string, any>,
  options: { enabled?: boolean } = {},
) {
  const currency = useCurrencyStore((s) => s.currency);
  return useQuery<SingleCollectionType>({
    queryKey: ["collection", slug, params, currency],
    queryFn: () => fetchCollectionBySlug(slug, params),
    staleTime: 1000 * 60 * 5,
    enabled: (options.enabled ?? true) && !!slug,
  });
}
