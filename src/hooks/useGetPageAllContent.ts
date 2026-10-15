import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";


export const fetchContent = async (params?: Record<string, any>): Promise<{ data: any }> => {
    const res = await api.get<{ data: any }>(
        `/${API_ENDPOINTS.CONTENT_SECTIONS}`, { params }
    );
    return res.data;
};

export function useGetPageAllContent(params?: Record<string, any>) {
    return useQuery<{ data: any }>({
        queryKey: ["contents", params],
        queryFn: () => fetchContent(params),
        staleTime: 1000 * 60 * 5,
        enabled: !!params
    });
}