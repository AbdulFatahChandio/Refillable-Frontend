import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { LoginInputTypes, LoginResponse, VerifyOtpTypes } from "../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const verifyOtp = async (input: VerifyOtpTypes): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
        `/${API_ENDPOINTS.VERIFY_OTP}`,
        input
    );
    return res.data;
};



export function useVerifyOtp() {
    return useMutation({
        mutationFn: verifyOtp,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? t(error?.response?.data?.message[0])
                    : t(error?.response?.data?.message)
                : t('something went wrong'));
        },
    });
}