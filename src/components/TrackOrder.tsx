"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa6";
import Button from "./Button";
import TextField from "./TextField";
import Spinner from "./Spinner";
import { useTrackOrder } from "../hooks/orders/useTrackOrder";
import { TrackOrderInput } from "../ts-types/generated";
import { formatPrice } from "../utils/formatPrice";
import { useAppRouter } from "@/src/hooks/useAppRouter";

export default function TrackOrder() {
  const { t, i18n } = useTranslation();
  const router = useAppRouter();
  const { mutate, isPending } = useTrackOrder();
  const [order, setOrder] = useState<any>(null);

  // Payment return URL used to land here — send users to thank-you instead
  useEffect(() => {
    const orderId = String(
      router.query.orderId || router.query.order_id || "",
    ).trim();
    const success = String(router.query.success || "").toLowerCase();
    if (orderId && (success === "true" || success === "1" || success === "false" || success === "0")) {
      router.replace(`/thank-you?orderId=${orderId}&success=${success}`);
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackOrderInput>();

  const getTranslation = (
    translations: any[],
    key: "name" | "description",
  ) => {
    if (!translations || translations.length === 0) return "";
    const ar = translations.find((tr) => tr.language === "ar");
    const en = translations.find((tr) => tr.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] || translations[0]?.[key] || "";
  };

  const onSubmit = (values: TrackOrderInput) => {
    mutate(values, {
      onSuccess: (res) => {
        setOrder(res?.data ?? null);
      },
      onError: () => {
        setOrder(null);
      },
    });
  };

  const currency = order?.chargedCurrency || "AED";
  const price = (n?: number | string | null) =>
    formatPrice(Number(n), currency, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  let allStates = ["paid", "processing", "shipped", "delivered"];

  if (order?.status === "cancelled") {
    const newStates: string[] = [];
    allStates.forEach((s) => {
      newStates.push(s);
      if (s === "processing") newStates.push("cancelled");
    });
    allStates = newStates;
  }

  const activeStates = new Set(
    order?.orderTrackings?.map((tr: any) => tr.state),
  );

  if (order?.paymentMethod === "PAYMENNT" && activeStates.has("processing")) {
    activeStates.add("paid");
  }

  if (order?.status === "cancelled" && activeStates.has("cancelled")) {
    activeStates.add("cancelled");
  }

  const statusLabels: Record<string, string> = {
    paid: t("Paid"),
    processing: t("Processing"),
    shipped: t("Shipped"),
    delivered: t("Delivered"),
    cancelled: t("Cancelled"),
  };

  return (
    <section className="py-12 px-3 heroBanner lg:min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="container max-w-5xl">
        <div className="border md:px-8 md:py-11 px-3 py-5 mb-10">
          <h1 className="authHeading">{t("Track Order")}</h1>
          <p className="authPara">
            {t(
              "Enter your email and order tracking ID to view your order status and details.",
            )}
          </p>

          <form
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              {...register("email", {
                required: t("Email is required"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("Please enter a valid email address"),
                },
              })}
              error={errors.email?.message}
              label={t("Email address")}
              placeholder={t("Please enter your email")}
            />
            <TextField
              {...register("orderTrackingId", {
                required: t("Tracking ID is required"),
              })}
              error={errors.orderTrackingId?.message}
              label={t("Order Tracking ID")}
              placeholder={t("Enter your order tracking ID")}
            />
            <div className="md:col-span-2">
              <Button
                text={isPending ? t("Tracking...") : t("Track Order")}
                type="submit"
                className="w-full !capitalize"
                btnTheme="dark"
                loading={isPending}
              />
            </div>
          </form>
        </div>

        {/* {isPending && !order ? <Spinner className="mt-10" /> : null} */}

        {order ? (
          <div className="md:space-y-10 space-y-5">
            <div className="relative w-full mt-4">
              <div className="absolute md:top-[12px] top-[10px] left-1/2 -translate-x-1/2 md:w-[calc(100%-60px)] w-[calc(100%-50px)] h-0 border-b-2 border-dashed border-gray-300 z-0" />

              <div className="flex justify-between relative z-10">
                {allStates.map((s, index) => {
                  const isActive = activeStates.has(s);
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

            <div>
              <h2 className="md:text-xl text-lg mb-4">{t("Products")}</h2>
              <div className="border rounded-lg divide-y divide-[#D9D9D9] border-[#D9D9D9]">
                {order?.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 md:p-4 p-3"
                  >
                    <div className="relative md:w-20 md:h-20 w-[50px] h-[50px] flex-shrink-0">
                      <img
                        src={
                          item?.selections?.find(
                            (v: any) =>
                              v?.productVariantValue?.imageUrls?.length > 0,
                          )?.productVariantValue?.imageUrls?.[0] ||
                          item?.productImageUrls?.[0] ||
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
                      <h3 className="font-semibold max-sm:text-sm">
                        {getTranslation(item?.translations, "name")}
                      </h3>
                      <p className="mt-1 text-sm max-sm:text-[12px] flex gap-1 flex-wrap text-[#C4C8C2] dark:text-[#465240]">
                        {t("Quantity")}:{" "}
                        <span className="font-medium">{item.quantity}</span>
                        {item?.selections?.length > 0 && (
                          <span className="mx-1 text-gray-600 dark:text-[#465240]">
                            |
                          </span>
                        )}
                        {item?.selections?.map((v: any, i: number) => (
                          <span key={i} className="contents">
                            <span className="sm:text-sm text-[12px] text-gray-600 dark:text-[#465240]">
                              {getTranslation(v?.variantTranslations, "name")}:{" "}
                              {getTranslation(
                                v?.variantValueTranslations,
                                "name",
                              )}
                            </span>
                            {item?.selections?.length - 1 !== i && (
                              <span className="mx-1 text-gray-600 dark:text-[#465240]">
                                |
                              </span>
                            )}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold max-sm:text-[12px]">
                        {price(item.finalAmountPerUnit)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg border-[#D9D9D9] md:p-6 p-3 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h2 className="md:text-lg">{t("Order Summary")}</h2>
                <span
                  className={`text-[12px] uppercase p-2 rounded-md
    ${
      order?.status === "unpaid"
        ? "bg-[#c0c0c073] text-gray-500"
        : order?.status === "processing"
          ? "bg-[#20b6ed54] text-[#20b6ed]"
          : order?.status === "pending_confirmation"
            ? "bg-[#FFF5D4] text-[#E2B41D]"
            : order?.status === "shipped"
              ? "bg-[#FFF5D4] text-[#E2B41D]"
              : order?.status === "delivered"
                ? "bg-[#CEFFD5] text-[#1E9C31]"
                : order?.status === "cancelled"
                  ? "bg-[#FFD3D3] text-[#C22121]"
                  : order?.status === "refunded"
                    ? "bg-[#8a5cf65d] text-[#8B5CF6]"
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
              {order?.orderTrackingId && (
                <div className="flex justify-between max-md:text-sm">
                  <span>{t("Order Tracking ID")}</span>
                  <span>{order.orderTrackingId}</span>
                </div>
              )}
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
                    .replace(" at ", " | ")}
                </span>
              </div>
              <div className="flex justify-between max-md:text-sm">
                <span>{t("Subtotal")}</span>
                <span>{price(order?.subtotal)}</span>
              </div>
              {Number(order?.discountedAmount) > 0 && (
                <div className="flex justify-between max-md:text-sm">
                  <span>{t("Discount")}</span>
                  <span>- {price(order?.discountedAmount)}</span>
                </div>
              )}
              <div className="flex justify-between max-md:text-sm">
                <span>{t("VAT")}</span>
                <span>{order?.taxPercentage}%</span>
              </div>
              <div className="flex justify-between max-md:text-sm">
                <span>{t("Shipping Fee")}</span>
                <span>{price(order?.shippingFee)}</span>
              </div>
              <div className="flex justify-between max-md:text-sm capitalize">
                <span>{t("Payment Method")}</span>
                <span>
                  {order?.paymentMethod === "PAYMENNT"
                    ? t("Credit / Debit Card")
                    : t(
                        order?.paymentMethod
                          ?.split("_")
                          ?.join(" ")
                          ?.toLowerCase(),
                      )}
                </span>
              </div>
              <div className="border-t border-[#D9D9D9] max-sm:text-sm mt-2 pt-2 flex justify-between font-semibold">
                <span>{t("Total")}</span>
                <span>{price(order?.total)}</span>
              </div>
            </div>

            <div className="border rounded-lg border-[#D9D9D9] md:p-6 p-3 capitalize">
              <h2 className="sm:text-lg mb-4">{t("Delivery Information")}</h2>
              <div className="flex flex-col gap-3 max-md:text-sm">
                <p className="flex gap-1 justify-between">
                  <span className="font-medium">{t("Customer Name")}</span>
                  {`${order?.shippingAddress?.firstName ?? ""} ${order?.shippingAddress?.lastName ?? ""}`.trim() ||
                    "--"}
                </p>
                <p className="flex gap-1 justify-between">
                  <span className="font-medium">{t("Mobile Number")}</span>
                  {order?.shippingAddress?.phone || "--"}
                </p>
                <p className="flex gap-1 justify-between">
                  <span className="font-medium">{t("Address")}</span>
                  <span className="text-end">
                    {[
                      order?.shippingAddress?.addressLine1,
                      order?.shippingAddress?.addressLine2,
                      order?.shippingAddress?.city,
                      order?.shippingAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "--"}
                  </span>
                </p>
                {order?.courierServiceProvider && (
                  <>
                    <p className="flex gap-1 justify-between">
                      <span className="font-medium">
                        {t("Courier Provider")}
                      </span>
                      {order?.courierServiceProvider || "--"}
                    </p>
                    <p className="flex gap-1 justify-between">
                      <span className="font-medium">{t("Tracking ID")}</span>
                      {order?.trackingId || "--"}
                    </p>
                  </>
                )}
              </div>
            </div>

            {order?.cancelledBy && (
              <div className="border rounded-lg border-[#D9D9D9] p-6 space-y-2 capitalize">
                <h2 className="sm:text-lg border-b pb-4 mb-5 border-[#D9D9D9]">
                  {t("Cancellation")}
                </h2>
                <p>
                  <span className="font-medium max-md:text-sm">
                    {t("Cancelled By")}:
                  </span>{" "}
                  {order?.cancelledBy === "user" ? t("You") : t("Platform")}
                </p>
                <p>
                  <span className="font-medium max-md:text-sm">
                    {t("Reason")}:
                  </span>{" "}
                  {order?.cancellationReason ?? "---"}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
