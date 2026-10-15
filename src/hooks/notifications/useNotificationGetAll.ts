import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { IPaginator, NotificationType } from "../../ts-types/generated";

type QueryKeyType = [string, Record<string, any>?];

const fetchNotifications = async ({
    queryKey,
    pageParam,
}: QueryFunctionContext<QueryKeyType>): Promise<IPaginator<NotificationType>> => {
    const [_key, params] = queryKey;

    // ✅ safely coerce `pageParam` to number with fallback
    const page = typeof pageParam === "number" ? pageParam : 1;

    const res = await api.get<IPaginator<NotificationType>>(
        `/${API_ENDPOINTS.NOTIFICATION}`,
        {
            params: { ...params, page },
        }
    );

    return res.data;
};

export function useNotificationGetAll(params?: Record<string, any>) {
    return useInfiniteQuery<IPaginator<NotificationType>, Error, IPaginator<NotificationType>, QueryKeyType>({
        queryKey: ["notifications", params],
        queryFn: fetchNotifications,
        initialPageParam: 1, // ✅ required
        getNextPageParam: (lastPage) => {
            if (lastPage?.meta?.page < lastPage?.meta?.totalPages) {
                return lastPage.meta.page + 1;
            }
            return undefined;
        },
        staleTime: 1000 * 60 * 5,
    });
}