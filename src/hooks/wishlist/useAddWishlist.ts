import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { LoginResponse } from "../../ts-types/generated";
import { toast } from "react-toastify";

export const addWishlist = async ({
    id,
    // input,
}: {
    id: string;
    // input: AddAddressTypes;
}): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
        `/${API_ENDPOINTS.WISHLIST}/${id}`,
        {}
    );
    return res.data;
};



export function useAddWishlist() {

    return useMutation({
        mutationFn: addWishlist,
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