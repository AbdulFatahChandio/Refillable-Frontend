import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { ChangePasswordTypes, LoginResponse } from "../ts-types/generated";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const changePassword = async (input: ChangePasswordTypes): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
        `/${API_ENDPOINTS.UPDATE_PASSWORD}`,
        input
    );
    return res.data;
};



export function useChangePassword() {

    const { t } = useTranslation();

    return useMutation({
        mutationFn: changePassword,
        onSuccess: (data) => {
            toast.success(t(data.message));
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