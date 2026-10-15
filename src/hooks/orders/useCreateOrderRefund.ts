import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { OrderResponse } from "../../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const createOrderRefund = async (input: any): Promise<OrderResponse> => {
    const res = await api.post<OrderResponse>(
        `/${API_ENDPOINTS.CREATE_ORDER_REFUND}`,
        input
    );
    return res.data;
};



export function useCreateOrderRefund() {
    return useMutation({
        mutationFn: createOrderRefund,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? t(error?.response?.data?.message[0])
                    : t(error?.response?.data?.message)
                : t('something went wrong'));
        },
    });
}