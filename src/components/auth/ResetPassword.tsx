"use client";

import React from 'react'
import Link from 'next/link'
import ResetPasswordForm from './ResetPasswordForm'
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
    const { t } = useTranslation();
    return (
        <div className='signin min-h-[calc(100vh-130px)] pt-8 pb-10 px-3 flex items-center justify-center'>
            <div className='max-w-[700px] md:min-w-[700px] border border-brown md:px-12 md:py-8 p-3 rounded-xl'>
                <h1 className='authHeading'>{t("Reset Your Password")}</h1>
                <p className='authPara'>{t("Set unique and strong password")}</p>
                <ResetPasswordForm />
                {/* <p className='2xl:text-[18px] text-sm text-center mt-7 text-[#ffffffcc] dark:text-primary'>Haven’t received a code? <Link href={'/signup'} className='text-primary underline font-medium'>Resend</Link></p> */}
            </div>
        </div>
    )
}
