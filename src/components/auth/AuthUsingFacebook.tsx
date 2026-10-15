"use client";

import React from 'react'
import logo from "@/public/assets/images/fb-logo.png"
import Image from 'next/image'
import { useTranslation } from 'react-i18next';

export default function AuthUsingFacebook() {
    const { t } = useTranslation();
    return (
        <button type='button' className='px-3 py-3 cursor-pointer flex-1 capitalize flex items-center gap-3 justify-center hover:bg-primary text-primary hover:text-secondary border border-primary'>
            <Image src={logo} alt="logo" className='w-[20px] h-[20px]' width={20} height={20} />
            {t("Facebook")}
        </button>
    )
}
