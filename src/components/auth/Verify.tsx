"use client";

import React from 'react'
import VerifyForm from './VerifyForm'
import { useTranslation } from 'react-i18next';

export default function Verify() {
    const { t } = useTranslation();
    return (
        <div className='signin min-h-[calc(100vh-130px)] pt-8 pb-10 px-3 flex items-center justify-center'>
            <div className='max-w-[700px] md:min-w-[700px] border border-brown md:px-12 md:py-8 p-3 rounded-xl'>
                <h1 className='authHeading'>{t('Verify Your Email Address')}</h1>
                <p className='authPara'>{t("We’ve sent a confirmation link to your inbox. Please verify to complete your sign-up.")}</p>
                <VerifyForm />
            </div>
        </div>
    )
}
