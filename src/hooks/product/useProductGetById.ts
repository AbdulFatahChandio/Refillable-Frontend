import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { ProductType } from "../../ts-types/generated";
import { useCurrencyStore } from "@/src/store/useCurrencyStore";

export const fetchProduct = async (route: string, id: string, params?: Record<string, any>): Promise<{ data: { product: ProductType, relatedProducts: ProductType[] } }> => {
    const res = await api.get<{ data: { product: ProductType, relatedProducts: ProductType[] } }>(
        `/${route}/${API_ENDPOINTS.PRODUCT_BY_ID}/${id}`, { params }
    );
    return res.data;
};

export function useProductGetById(route: string, id: string, params?: Record<string, any>) {
    const currency = useCurrencyStore((s) => s.currency);
    return useQuery<{ data: { product: ProductType, relatedProducts: ProductType[] } }>({
        queryKey: ["product", route, id, params, currency],
        queryFn: () => fetchProduct(route, id, params),
        staleTime: 1000 * 60 * 5,
        // enabled: !!params
    });
}