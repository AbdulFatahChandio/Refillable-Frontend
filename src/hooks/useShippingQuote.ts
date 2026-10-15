import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { ShippingQuoteInput, ShippingQuoteResponse } from "../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const fetchShippingQuote = async (
    input: ShippingQuoteInput
): Promise<ShippingQuoteResponse> => {
    const res = await api.post<ShippingQuoteResponse>(
        `/${API_ENDPOINTS.SHIPPING_QUOTE}`,
        input
    );
    return res.data;
};

export function useShippingQuote() {
    return useMutation({
        mutationFn: fetchShippingQuote,
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message
                    ? Array.isArray(error?.response?.data?.message)
                        ? t(error?.response?.data?.message[0])
                        : t(error?.response?.data?.message)
                    : t("something went wrong")
            );
        },
    });
}
