import { useMutation } from "@tanstack/react-query";
import api from "@/src/utils/api/axios";
import { toast } from "react-toastify";

export const uploadFile = async (files: File[]) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files", file); // key must match backend ("files")
    });

    // Do not set Content-Type manually — browser must add multipart boundary.
    // Axios default application/json would break FormData without this.
    const res = await api.post(`/uploads`, formData, {
        timeout: 120000,
        headers: {
            "Content-Type": undefined as unknown as string,
        },
    });

    return res.data;
};

export function useUploadFile() {
    return useMutation({
        mutationFn: uploadFile,
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || "Failed to upload file"
            );
        },
    });
}
