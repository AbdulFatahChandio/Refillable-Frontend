import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { IPaginator, OrderType } from "../../ts-types/generated";

export const fetchOrders = async (params?: Record<string, any>): Promise<IPaginator<OrderType>> => {
    const res = await api.get<IPaginator<OrderType>>(
        `/${API_ENDPOINTS.GET_ALL_ORDERS}`,{ params }
    );
    return res.data;
};

export function useOrderGetAll(params?: Record<string, any>) {
    return useQuery<IPaginator<OrderType>>({
        queryKey: ["orders", params],
        queryFn: () => fetchOrders(params),
        staleTime: 1000 * 60 * 5,
    });
}