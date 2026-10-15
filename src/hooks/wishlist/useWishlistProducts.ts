import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { IPaginator, ProductType } from "../../ts-types/generated";
import { useCurrencyStore } from "@/src/store/useCurrencyStore";

export const fetchProducts = async (params?: Record<string, any>): Promise<IPaginator<{ product: ProductType }>> => {
    const res = await api.get<IPaginator<{ product: ProductType }>>(
        `/${API_ENDPOINTS.WISHLIST}`, { params }
    );
    return res.data;
};
export function useWishlistProducts(params?: Record<string, any>) {
    const currency = useCurrencyStore((s) => s.currency);
    return useQuery<IPaginator<{ product: ProductType }>>({
        queryKey: ["wishlist", params, currency],
        queryFn: () => fetchProducts(params),
        staleTime: 1000 * 60 * 5,
    });
}