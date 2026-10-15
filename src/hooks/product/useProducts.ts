import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { CategoryType, IPaginator, NoteType, ProductType } from "../../ts-types/generated";
import { useCurrencyStore } from "@/src/store/useCurrencyStore";

export const fetchProducts = async (route: string, params?: Record<string, any>): Promise<IPaginator<ProductType>> => {
    const res = await api.get<IPaginator<ProductType>>(
        `/${route}/${API_ENDPOINTS.PRODUCTS}`, { params }
    );
    return res.data;
};


export function useProducts(
    route: string,
    params?: Record<string, any>,
    options: { enabled?: boolean } = {},
) {
    const currency = useCurrencyStore((s) => s.currency);
    return useQuery<IPaginator<ProductType>>({
        queryKey: ["products", route, params, currency],
        queryFn: () => fetchProducts(route, params),
        staleTime: 1000 * 60 * 5,
        enabled: options.enabled ?? true,
    });
};

export const fetchNotes = async (params?: Record<string, any>): Promise<IPaginator<NoteType>> => {
    const res = await api.get<IPaginator<NoteType>>(
        `/${API_ENDPOINTS.NOTES}`, { params }
    );
    return res.data;
};

export const fetchCategories = async (params?: Record<string, any>): Promise<IPaginator<CategoryType>> => {
    const res = await api.get<IPaginator<CategoryType>>(
        `/${API_ENDPOINTS.CATEGORIES}`, { params }
    );
    return res.data;
};

export function useNotes(params?: Record<string, any>) {
    return useQuery<IPaginator<NoteType>>({
        queryKey: ["notes", params],
        queryFn: () => fetchNotes(params),
        staleTime: 1000 * 60 * 5,
    });
}

export function useCategories(params?: Record<string, any>) {
    return useQuery<IPaginator<CategoryType>>({
        queryKey: ["categories", params],
        queryFn: () => fetchCategories(params),
        staleTime: 1000 * 60 * 5,
    });
}
export function useGetSubCategories(params?: Record<string, any>, options: any = {}) {
    return useQuery<IPaginator<CategoryType>>({
        queryKey: ["subcategories", params],
        queryFn: () => fetchCategories(params),
        staleTime: 1000 * 60 * 5,
        ...options,
    });
}