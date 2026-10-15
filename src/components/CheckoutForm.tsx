"use client";

import React, { useEffect } from 'react'
import Button from './Button'
import { useTranslation } from 'react-i18next';
import { CheckoutTypes } from '../ts-types/generated';
import { useForm } from 'react-hook-form';
import { useUserStore } from '../store/useUserStore';

export default function CheckoutForm({ onCheckout }: any) {

    const { t } = useTranslation();

    const { user } = useUserStore();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm<CheckoutTypes>({
        defaultValues: {
            email: user?.email || "",
            note: "",
        },
    });

    useEffect(() => {
        try {
            const raw = localStorage.getItem("checkout");
            const saved = raw ? JSON.parse(raw) : {};
            reset({
                email: saved?.email || user?.email || "",
                note: saved?.note || "",
            });
        } catch {
            reset({
                email: user?.email || "",
                note: "",
            });
        }
    }, [user?.email, reset]);

    const submit = (data: CheckoutTypes) => {
        onCheckout(data);
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="border-b border-brown md:text-lg text-sm md:py-8 py-6 flex max-md:flex-wrap items-center gap-3">
                <label className="font-bold" htmlFor="note">{t("Note (optional) :")}</label>
                <input type="text" {...register("note")}
                    id="note" className="outline-none grow" placeholder={t("Let us know if you have some notes regarding your order.")} />
            </div>
            <div className="md:py-8 py-6 md:text-lg text-sm flex items-center max-md:flex-wrap justify-between gap-3">
                <div className="w-full">
                    <label className="block mb-2 font-bold" htmlFor="email">{t("Email : *")}</label>
                    <input {...register("email", {
                        required: t("Email is required"),
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t("Please enter a valid email address"),
                        }
                    })}
                        type="text" id="email" className="outline-none border-b pb-3 w-full max-w-[670px] border-brown" placeholder={t("Please enter your email to checkout")} />
                    <p className='!text-red-500 text-sm mt-2'>{errors.email && errors.email?.message}</p>
                </div>
                <Button text={t("checkout")} loading={isSubmitting} type='submit' className="!text-sm !capitalize !py-2" btnTheme='dark' />
            </div>
        </form>
    )
}
