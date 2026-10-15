import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";


export const fetchContent = async (id: string, params?: Record<string, any>): Promise<{ data: any }> => {
    const res = await api.get<{ data: any }>(
        `/${API_ENDPOINTS.CONTENT_SECTIONS}/${id}`, { params }
    );
    return res.data;
};

export function useGetContent(id: string, params?: Record<string, any>) {
    return useQuery<{ data: any }>({
        queryKey: ["content", id, params],
        queryFn: () => fetchContent(id, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!params
    });
}