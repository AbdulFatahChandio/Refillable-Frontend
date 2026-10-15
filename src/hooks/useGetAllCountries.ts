import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { CountriesType, IPaginator } from "../ts-types/generated";

export const fetchCountries = async (params?: Record<string, any>): Promise<IPaginator<CountriesType>> => {
    const res = await api.get<IPaginator<CountriesType>>(
        `/${API_ENDPOINTS.COUNTRIES}`,{ params }
    );
    return res.data;
};
export function useGetAllCountries(params?: Record<string, any>) {
    return useQuery<IPaginator<CountriesType>>({
        queryKey: ["countries", params],
        queryFn: () => fetchCountries(params),
        staleTime: 1000 * 60 * 5,
    });
}