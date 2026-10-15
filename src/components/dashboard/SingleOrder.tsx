"use client";

import { useOrderGetById } from "@/src/hooks/orders/useOrderGetById";
import Image from "next/image";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa6";
import Button from "../Button";
import OrderCancelModal from "./OrderCancelModal";
import OrderRefundModal from "./OrderRefundModal";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import { useOrderInvoiceGetById } from "@/src/hooks/orders/useOrderInvoiceGetById";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

export default function SingleOrder() {
  const [showModal, setShowModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [orderId, setOrderId] = useState<any>("");

  const router = useAppRouter();
  const id = router.query.id as string;

  const { data, isLoading } = useOrderGetById(id);
  const { isFetching: invoiceLoading, refetch } = useOrderInvoiceGetById(id);

  const order = data?.data;

  const { t, i18n } = useTranslation();

  const getTranslation = (translations: any[], key: "name" | "description") => {
    if (!translations || translations.length === 0) return "";

    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");

    if (i18n.language === "ar" && ar && ar[key]) return ar[key];
    return en?.[key] || translations[0]?.[key] || "";
  };

  const handleOpenModal = (id: any) => {
    setOrderId(id);
    setShowModal(true);
  };

  const handleOpenRefundModal = (id: any) => {
    if (order?.paymentMethod === "PAYMENNT") {
      setOrderId(id);
      setShowRefundModal(true);
    } else {
      toast.error(
        t(
          "Refund requests cannot be submitted for Cash on Delivery orders. Please contact bijou support for assistance.",
        ),
        {
          autoClose: 5000,
          onClick: () => router.push("/contact-us"),
        },
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowRefundModal(false);
    setOrderId("");
  };

  // const handleDownloadInvoice = (invoiceUrl: string) => {
  //   if (!invoiceUrl) return;

  //   const link = document.createElement("a");
  //   link.href = invoiceUrl;
  //   link.target = "_blank";
  //   link.download = "invoice.pdf";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const getInvoice = async () => {
    try {
      const res = await refetch();

      if (!res.data) return;

      const url = window.URL.createObjectURL(res.data);

      window.open(url, "_blank");

    } catch (err) {
      console.error("Error fetching invoice:", err);
    }
  };

  const downloadShipmentLabel = () => {
    const base64 = order?.smsaLabelBase64;
    if (!base64) return;

    const href = base64.startsWith("data:")
      ? base64
      : `data:application/pdf;base64,${base64}`;

    const link = document.createElement("a");
    link.href = href;
    link.download = `shipment-label-${order?.id || "label"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let allStates = ["paid", "processing", "shipped", "delivered"];

  // 1) Agar order cancelled ho → cancelled ko processing ke baad insert karo
  if (order?.status === "cancelled") {
    const newStates: any = [];

    allStates.forEach((s) => {
      newStates.push(s);
      if (s === "processing") {
        newStates.push("cancelled"); // Insert here
      }
    });

    allStates = newStates;
  }

  // orderTrackings se jitne bhi states aaye hain unko active manenge
  const activeStates = new Set(order?.orderTrackings?.map((t: any) => t.state));

  // 2) Stripe rule
  if (order?.paymentMethod === "PAYMENNT" && activeStates.has("processing")) {
    activeStates.add("paid");
  }

  // 3) Cancelled active
  if (order?.status === "cancelled" && activeStates.has("cancelled")) {
    activeStates.add("cancelled");
  }

  if (isLoading) {
    return <Spinner className="mt-40" />;
  }

  return (
    <div className="max-w-5xl mx-auto md:space-y-10 space-y-5">
      {/* 🧾 Order Header */}
      {/* <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-2xl">{t('Order # RST')}- {String(order?.id).padStart(3, "0")}</h1>
                    <p className="text-[#C4C8C2] flex gap-1 dark:text-[#465240]">
                        {t('Placed on')}: <span> {order?.createdAt?.substring(0, 10)}</span>
                    </p>
                </div>
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
            </div> */}

      <div className="relative w-full mt-4">
        <div className="absolute md:top-[12px] top-[10px] left-1/2 -translate-x-1/2 md:w-[calc(100%-60px)] w-[calc(100%-50px)] h-0 border-b-2 border-dashed border-gray-300 z-0"></div>

        <div className="flex justify-between relative z-10">
          {allStates.map((s, index) => {
            const isActive = activeStates.has(s);

            const statusLabels: any = {
              paid: t("Paid"),
              processing: t("Processing"),
              shipped: t("Shipped"),
              delivered: t("Delivered"),
              cancelled: t("Cancelled"),
            };

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`md:w-6 md:h-6 h-5 w-5 rounded-full flex items-center justify-center
            ${isActive ? "bg-dark-gold" : "bg-[#D9D9D9]"}`}
                >
                  <FaCheck
                    className={`${isActive ? "!text-secondary" : "text-primary"} size-3 md:size-4`}
                  />
                </div>

                <span className="mt-2 font-medium text-center max-sm:text-[12px]">
                  {statusLabels[s]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🛍️ Order Items */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-xl text-lg">{t("Products")}</h2>
          <div className="flex flex-wrap ms-auto md:gap-3 gap-2">
            {order?.status === "processing" ? (
              <Button
                text={t("Cancel Order")}
                onClick={() => handleOpenModal(order?.id)}
                className=" max-sm:grow md:!text-base !text-[12px] border-transparent !text-secondary !bg-[#EA4335] !font-medium md:!py-2 !py-1 md:!px-3 !px-2"
              />
            ) : null}
            {order?.status === "delivered" && !order?.refund ? (
              <Button
                btnTheme="dark"
                text={t("Refund Order")}
                onClick={() => handleOpenRefundModal(order?.id)}
                className=" max-sm:grow md:!text-base !text-[12px] !font-medium md:!py-2 !py-1 md:!px-3 !px-1"
              />
            ) : null}
            <Button
              btnTheme="dark"
              text={t("View Invoice")}
              loading={invoiceLoading}
              onClick={getInvoice}
              className="!capitalize md:!text-base !text-[12px] !font-medium md:!py-2 max-sm:grow !py-1 md:!px-3 !px-2"
            />
            {order?.smsaLabelBase64 ? (
              <Button
                btnTheme="dark"
                text={t("View Shipment")}
                onClick={downloadShipmentLabel}
                className="!capitalize md:!text-base !text-[12px] !font-medium md:!py-2 max-sm:grow !py-1 md:!px-3 !px-2"
              />
            ) : null}
          </div>
        </div>
        <div className="border rounded-lg divide-y divide-[#D9D9D9] border-[#D9D9D9]">
          {order?.items?.map((item: any) => {
            return (
              <div key={item.id} className="flex items-center gap-4 md:p-4 p-3">
                <div className="relative md:w-20 md:h-20 w-[50px] h-[50px] flex-shrink-0">
                  <img
                    src={
                      item?.selections.find(
                        (v: any) => v?.productVariantValue?.imageUrls?.length > 0,
                      )?.productVariantValue?.imageUrls?.[0] || item?.productImageUrls?.[0] ||
                      "/assets/images/defaultImage.jpg"
                    }
                    alt={
                      getTranslation(item?.translations, "name") ||
                      "Product image"
                    }

                    className="object-cover rounded-lg absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className=" font-semibold max-sm:text-sm">
                    {getTranslation(item?.translations, "name")}
                  </h3>
                  {/* <p className="text-[#C4C8C2] dark:text-[#465240] text-sm">
                                        {getTranslation(item?.translations, "description")}
                                    </p> */}
                  <p className="mt-1 text-sm max-sm:text-[12px] flex gap-1 text-[#C4C8C2] dark:text-[#465240]">
                    {t("Quantity")}:{" "}
                    <span className="font-medium">{item.quantity}</span>
                    {item?.selections?.length > 0 && (
                      <span className="mx-1 text-gray-600 dark:text-[#465240]">
                        |
                      </span>
                    )}
                    {item?.selections?.map((v: any, i: any) => (
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
                        {item?.selections?.length - 1 !== i && (
                          <span className="mx-1 text-gray-600 dark:text-[#465240]">
                            |
                          </span>
                        )}
                      </Fragment>
                    ))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold max-sm:text-[12px]">
                    AED {Number(item.finalAmountPerUnit).toFixed(2)}
                  </p>
                  {/* {item.discountPercentage && (
                                        <p className="text-xs text-[#C4C8C2] dark:text-[#465240]">
                                            {item.discountPercentage}% off
                                        </p>
                                    )} */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 💰 Order Summary */}
      <div className="border rounded-lg border-[#D9D9D9] md:p-6 p-3 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="md:text-lg ">{t("Order Summary")}</h2>
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
        <div className="flex justify-between max-md:text-sm font-medium">
          <span>{t("Order No.")}</span>
          <span>BIJOU#{String(order?.id).padStart(3, "0")}</span>
        </div>
        <div className="flex justify-between max-md:text-sm">
          <span>{t("Placed on")}</span>
          <span>
            {new Date(order?.createdAt)
              .toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
              .replace(",", "")
              .replace(" at ", " | ")}{" "}
          </span>
        </div>
        <div className="flex justify-between max-md:text-sm">
          <span>{t("Subtotal")}</span>
          <span>AED {Number(order?.subtotal).toFixed(2)}</span>
        </div>
        {Number(order?.discountedAmount) > 0 && (
          <div className="flex justify-between max-md:text-sm">
            <span>{t("Discount")}</span>
            <span>- AED {Number(order?.discountedAmount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between max-md:text-sm">
          <span>{t("VAT")}</span>
          <span>{order?.taxPercentage}%</span>
        </div>
        <div className="flex justify-between max-md:text-sm">
          <span>{t("Shipping Fee")}</span>
          <span>AED {Number(order?.shippingFee).toFixed(2)}</span>
        </div>
        <div className="flex justify-between max-md:text-sm capitalize">
          <span>{t("Payment Method")}</span>
          <span>
            {order?.paymentMethod === "PAYMENNT"
              ? t("Credit / Debit Card")
              : t(order?.paymentMethod?.split("_")?.join(" ")?.toLowerCase())}
          </span>
        </div>
        <div className="border-t border-[#D9D9D9] max-sm:text-sm mt-2 pt-2 flex justify-between font-semibold">
          <span>{t("Total")}</span>
          <span>AED {Number(order?.total).toFixed(2)}</span>
        </div>
      </div>

      <div className="border rounded-lg border-[#D9D9D9] md:p-6 p-3 capitalize">
        <h2 className="sm:text-lg mb-4">
          {t("Delivery Information")}
        </h2>
        <div className="flex flex-col gap-3 max-md:text-sm">
          <p className="flex gap-1 justify-between">
            <span className="font-medium">{t("Customer Name")} </span>
            {`${order?.shippingAddress?.firstName} ${order?.shippingAddress?.lastName}` ||
              "--"}
          </p>
          <p className="flex gap-1 justify-between">
            <span className="font-medium">{t("Mobile Number")} </span>
            {order?.shippingAddress?.phone || "--"}
          </p>
          <p className="flex gap-1 justify-between">
            <span className="font-medium">{t("Address")} </span>
            <span className="text-end">
              {order?.shippingAddress?.addressLine1 || "--"}
            </span>
          </p>
          {order?.courierServiceProvider && (
            <>
              <p className="flex gap-1 justify-between">
                <span className="font-medium">{t("Courier Provider")} </span>
                <span className="flex items-center gap-1">
                  <Link href="https://www.smsaexpress.com/" target="_blank" className="underline">{order?.courierServiceProvider || "--"}</Link>
                  <FiExternalLink />
                </span>
              </p>
              <p className="flex gap-1 justify-between">
                <span className="font-medium">{t("Tracking ID")} </span>
                {order?.trackingId || "--"}
              </p>
            </>
          )}
        </div>
      </div>

      {order?.notes && (
        <div className="border rounded-lg border-[#D9D9D9] p-6 space-y-2 capitalize">
          <h2 className="sm:text-lg mb-3 border-[#D9D9D9]">
            {t(" Order Note")}
          </h2>
          <p className="">
            {order?.notes}
          </p>
        </div>
      )}

      {order?.cancelledBy && (
        <div className="border rounded-lg border-[#D9D9D9] p-6 space-y-2 capitalize">
          <h2 className="sm:text-lg border-b pb-4 mb-5 border-[#D9D9D9]">
            {t("Cancellation")}
          </h2>
          <p className="">
            <span className="font-medium max-md:text-sm">
              {t("Cancelled By")}:
            </span>{" "}
            {order?.cancelledBy === "user" ? t("You") : t("Platform")}
          </p>
          <p className="">
            <span className="font-medium max-md:text-sm">{t("Reason")}:</span>{" "}
            {order?.cancellationReason ?? "---"}
          </p>
        </div>
      )}
      {/* 💳 Payment / Refund Section */}
      {order?.refund && (
        <div className="border rounded-lg border-[#D9D9D9] p-6 space-y-2 capitalize">
          <h2 className="sm:text-lg border-b border-[#D9D9D9] pb-4 mb-5">
            {t("Refund")}
          </h2>
          {order?.refund.refundedAmount && (
            <p className="">
              <span className="font-medium max-md:text-sm">
                {t("Refunded Amount")}:
              </span>{" "}
              AED {Number(order?.refund.refundedAmount || 0).toFixed(2)}
            </p>
          )}
          {order?.refund.type && (
            <p className="">
              <span className="font-medium max-md:text-sm">{t("Type")}:</span>{" "}
              {t(order?.refund.type) ?? "---"}
            </p>
          )}
          <p className="">
            <span className="font-medium max-md:text-sm">{t("Status")}:</span>
            <span
              className={`text-[12px] ms-2 uppercase p-2 rounded-md
    ${order?.refund.status === "pending"
                  ? "bg-[#FFF5D4] text-[#E2B41D]" // amber/orange
                  : order?.refund.status === "approved"
                    ? "bg-[#CEFFD5] text-[#1E9C31]" // green
                    : order?.refund.status === "rejected"
                      ? "bg-[#FFD3D3] text-[#C22121]" // red
                      : "bg-[#c0c0c073] text-gray-500"
                }`}
            >
              {t(order?.refund.status)}
            </span>
          </p>
          {order?.refund?.userReason && (
            <p className="">
              <span className="font-medium max-md:text-sm">{t("Reason")}:</span>{" "}
              {order?.refund?.userReason ?? "---"}
            </p>
          )}
          {order?.refund.platformReason && (
            <p className="">
              <span className="font-medium max-md:text-sm">
                {t("Platform Reason")}:
              </span>{" "}
              {t(order?.refund.platformReason) ?? "---"}
            </p>
          )}

          {order?.refund.attachments?.length > 0 && (
            <div className="mt-3">
              <p className="font-medium">{t("Attachments")}:</p>
              <div className="flex gap-3 mt-2">
                {order?.refund.attachments.map((url: string, i: number) => (
                  <div key={i} className="relative w-24 h-24">
                    <img
                      src={url}
                      alt="Refund attachment"

                      className="object-cover rounded-lg border absolute inset-0 w-full h-full "
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <OrderCancelModal id={orderId} onClose={handleCloseModal} />
      )}
      {showRefundModal && (
        <OrderRefundModal id={orderId} onClose={handleCloseModal} />
      )}
    </div>
  );
}
