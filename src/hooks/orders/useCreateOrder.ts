import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { OrderInputTypes, OrderResponse } from "../../ts-types/generated";
import { toast } from "react-toastify";

export const createOrder = async (input: OrderInputTypes): Promise<OrderResponse> => {
    const res = await api.post<OrderResponse>(
        `/${API_ENDPOINTS.ORDER_CREATE}`,
        input
    );
    return res.data;
};



export function useCreateOrder() {
    return useMutation({
        mutationFn: createOrder,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? error?.response?.data?.message[0]
                    : error?.response?.data?.message
                : 'errors.something-went-wrong');
        },
    });
}