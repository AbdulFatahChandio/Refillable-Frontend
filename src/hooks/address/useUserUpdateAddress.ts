import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { AddAddressTypes, LoginResponse } from "../../ts-types/generated";
import { toast } from "react-toastify";

export const updateAddress = async ({
    id,
    input,
}: {
    id: string;
    input: AddAddressTypes;
}): Promise<LoginResponse> => {
    const res = await api.patch<LoginResponse>(
        `/${API_ENDPOINTS.ADDRESS}/${id}`,
        input
    );
    return res.data;
};



export function useUserUpdateAddress() {

    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: updateAddress,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
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