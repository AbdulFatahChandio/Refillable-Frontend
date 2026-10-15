import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { toast } from "react-toastify";

export const deleteFile = async (key: string) => {
  // key = full file URL (like your example)
  const res = await api.delete(
    `/uploads`,
    {
      params: { key }, // 👈 send query param
    }
  );
  return res.data;
};

export function useDeleteFile() {
  return useMutation({
    mutationFn: deleteFile,
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete file"
      );
    },
  });
}
