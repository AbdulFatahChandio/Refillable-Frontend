import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import {
    ShippingCountryWiseFeesInput,
    ShippingCountryWiseFeesResponse,
} from "../ts-types/generated";

export const fetchCountryWiseShippingFees = async (
    input: ShippingCountryWiseFeesInput
): Promise<ShippingCountryWiseFeesResponse> => {
    const res = await api.post<ShippingCountryWiseFeesResponse>(
        `/${API_ENDPOINTS.SHIPPING_COUNTRY_WISE_FEES}`,
        input
    );
    return res.data;
};

export function useCountryWiseShippingFees(
    input: ShippingCountryWiseFeesInput | null
) {
    return useQuery<ShippingCountryWiseFeesResponse>({
        queryKey: ["shipping-country-wise-fees", input],
        queryFn: () => fetchCountryWiseShippingFees(input!),
        enabled:
            !!input?.countries?.[0] &&
            !!input?.city &&
            (input?.cartItems?.length ?? 0) > 0,
        staleTime: 0,
    });
}
