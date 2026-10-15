"use client";

import React, { Fragment, useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { LuChevronDown } from "react-icons/lu";
import Image from "next/image";
import item from "@/public/assets/images/items.png";
import Button from "../Button";
import { OrderType } from "@/src/ts-types/generated";
import OrderCancelModal from "./OrderCancelModal";
import OrderRefundModal from "./OrderRefundModal";
import { useTranslation } from "react-i18next";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { MdRemoveRedEye } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";

type OrderProps = {
  order: OrderType;
};

export default function OrderCard({ order }: OrderProps) {
  const [showModal, setShowModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [orderId, setOrderId] = useState<any>("");
  const router = useAppRouter();

  const { t, i18n } = useTranslation();

  const getTranslation = (translations: any[], key: "name" | "description") => {
    if (!translations || translations.length === 0) return "";

    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");

    if (i18n.language === "ar" && ar && ar[key]) return ar[key];
    return en?.[key] || translations[0]?.[key] || "";
  };

  const handleDownloadInvoice = (invoiceUrl: string) => {
    if (!invoiceUrl) return;

    const link = document.createElement("a");
    link.href = invoiceUrl;
    link.target = "_blank";
    link.download = "invoice.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Disclosure
        as="div"
        defaultOpen
        className="border md:p-5 p-3 rounded-2xl border-[#D9D9D9]"
      >
        <div className="flex justify-between gap-2 flex-wrap items-center mb-5">
          <h3 className=" md:text-2xl  flex items-center gap-2">
            {t("Order")} #<span> BIJOU{String(order?.id).padStart(3, "0")}</span>
          </h3>
          {/* <h3 className='font-semibold md:text-[22px] '>{t('Amount')}: AED  {order?.total}</h3> */}
          <span
            className={`text-[12px] uppercase p-2 rounded-md
    ${
      order?.status === "unpaid"
        ? "bg-[#c0c0c073] text-gray-500" // gray
        : order?.status === "processing"
          ? "bg-[#20b6ed54] text-[#20b6ed]" // blue
          : order?.status === "pending_confirmation"
            ? "bg-[#FFF5D4] text-[#E2B41D]" // amber/orange
            : order?.status === "shipped"
              ? "bg-[#FFF5D4] text-[#E2B41D]" // gold
              : order?.status === "delivered"
                ? "bg-[#CEFFD5] text-[#1E9C31]" // green
                : order?.status === "cancelled"
                  ? "bg-[#FFD3D3] text-[#C22121]" // red
                  : order?.status === "refunded"
                    ? "bg-[#8a5cf65d] text-[#8B5CF6]" // purple
                    : "bg-[#c0c0c073] text-gray-500"
    }`}
          >
            {order?.status === "pending_confirmation"
              ? t("Pending Confirmation")
              : t(order?.status)}
          </span>
        </div>
        {/* <div className="flex items-center max-[450px]:justify-between flex-wrap gap-3 md:my-6 my-3">
                    <p className='text-sm'>{t('Order Status')}:</p>
                    <span
                        className={`text-[12px] uppercase p-2 rounded-md
    ${order?.status === "unpaid"
                                ? "bg-[#c0c0c073] text-gray-500" // gray
                                : order?.status === "processing"
                                    ? "bg-[#20b6ed54] text-[#20b6ed]" // blue
                                    : order?.status === "pending_confirmation"
                                        ? "bg-[#FFF5D4] text-[#E2B41D]" // amber/orange
                                        : order?.status === "shipped"
                                            ? "bg-[#FFF5D4] text-[#E2B41D]" // gold
                                            : order?.status === "delivered"
                                                ? "bg-[#CEFFD5] text-[#1E9C31]" // green
                                                : order?.status === "cancelled"
                                                    ? "bg-[#FFD3D3] text-[#C22121]" // red
                                                    : order?.status === "refund"
                                                        ? "bg-[#8a5cf65d] text-[#8B5CF6]" // purple
                                                        : "bg-[#c0c0c073] text-gray-500"
                            }`}
                    >
                        {order?.status === "pending_confirmation"
                            ? t("Pending Confirmation")
                            : order?.status}
                    </span>
                    <p className='text-sm min-[450px]:ml-auto'>{t('Order Placed On')}: <span className='text-[#5e5858] dark:text-[#465240]'>{new Date(order?.createdAt).toLocaleString("en-US", {
                        day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true
                    }).replace(",", "").replace(" at ", " | ")}</span></p>
                </div> */}
        {/* {order?.status === "shipped" || order?.status === "delivered" || order?.status === "refunded" ?
                    <div className="flex items-center max-[450px]:justify-between flex-wrap gap-3 my-6">
                        <p className='text-sm'>{t('Courier Service')}: <span className='bg-primary text-secondary py-2 px-5 text-[12px] uppercase font-medium ml-3'>{order?.courierServiceProvider}</span></p>

                        <p className='text-sm min-[450px]:ml-auto'>{t('Tracking Id')}: <span className='text-[#C4C8C2] dark:text-[#465240]'>{order?.trackingId}</span></p>
                    </div>
                    : null} */}
        {/* <div className="flex items-center flex-wrap md:gap-3 gap-2">
                    <Image src={item} alt="product" className="invert" width={20} height={20} />
                    <span className='text-sm text-[#5e5858] dark:text-[#465240]'>{`(${order?.items?.length} ${t('Items')})`}</span>
                    <div className="flex flex-wrap ms-auto md:gap-3 gap-2">
                        {order?.status === "processing" ?
                            <Button text={t('Cancel Order')} onClick={() => handleOpenModal(order?.id)} className=' max-sm:grow md:!text-base !text-[12px] !text-secondary !bg-[#EA4335] !font-medium md:!py-2 !py-1 md:!px-3 !px-2' />
                            : null}
                        {order?.status === t("delivered") && !order?.refund ?
                            <Button btnTheme='dark' text={t('Refund Order')} onClick={() => handleOpenRefundModal(order?.id)} className=' max-sm:grow md:!text-base !text-[12px] !font-medium md:!py-2 !py-1 md:!px-3 !px-1' />
                            : null}
                        <Button btnTheme='dark' text={t('View Invoice')} onClick={() => handleDownloadInvoice(order?.invoice?.pdfUrl)} className='!capitalize md:!text-base !text-[12px] !font-medium md:!py-2 max-sm:grow !py-1 md:!px-3 !px-2' />
                        <button className='md:py-[10px] p-1 border  md:px-2 text-xl'
                            onClick={() => router.push(`/dashboard/order-history/${order?.id}`)}>
                            <MdRemoveRedEye />
                        </button>
                    </div>



                    <DisclosureButton className="md:py-[10px] p-1 border  md:px-2 text-xl"><LuChevronDown /></DisclosureButton>
                </div> */}
        <div className="overflow-hidden py-2">
          <DisclosurePanel
            transition
            className=" border-[#C4C8C2] origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0"
          >
            {/* <h3 className='font-semibold md:text-2xl  mb-5'>{t('ORDER SUMMARY')}</h3> */}
            {order?.items?.map((product, index) => (
              <div
                className="flex items-center gap-2 md:pb-5 pb-3 md:mb-5 mb-3 border-dashed border-b border-[#D9D9D9]"
                key={index}
              >
                <img
                  src={
                    product?.selections.find(
                      (v: any) => v?.productVariantValue?.imageUrls?.length > 0,
                    )?.productVariantValue?.imageUrls?.[0] || product?.productImageUrls?.[0] ||
                    "/assets/images/defaultImage.jpg"
                  }
                  alt="product"
                  className="rounded-xl shrink-0 object-cover w-[60px] h-[60px] md:w-[150px] md:h-[150px]"
                  width={150}
                  height={150}
                />
                <div>
                  <h5 className="font-semibold sm:text-xl text-sm ">
                    {getTranslation(product?.translations, "name")}
                  </h5>
                  <span className="sm:text-sm text-[12px] text-gray-600 dark:text-[#465240]">
                    {t("Quantity")}: {product.quantity}
                  </span>
                  {product?.selections?.length > 0 && (
                    <span className="mx-1 text-gray-600 dark:text-[#465240]">
                      |
                    </span>
                  )}
                  {product?.selections?.map((v: any, i: any) => (
                    <Fragment key={i}>
                      <span
                        className="sm:text-sm text-[12px] text-gray-600 dark:text-[#465240]"
                        key={i}
                      >
                        {getTranslation(v?.variantTranslations, "name")}:{" "}
                        {getTranslation(
                          v?.variantValueTranslations,
                          "name",
                        )}{" "}
                      </span>
                      {product?.selections?.length - 1 !== i && (
                        <span className="mx-1 text-gray-600 dark:text-[#465240]">
                          |
                        </span>
                      )}
                    </Fragment>
                  ))}
                </div>
                <p className="sm:text-xl text-[12px] ms-auto font-medium">
                  AED {Number(product?.finalAmountPerUnit).toFixed(2)}
                </p>
              </div>
            ))}
            {/* <ul className='border-y text-gray-600 dark:text-[#465240] text-sm flex flex-col gap-3 py-5'>
                            <li className="flex justify-between">{t('Discount')} <span> AED {order?.discountedAmount}</span></li>
                            <li className="flex justify-between">{t('Shipping')} <span>{order?.shippingFee === "0" ? t('Free') : `AED ${order?.shippingFee}`}</span></li>
                            <li className="flex justify-between">{t('Tax')} <span> AED {order?.taxAmount}</span></li>
                            <li className="flex justify-between">{t('Subtotal')} <span>AED {order?.subtotal}</span></li>
                        </ul> */}
            <div className="flex justify-between items-center mt-5 gap-3">
              {/* <h3 className='font-semibold md:text-2xl '>{t('Total Amount')}</h3>
                            <h3 className='font-semibold md:text-[22px] '>AED {order?.total}</h3> */}
              <div>
                <p className="max-md:text-sm">
                  <span className="font-semibold">{t("Total")}</span> (
                  {order?.items?.length} {t("Items")})
                </p>
                <p className="md:text-lg text-sm">
                  {t("AED")} {Number(order?.total).toFixed(2)}
                </p>
              </div>
              <Button
                className="max-[500px]:grow max-sm:!px-3 max-sm:!text-[14px]"
                btnTheme="dark"
                text={
                  <>
                    {t("Track Order")}{" "}
                    <GoArrowRight className="inline size-6 ms-2 rtl:rotate-180" />
                  </>
                }
                onClick={() =>
                  router.push(`/dashboard/order-history/${order?.id}`)
                }
              />
            </div>
          </DisclosurePanel>
        </div>
      </Disclosure>
      {/* {showModal && <OrderCancelModal id={orderId} onClose={handleCloseModal} />}
            {showRefundModal && <OrderRefundModal id={orderId} onClose={handleCloseModal} />} */}
    </>
  );
}
