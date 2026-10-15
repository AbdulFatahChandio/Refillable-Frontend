"use client";

import { useAppRouter } from "@/src/hooks/useAppRouter";
import React from 'react'
import home from '@/public/assets/images/home.png'
import address from '@/public/assets/images/location.png'
import user from '@/public/assets/images/user.png'
import wishtlist from '@/public/assets/images/wishlist.png'
import order from '@/public/assets/images/box.png'
import notification from '@/public/assets/images/notification.png'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'




export default function DashboardSidebar({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { t } = useTranslation();
  const router = useAppRouter()

  const routes = [
    // { name: "Dashboard", path: "/dashboard", icon: home },
    { name: t("Profile Management"), path: "/dashboard/profile-management", icon: user },
    { name: t("Order History"), path: "/dashboard/order-history", icon: order },
    { name: t("Notifications"), path: "/dashboard/notifications", icon: notification },
    { name: t("Wishlist"), path: "/dashboard/wishlist", icon: wishtlist },
    { name: t("Address"), path: "/dashboard/address", icon: address },
  ]

  return (
    <aside className={`border-e fixed max-lg:bg-secondary max-lg:top-0 max-lg:start-0 ${open ? "max-lg:translate-x-0 transition duration-500" : "ltr:max-lg:-translate-x-full rtl:max-lg:translate-x-full"} w-full 2xl:max-w-[300px] max-w-[250px] lg:z-[10] z-[9999999999] lg:pt-14 pt-18 2xl:px-9 lg:px-5 px-3 border-brown 2xl:min-w-[350px] md:min-w-[300px] lg:h-[calc(100vh-77px)] h-screen`}>
      <button
        onClick={onClose}
        className='absolute top-5 right-5 lg:hidden text-primary'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <g clipPath="url(#clip0_290_601)">
            <path d="M11.8323 10.0164L19.6199 2.22859C20.1267 1.72202 20.1267 0.902971 19.6199 0.396405C19.1133 -0.110162 18.2943 -0.110162 17.7877 0.396405L9.99989 8.18425L2.21228 0.396405C1.70548 -0.110162 0.88667 -0.110162 0.380103 0.396405C-0.126701 0.902971 -0.126701 1.72202 0.380103 2.22859L8.16771 10.0164L0.380103 17.8043C-0.126701 18.3108 -0.126701 19.1299 0.380103 19.6364C0.632556 19.8891 0.964493 20.0161 1.29619 20.0161C1.62789 20.0161 1.95959 19.8891 2.21228 19.6364L9.99989 11.8486L17.7877 19.6364C18.0404 19.8891 18.3721 20.0161 18.7038 20.0161C19.0355 20.0161 19.3672 19.8891 19.6199 19.6364C20.1267 19.1299 20.1267 18.3108 19.6199 17.8043L11.8323 10.0164Z" fill="#000" />
          </g>
          <defs>
            <clipPath id="clip0_290_601">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg></button>
      <ul className='flex flex-col gap-5'>
        {routes.map((route) => (
          <li key={route.name}>
            <button type="button" onClick={() => { router?.push(route?.path); onClose(); }}
              className={`text-start 2xl:px-6 px-3 border hover:border-brown w-full flex items-center text-primary gap-3 md:py-3 py-2 2xl:text-lg max-md:text-sm
                        ${router?.pathname?.includes(route?.path) ? "border-brown" : "border-transparent"}`}>
              <Image src={route.icon} className='invert' alt='user' width={24} height={24} />
              {route.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
