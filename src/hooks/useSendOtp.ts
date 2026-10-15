import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { LoginResponse, SendOtpTypes } from "../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const sendOtp = async (input: SendOtpTypes): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(
        `/${API_ENDPOINTS.SEND_OTP}`,
        input
    );
    return res.data;
};



export function useSendOtp() {
    return useMutation({
        mutationFn: sendOtp,
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? t(error?.response?.data?.message[0])
                    : t(error?.response?.data?.message)
                : t('something went wrong'));
        },
    });
}