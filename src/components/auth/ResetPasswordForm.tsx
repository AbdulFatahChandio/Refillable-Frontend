"use client";

import React, { useEffect, useState } from 'react'
import TextField from '../TextField'
import Button from '../Button'
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useResetPassword } from '@/src/hooks/useResetPassword';
import { useForm } from 'react-hook-form';
import { ResetPasswordTypes } from '@/src/ts-types/generated';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function ResetPasswordForm() {

    const [email, setEmail] = useState<any>('');
    const [otp, setOtp] = useState<any>('');


    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        const otp = localStorage.getItem("otp");
        setEmail(userEmail);
        setOtp(otp);
    }, [])

    const router = useAppRouter()


    const { mutate, isPending } = useResetPassword();

    const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordTypes>({
        mode: "onBlur",
    });


    const onSubmit = (values: ResetPasswordTypes) => {

        const payload = {
            ...values,
            email,
            otp
        };

        mutate(payload, {
            onSuccess: async (data) => {

                toast.success(t(data.message));
                router.push("/signin")
                localStorage.removeItem("otp");
                localStorage.removeItem("userEmail");
            },
            onError: (error: any) => {
                if (error?.response?.data?.message === "OTP Expired. Please request for new OTP") {
                    router.push("/forgot-password");
                }
            }
        });
    };

    const password = watch("password")

    const { t } = useTranslation();

    return (
        <form className='mt-10' onSubmit={handleSubmit(onSubmit)}>
            <TextField
                {...register("password", {
                    required: t("Password is required"),
                    pattern: {
                        value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s])\S{8,}$/,
                        message:
                            t("Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character"),
                    },
                })}
                type='password'
                label={t('New Password')}
                placeholder={t('Enter your password')}
                className='mb-6'
                error={errors.password && errors.password.message} />
            <TextField
                type='password'
                label={t('Confirm Password')}
                placeholder={t('Re-enter password for confirmation')}
                className='mb-6'
                {...register("confirmPassword", {
                    required: t("Please confirm your password"),
                    validate: (value) => value === password || t("Passwords do not match"),
                })}
                error={errors.confirmPassword && errors.confirmPassword.message} />
            <Button btnTheme="dark" text={isPending ? t('Saving...') : t('Save')} disabled={isPending} type='submit' className='w-full !capitalize' />
        </form>
    )
}
