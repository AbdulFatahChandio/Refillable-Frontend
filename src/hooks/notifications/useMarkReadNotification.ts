import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { AddAddressTypes, LoginResponse } from "../../ts-types/generated";
import { toast } from "react-toastify";

export const markRead = async ({
    id,
}: {
    id: string;
}): Promise<LoginResponse> => {
    const res = await api.patch<LoginResponse>(
        `/${API_ENDPOINTS.NOTIFICATION}/${id}/mark-read`,
        {}
    );
    return res.data;
};



export function useMarkReadNotification() {

    return useMutation({
        mutationFn: markRead,
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