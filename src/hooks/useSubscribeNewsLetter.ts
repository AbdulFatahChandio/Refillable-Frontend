import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { LoginResponse, SubscribeInputTypes } from "../ts-types/generated";
import { toast } from "react-toastify";

export const subscribe = async (input: SubscribeInputTypes): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
        `/${API_ENDPOINTS.SUBSCRIBE}/${input.email}`,{},
    );
    return res.data;
};



export function useSubscribeNewsLetter() {
    return useMutation({
        mutationFn: subscribe,
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? error?.response?.data?.message[0]
                    : error?.response?.data?.message
                : 'errors.something-went-wrong');
        },
    });
}