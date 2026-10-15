import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { toast } from "react-toastify";

export const createOrderValidate = async (input: any): Promise<any> => {
    const res = await api.post<any>(
        `/${API_ENDPOINTS.ORDER_VALIDATE}`,
        input
    );
    return res.data;
};



export function useCreateOrderValidate() {
    return useMutation({
        mutationFn: createOrderValidate,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? error?.response?.data?.message[0]
                    : error?.response?.data?.message
                : 'errors.something-went-wrong');
        },
    });
}