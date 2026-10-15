"use client";

import React from 'react'
import SigninForm from './SigninForm'
import SigninOptions from './SigninOptions'
import Link from 'next/link'
import { useTranslation } from 'react-i18next';

export default function Signin() {
      const { t } = useTranslation();
    return (
        <div className='signin min-h-[calc(100vh-130px)] pt-8 pb-10 px-3 flex items-center justify-center'>
            <div className='max-w-[700px] md:min-w-[700px] border border-brown md:px-12 md:py-8 p-3 rounded-xl'>
                <h1 className='authHeading'>{t("Welcome back to bijou")}</h1>
                <p className='authPara'>{t("Sign in to receive updates on new collections, special deals, and fashion inspiration tailored just for you.")}</p>
                <SigninForm />
                {/* <div className='relative my-5 text-center before:w-[45%] after:w-[45%] before:bg-primary after:bg-primary text-[#84818A] before:h-[1px] after:h-[1px] before:left-0 after:right-0 before:absolute after:absolute before:top-1/2 after:top-1/2 before:translate-y-1/2 after:translate-y-1/2'>
                    {t("or")}
                </div>
                <SigninOptions /> */}
                <p className='2xl:text-[18px] text-sm text-center mt-7 text-[#ffffffcc] dark:text-primary'>{t("Don't have an account?")} <Link href={'/signup'} className='text-primary underline font-medium'>{t("Register")}</Link></p>
            </div>
        </div>
    )
}
