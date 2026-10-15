import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { AddAddressTypes, LoginResponse } from "../../ts-types/generated";
import { toast } from "react-toastify";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useTranslation } from "react-i18next";

export const addAddress = async (input: AddAddressTypes): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
        `/${API_ENDPOINTS.ADDRESS}`,
        input
    );
    return res.data;
};



export function useUserAddAddress() {

    const queryClient = useQueryClient();
     const { t } = useTranslation();

    return useMutation({
        mutationFn: addAddress,
        onSuccess: (data) => {
             toast.success(t(data.message));
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
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