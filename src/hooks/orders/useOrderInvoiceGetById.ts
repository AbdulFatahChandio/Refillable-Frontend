import { useQuery } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";

export const fetchOrderInvoice = async (id: string, params?: Record<string, any>): Promise<any> => {
    const res = await api.get<any>(
        `/${API_ENDPOINTS.ORDER_INVOICE_GET_BY_ID}/${id}/invoice/download`, { params,responseType: "blob", }
    );
    return res.data;
};

export function useOrderInvoiceGetById(id: string, params?: Record<string, any>) {
    return useQuery<any>({
        queryKey: ["orderInvoice", id, params],
        queryFn: () => fetchOrderInvoice(id, params),
        staleTime: 1000 * 60 * 5,
        enabled: false,
        retry: false
    });
}