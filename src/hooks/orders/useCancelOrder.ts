import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { OrderResponse } from "../../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const cancelOrder = async ({
    id,
    input,
}: {
    id: string;
    input: any;
}): Promise<OrderResponse> => {
    const res = await api.patch<OrderResponse>(
        `/${API_ENDPOINTS.ORDER_CANCEL}/${id}/cancel`,
        input
    );
    return res.data;
};



export function useCancelOrder() {
    return useMutation({
        mutationFn: cancelOrder,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? t(error?.response?.data?.message[0])
                    : t(error?.response?.data?.message)
                : t('something went wrong'));
        },
    });
}