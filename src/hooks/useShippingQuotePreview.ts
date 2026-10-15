import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import {
    ShippingQuotePreviewInput,
    ShippingQuotePreviewResponse,
} from "../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const fetchShippingQuotePreview = async (
    input: ShippingQuotePreviewInput
): Promise<ShippingQuotePreviewResponse> => {
    const res = await api.post<ShippingQuotePreviewResponse>(
        `/${API_ENDPOINTS.SHIPPING_QUOTE_PREVIEW}`,
        input
    );
    return res.data;
};

export function useShippingQuotePreview() {
    return useMutation({
        mutationFn: fetchShippingQuotePreview,
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
