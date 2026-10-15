import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { LoginResponse } from "../ts-types/generated";
import { toast } from "react-toastify";
import Cookies from 'js-cookie'
import { useTranslation } from "react-i18next";

export const deleteAccount = async (): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
        `/${API_ENDPOINTS.DELETE_ACCOUNT}`,
        {}
    );
    return res.data;
};



export function useDeleteAccount() {

    const { t } = useTranslation();

    return useMutation({
        mutationFn: deleteAccount,
        onSuccess: (data) => {
            toast.success(t(data.message));
            Cookies.remove("_ca", { path: "/", sameSite: "strict", secure: true })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? t(error?.response?.data?.message[0])
                    : t(error?.response?.data?.message)
                : t('something went wrong'));
        },
    });
}
