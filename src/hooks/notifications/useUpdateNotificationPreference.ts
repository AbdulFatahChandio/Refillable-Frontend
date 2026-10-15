import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { LoginResponse } from "../../ts-types/generated";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const updateNotification = async ({
    input,
}: {
    input: any;
}): Promise<LoginResponse> => {
    const res = await api.patch<LoginResponse>(
        `/${API_ENDPOINTS.NOTIFICATION_PREFERENCE}?${input}`,
    );
    return res.data;
};



export function useUpdateNotificationPreference() {

    const queryClient = useQueryClient()

    const { t } = useTranslation();

    return useMutation({
        mutationFn: updateNotification,
        onSuccess: (data) => {
            toast.success(t(data.message));
            queryClient.invalidateQueries({ queryKey: ["me"] });
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