import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { User } from "../ts-types/generated";
import Cookies from "js-cookie";

export const fetchUser = async (params?: Record<string, any>): Promise<{data: User}> => {
    const res = await api.get<{data: User}>(
        `/${API_ENDPOINTS.ME}`, { params }
    );
    return res.data;
};
export function useFindUser(params?: Record<string, any>) {

    const token = Cookies.get("_ca");

    return useQuery<{data: User}>({
        queryKey: ["me", params],
        queryFn: () => fetchUser(params),
        staleTime: 1000 * 60 * 5,
        enabled: !!token,
        retry: (_, error: any) => error?.response?.status !== 401,
    });
}