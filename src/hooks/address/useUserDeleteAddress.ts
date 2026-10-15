import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { AddAddressTypes, LoginResponse } from "../../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const deleteAddress = async ({
    id,
}: {
    id: string;
}): Promise<LoginResponse> => {
    const res = await api.delete<LoginResponse>(
        `/${API_ENDPOINTS.ADDRESS}/${id}`,
        {}
    );
    return res.data;
};




export function useUserDeleteAddress() {

    return useMutation({
        mutationFn: deleteAddress,
        onSuccess: (data) => {
            toast.success(t("Address deleted successfully"));
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