import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { CollectionType, IPaginator } from "../../ts-types/generated";

export const fetchCollections = async (
  params?: Record<string, any>,
): Promise<IPaginator<CollectionType>> => {
  const res = await api.get<IPaginator<CollectionType>>(
    `/${API_ENDPOINTS.COLLECTIONS}`,
    { params },
  );
  return res.data;
};

export function useCollections(
  params?: Record<string, any>,
  options: { enabled?: boolean } = {},
) {
  return useQuery<IPaginator<CollectionType>>({
    queryKey: ["collections", params],
    queryFn: () => fetchCollections(params),
    staleTime: 1000 * 60 * 5,
    enabled: options.enabled ?? true,
  });
}
