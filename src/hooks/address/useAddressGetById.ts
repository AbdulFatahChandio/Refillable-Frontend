import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { AddressType } from "../../ts-types/generated";

export const fetchAddress = async (id: string, params?: Record<string, any>): Promise<{ data: AddressType }> => {
    const res = await api.get<{ data: AddressType }>(
        `/${API_ENDPOINTS.GET_ALL_ADDRESS}/${id}`, { params }
    );
    return res.data;
};

export function useAddressGetById(id: string, params?: Record<string, any>) {
    return useQuery<{ data: AddressType }>({
        queryKey: ["address", id, params],
        queryFn: () => fetchAddress(id, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!params
    });
}