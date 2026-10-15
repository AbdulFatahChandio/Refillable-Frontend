import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { AddressType, IPaginator } from "../../ts-types/generated";
import { useUserStore } from "@/src/store/useUserStore";

export const fetchAddresses = async (params?: Record<string, any>): Promise<IPaginator<AddressType>> => {
    const res = await api.get<IPaginator<AddressType>>(
        `/${API_ENDPOINTS.GET_ALL_ADDRESS}`, { params }
    );
    return res.data;
};

export function useAddressGetAll(params?: Record<string, any>) {

    const { isLoggedIn } = useUserStore();
    
    return useQuery<IPaginator<AddressType>>({
        queryKey: ["addresses", params],
        queryFn: () => fetchAddresses(params),
        staleTime: 1000 * 60 * 5,
        enabled: !!isLoggedIn
    });
}