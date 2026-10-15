import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { LoginInputTypes, LoginResponse } from "../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const signupUser = async (input: LoginInputTypes): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
        `/${API_ENDPOINTS.SIGN_UP}`,
        input
    );
    return res.data;
};



export function useUserSignUp() {
    return useMutation({
        mutationFn: signupUser,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? t(error?.response?.data?.message[0])
                    : t(error?.response?.data?.message)
                : t('something went wrong'));
        },
    });
}