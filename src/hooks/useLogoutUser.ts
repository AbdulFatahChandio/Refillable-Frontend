import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { LoginResponse } from "../ts-types/generated";
import { toast } from "react-toastify";
import Cookies from 'js-cookie'

export const logout = async (input: any): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
        `/${API_ENDPOINTS.LOGOUT}`,
        input
    );
    return res.data;
};



export function useLogoutUser() {
    return useMutation({
        mutationFn: logout,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? error?.response?.data?.message[0]
                    : error?.response?.data?.message
                : 'errors.something-went-wrong');
        },
    });
}