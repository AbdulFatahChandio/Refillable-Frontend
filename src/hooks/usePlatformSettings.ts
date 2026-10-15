import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { PlatformType } from "../ts-types/generated";

export const fetchPlatformSettings = async (params?: Record<string, any>): Promise<{ data: PlatformType }> => {
    const res = await api.get<{ data: PlatformType }>(
        `/${API_ENDPOINTS.PLATFORM_SETTINGS}`, { params }
    );
    return res.data;
};
export function usePlatformSettings(params?: Record<string, any>) {
    return useQuery<{ data: PlatformType }>({
        queryKey: ["products", params],
        queryFn: () => fetchPlatformSettings(params),
        staleTime: 1000 * 60 * 5,
    });
}