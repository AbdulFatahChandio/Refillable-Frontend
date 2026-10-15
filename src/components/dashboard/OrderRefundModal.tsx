"use client";

import React, { useState } from 'react'
import Button from '../Button'
import Image from 'next/image'
import TextField from '../TextField'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { MdOutlineCancel } from 'react-icons/md'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { useCreateOrderRefund } from '@/src/hooks/orders/useCreateOrderRefund'
import { useUploadFile } from '@/src/hooks/useUploadFile'
import { useDeleteFile } from '@/src/hooks/useDeleteFile'
import { useTranslation } from 'react-i18next'

export default function OrderRefundModal({ id, onClose }: { id: string, onClose?: () => void }) {

    const { register, handleSubmit, formState: { errors } } = useForm<any>()

    const { mutate, isPending } = useCreateOrderRefund();

    const { mutate: uploadMutate, isPending: isUploading } = useUploadFile();
    const { mutate: deleteMutate, isPending: isDeleting } = useDeleteFile();

    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    const queryClient = useQueryClient();

    const { t } = useTranslation();




    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) return;

        uploadMutate(files, {
            onSuccess: (res) => {

                const urls = res?.data.map((file: any) => file.image);

                setUploadedFiles((prev) => [...prev, ...urls]);

            },
        });

        e.target.value = "";
    };



    const handleDelete = (url: string) => {
        deleteMutate(url, {
            onSuccess: () => {
                setUploadedFiles((prev) => prev.filter((file) => file !== url));
            },
        });
    };

    const onSubmit = (data: any) => {
        mutate({ orderId: id, ...data, attachments: uploadedFiles }, {
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ["order"] });
                toast.success(t(data.message))
                onClose?.();
            }
        })
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className='bg-secondary w-[90%] text-primary md:px-10 rounded-xl px-3 md:py-18 py-10 min-h-[400px] max-h-[95vh] overflow-y-auto max-w-[500px] text-center fixed top-1/2 left-1/2 shadow-2xl -translate-1/2  z-[999999]'>
            <MdOutlineCancel className='absolute top-3 right-3 size-6 cursor-pointer' onClick={onClose} />
            {/* <Image src={"/assets/images/coffee.png"} alt='coffee' className='mx-auto' width={24} height={24} /> */}
            <h3 className='! text-2xl font-semibold uppercase'>{t("Refund")}</h3>
            <TextField {...register("userReason", { required: "Reason is required" })} placeholder={t('Enter Reason')} className='w-full mt-5 mb-6'
                error={errors.userReason && errors.userReason?.message} />
            <label htmlFor="image" className='p-2 cursor-pointer border-dashed border w-full mb-5 max-sm:text-[12px] block'>

                <input {...register("attachments")} type="file" id="image" name='image' accept='image/*' className="hidden"
                    multiple
                    onChange={handleFileChange} />
                <IoCloudUploadOutline className='mx-auto md:size-7 size-4 mb-2' />
                {isUploading ? t("Uploading...") : t("Upload Evidence")}
            </label>
            {uploadedFiles?.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-5 w-full">
                    {uploadedFiles.map((url, idx) => (
                        <div key={idx} className="relative">
                            <Image
                                src={url}
                                alt="uploaded"
                                width={80}
                                height={80}
                                className="rounded object-cover w-[80px] h-[80px]"
                            />
                            <button
                                type="button"
                                onClick={() => handleDelete(url)}
                                className="absolute -top-2 -right-2 bg-red-600 w-6 h-6 text-white rounded-full p-1 text-xs transition"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <Button type='submit' text={isPending ? t('Submitting...') : t('Submit')} btnTheme='dark' className='w-full' />
        </form>
    )
}
