import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { OrderType } from "../../ts-types/generated";

export const fetchOrder = async (id: string, params?: Record<string, any>): Promise<any> => {
    const res = await api.get<any>(
        `/${API_ENDPOINTS.ORDER_GET_BY_ID}/${id}`, { params }
    );
    return res.data;
};

export function useOrderGetById(id: string, params?: Record<string, any>) {
    return useQuery<any>({
        queryKey: ["order", id, params],
        queryFn: () => fetchOrder(id, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!id
    });
}