"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/src/utils/api/axios";
import { MdOutlineCancel } from "react-icons/md";
import Image from "next/image";
import Button from "./Button";
import { useUserStore } from "../store/useUserStore";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useCartStore } from "../store/useCartStore";
import { GoArrowRight } from "react-icons/go";
import { useTranslation } from "react-i18next";

export default function PaymentSuccessModal({
    id,
    onClose,
}: {
    id: string;
    onClose: () => void;
}) {

    const { t } = useTranslation();

    const { isLoggedIn } = useUserStore()
    const { clearCart } = useCartStore()
    const router = useAppRouter()
    const [apiCalled, setApiCalled] = useState(false);

    useEffect(() => {
        const callPaymentSuccessAPI = async () => {
            if (id && !apiCalled) {
                try {
                    setApiCalled(true);
                    await api.patch(
                        `/public/orders/${id}/payment-succeeded`
                    );
                    toast.success(t("Thank you! Your order has been placed."));
                    clearCart()
                } catch (error: any) {
                    toast.error(t("Payment Failed"));
                }
            }
        };

        callPaymentSuccessAPI();
    }, [id, apiCalled]);


    const handleTrack = () => {
        if (!isLoggedIn) {
            router.push("/track-order");
        } else {
            router.push("/dashboard/order-history");
        }
    };


    return (
        // <div className="bg-primary w-[90%] text-white md:px-10 px-5 md:py-20 py-10 min-h-[40vh] max-w-[500px] flex flex-col justify-center text-center items-center fixed top-1/2 left-1/2 shadow-2xl -translate-1/2  z-[999999]">
        //     <MdOutlineCancel className='absolute top-3 right-3 size-6 cursor-pointer' onClick={onClose} />
        //     <Image
        //         src="/assets/images/coffee.png"
        //         alt="success"
        //         width={24}
        //         height={24}
        //         className="mx-auto mb-3"
        //     />

        //     <h3 className=' text-2xl font-semibold uppercase mt-5'>Thank You for Your Order!</h3>
        //     <p className="my-5 !text-gray-400">
        //         Your order has been successfully placed. We’re already preparing your freshly roasted coffee and will send you a confirmation email with your order details shortly.
        //     </p>
        //     <Button text="Track My Order"
        //         onClick={handleTrack}
        //         className="!capitalize md:!text-base !text-[12px]!font-medium md:!py-2 !py-1 md:!px-3 !px-1"
        //     />


        // </div>
        <div className="bg-secondary w-[90%] text-primary rounded-2xl md:px-10 px-3 md:py-20 py-10 min-h-[40vh] max-w-[600px] flex flex-col justify-center text-center items-center fixed top-1/2 left-1/2 shadow-2xl -translate-1/2  z-[999999]">
            <MdOutlineCancel className='absolute top-3 right-3 size-6 cursor-pointer' onClick={onClose} />
            <Image
                src="/assets/images/order-success.png"
                alt="success"
                width={100}
                height={100}
                className="mx-auto mb-3 max-md:w-[60px]"
            />

            <h3 className='md:text-2xl text-xl capitalize mt-5'>{t("Thank You for Your Order")}</h3>
            <p className="my-5 max-md:text-sm">
                {t("A confirmation email has been sent")}
            </p>
            <div className="flex items-center justify-center w-full gap-4 max-md:flex-col-reverse">
                <Button text={<>{t("Continue Shopping")} <GoArrowRight className='inline size-5 ms-2 rtl:rotate-180' /></>}
                    onClick={onClose}
                    btnTheme="transparent"
                    className="!px-3 !text-primary max-md:w-full hover:!bg-primary hover:!text-secondary"
                />
                <Button text={<>{t("Track My Order")} <GoArrowRight className='inline size-5 ms-2 rtl:rotate-180' /></>}
                    onClick={handleTrack}
                    btnTheme="dark"
                    className="max-md:w-full"
                />
            </div>

        </div>
    );
}