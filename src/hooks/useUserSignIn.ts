import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { LoginInputTypes, LoginResponse } from "../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const loginUser = async (input: LoginInputTypes): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
        `/${API_ENDPOINTS.SIGN_IN}`,
        input
    );
    return res.data;
};



export function useUserSignIn() {
    return useMutation({
        mutationFn: loginUser,
         onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? t(error?.response?.data?.message[0])
                    : t(error?.response?.data?.message)
                : t('something went wrong'));
        },
    });
}