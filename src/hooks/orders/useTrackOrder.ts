import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { API_ENDPOINTS } from "../../utils/api/endpoints";
import { TrackOrderInput } from "../../ts-types/generated";
import { toast } from "react-toastify";
import { t } from "i18next";

export const trackOrder = async (input: TrackOrderInput): Promise<any> => {
  const res = await api.post<any>(`/${API_ENDPOINTS.ORDER_TRACK}`, input);
  return res.data;
};

export function useTrackOrder() {
  return useMutation({
    mutationFn: trackOrder,
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message
          ? Array.isArray(error?.response?.data?.message)
            ? t(error?.response?.data?.message[0])
            : t(error?.response?.data?.message)
          : t("something went wrong"),
      );
    },
  });
}
