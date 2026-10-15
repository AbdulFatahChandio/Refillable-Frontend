import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../utils/api/endpoints";
import { LoginResponse, ProfileUpdateTypes } from "../ts-types/generated";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const updateProfile = async (input: ProfileUpdateTypes): Promise<LoginResponse> => {
    const res = await api.patch<LoginResponse>(
        `/${API_ENDPOINTS.UPDATE_PROFILE}`,
        input
    );
    return res.data;
};



export function useProfileUpdate() {

    const queryClient = useQueryClient();


    const { t } = useTranslation();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            toast.success(t("Profile updated successfully"));
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