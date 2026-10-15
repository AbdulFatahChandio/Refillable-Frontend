import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";


export const fetchPage = async (id: string, params?: Record<string, any>): Promise<{ data: any }> => {
    const res = await api.get<{ data: any }>(
        `/${API_ENDPOINTS.GET_PAGE}/${id}`, { params }
    );
    return res.data;
};

export function useGetPages(id: string, params?: Record<string, any>) {
    return useQuery<{ data: any }>({
        queryKey: ["pages", id, params],
        queryFn: () => fetchPage(id, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!params
    });
}