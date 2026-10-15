import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { CountriesType, IPaginator } from "../ts-types/generated";

export const fetchCity = async (id?: string, params?: Record<string, any>): Promise<IPaginator<CountriesType>> => {
    const res = await api.get<IPaginator<CountriesType>>(
        `/${API_ENDPOINTS.COUNTRIES}/${id}`, { params }
    );
    return res.data;
};
export function useGetAllCitiesByCountry(id?: string, params?: Record<string, any>) {
    return useQuery<IPaginator<CountriesType>>({
        queryKey: ["cities", id, params],
        queryFn: () => fetchCity(id, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!id
    });
}