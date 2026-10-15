import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { ValidateCouponInputTypes, ValidateCouponResponse } from "../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const validateCoupon = async (input: ValidateCouponInputTypes): Promise<ValidateCouponResponse> => {
    const res = await api.post<ValidateCouponResponse>(
        `/${API_ENDPOINTS.VALIDATE_COUPON}`,
        input
    );
    return res.data;
};



export function useCheckValidateCoupon() {
    return useMutation({
        mutationFn: validateCoupon,
         onSuccess: () => {
            toast.success(t("Discount applied successfully"));
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? Array.isArray(error?.response?.data?.message)
                    ? t(error?.response?.data?.message[0])
                    : t(error?.response?.data?.message)
                : t('something went wrong'));
        },
    });
}