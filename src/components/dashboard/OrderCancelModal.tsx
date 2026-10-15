"use client";

import React from 'react'
import Button from '../Button'
import Image from 'next/image'
import TextField from '../TextField'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useCancelOrder } from '@/src/hooks/orders/useCancelOrder'
import { useQueryClient } from '@tanstack/react-query'
import { MdOutlineCancel } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

export default function OrderCancelModal({ id, onClose }: { id: string, onClose?: () => void }) {

    const { register, handleSubmit, formState: { errors } } = useForm<any>()

    const { mutate, isPending } = useCancelOrder();

    const queryClient = useQueryClient();
    const { t } = useTranslation();


    const onSubmit = (data: any) => {

        mutate({ id, input: data }, {

            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ["order"] });
                toast.success(t(data.message))
                onClose?.();
            }
        })
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className='bg-secondary w-[90%] text-primary rounded-xl md:px-10 px-5 md:py-20 py-10 min-h-[40vh] max-w-[500px] flex flex-col justify-center text-center items-center fixed top-1/2 left-1/2 shadow-2xl -translate-1/2  z-[999999]'>
            <MdOutlineCancel className='absolute top-3 right-3 size-6 cursor-pointer' onClick={onClose} />
            {/* <Image src={"/assets/images/coffee.png"} alt='coffee' width={24} height={24} /> */}
            <h3 className='! md:text-2xl font-semibold uppercase'>{t("Are you sure you want to cancel?")}</h3>
            <TextField {...register("cancellationReason", { required: "Reason is required" })} placeholder={t("Enter Reason")} className='w-full my-5'
                error={errors.cancellationReason && errors.cancellationReason?.message} />
            <Button type='submit' btnTheme='dark' text={isPending ? t("Canceling...") : t("Cancel Order")} />
        </form>
    )
}
