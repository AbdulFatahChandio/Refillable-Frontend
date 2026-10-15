"use client";

import React from 'react'
import DashboardSecHd from './DashboardSecHd'
import { BsArrowLeft } from 'react-icons/bs'
import ShippingForm from './ShippingForm'
import BillingForm from './BillingForm'
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useTranslation } from 'react-i18next'

export default function Addaddress() {
const { t } = useTranslation();
  const router = useAppRouter()

  return (
    <>
      <div className='grid grid-cols-12 gap-4'>
        <div className="2xl:col-span-7 lg:col-span-10 md:col-span-11 col-span-12">
          <div className="flex items-center gap-4 mb-10">
            <BsArrowLeft size={24} onClick={() => router.back()} className='cursor-pointer rtl:rotate-180' />
            <DashboardSecHd text={t('Add Address')} />
          </div>
          <ShippingForm />
          {/* <div className='my-10'>
            <DashboardSecHd text='Add billing Address' />
          </div>
          <BillingForm /> */}
        </div>
      </div>
    </>
  )
}
