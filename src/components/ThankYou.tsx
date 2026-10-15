"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { GoArrowRight } from "react-icons/go";
import { HiOutlineMail, HiOutlineTruck } from "react-icons/hi";
import { IoCheckmark } from "react-icons/io5";
import { toast } from "react-toastify";
import Button from "./Button";
import Spinner from "./Spinner";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useUserStore } from "@/src/store/useUserStore";
import { useCartStore } from "@/src/store/useCartStore";
import api from "@/src/utils/api/axios";

export default function ThankYou() {
  const { t } = useTranslation();
  const router = useAppRouter();
  const { isLoggedIn } = useUserStore();
  const { clearCart } = useCartStore();
  const confirmedRef = useRef(false);

  const orderId = String(
    router.query.orderId || router.query.order_id || router.query.id || "",
  ).trim();
  const successParam = String(router.query.success ?? "").toLowerCase();
  const isPaymentSuccess =
    successParam === "true" || successParam === "1";
  const isPaymentFailure =
    successParam === "false" || successParam === "0";
  const hasSuccessParam = isPaymentSuccess || isPaymentFailure;
  const isCod =
    String(router.query.method || "").toLowerCase() === "cod" ||
    String(router.query.skipConfirm || "") === "1";

  const [status, setStatus] = useState<"loading" | "success" | "error">(() => {
    if (isCod) return "success";
    if (isPaymentFailure) return "error";
    if (orderId && (isPaymentSuccess || !hasSuccessParam)) return "loading";
    return "success";
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isPaymentSuccess) {
      clearCart();
    }
  }, [isPaymentSuccess, clearCart]);

  useEffect(() => {
    if (isCod) {
      setStatus("success");
      clearCart();
      return;
    }

    // success=false → failure UI only, API skip
    if (isPaymentFailure) {
      setStatus("error");
      return;
    }

    if (!orderId) {
      setStatus("success");
      return;
    }

    const confirmPayment = async () => {
      try {
        await api.patch(`/public/orders/${orderId}/payment-succeeded`);
        clearCart();
        setStatus("success");
        toast.success(t("Thank you! Your order has been placed."));
      } catch {
        setStatus("error");
        toast.error(t("Payment Failed"));
      }
    };

    // success=true → API call
    if (isPaymentSuccess) {
      if (confirmedRef.current) return;
      confirmedRef.current = true;
      void confirmPayment();
      return;
    }

    // Legacy: orderId without success param
    if (confirmedRef.current) return;
    confirmedRef.current = true;
    void confirmPayment();
  }, [orderId, isCod, isPaymentFailure, isPaymentSuccess, clearCart, t]);

  useEffect(() => {
    if (status === "loading") return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [status]);

  const handleTrack = () => {
    if (!isLoggedIn) {
      router.push("/track-order");
    } else {
      router.push(`/track-order?orderId=${orderId}`);
    }
  };

  if (status === "loading") {
    return (
      <section className="relative flex min-h-[calc(100dvh-180px)] items-center justify-center overflow-hidden bg-[#FBF4E2] px-3 py-16">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-sm tracking-wide text-brown/70">
            {t("Confirming your order…", {
              defaultValue: "Confirming your order…",
            })}
          </p>
        </div>
      </section>
    );
  }

  const isError = status === "error";

  return (
    <section className="relative flex min-h-[calc(100dvh-180px)] items-center justify-center overflow-hidden px-4 py-14 md:py-20">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#FBF4E2_0%,#FCFAF7_45%,#F7DDA6_120%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 start-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,221,166,0.55)_0%,transparent_70%)] md:h-[560px] md:w-[560px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brown/25 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brown/20 to-transparent"
      />

      <div
        className={`relative z-10 mx-auto w-full max-w-2xl transition-all duration-700 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="text-center">
          {/* Brand */}
          

          {/* Success / error mark */}
          <div className="mx-auto mb-7 flex justify-center md:mb-9">
            <div
              className={`relative flex size-20 items-center justify-center rounded-full md:size-24 ${
                isError
                  ? "bg-red-50 ring-1 ring-red-200"
                  : "bg-white/80 ring-1 ring-brown/15 shadow-[0_12px_40px_rgba(109,73,23,0.12)]"
              }`}
            >
              {!isError && (
                <span
                  aria-hidden
                  className="absolute inset-[-6px] animate-[ping_1.6s_ease-out_1] rounded-full border border-brown/20"
                />
              )}
              {isError ? (
                <span className="font-cormorant text-3xl text-red-500 md:text-4xl">
                  !
                </span>
              ) : (
                <IoCheckmark className="size-10 text-brown md:size-12" strokeWidth={1.5} />
              )}
            </div>
          </div>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-light-brown md:text-[11px]">
            {isError
              ? t("Payment status", { defaultValue: "Payment status" })
              : t("Order confirmed", { defaultValue: "Order confirmed" })}
          </p>

          <h1 className="font-cormorant text-[2.35rem] leading-[1.1] text-primary md:text-5xl lg:text-[3.4rem]">
            {isError
              ? t("Payment Failed")
              : t("Thank You for Your Order")}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-light-gray md:mt-5 md:text-base">
            {isError
              ? t(
                  "We could not confirm your payment. If money was deducted, contact support with your order details.",
                  {
                    defaultValue:
                      "We could not confirm your payment. If money was deducted, contact support with your order details.",
                  },
                )
              : t(
                  "Your order has been placed successfully. A confirmation email has been sent with your order details.",
                  {
                    defaultValue:
                      "Your order has been placed successfully. A confirmation email has been sent with your order details.",
                  },
                )}
          </p>

          {/* {orderId && (
            <div className="mt-7 inline-flex flex-col items-center gap-1 border border-brown/20 bg-white/50 px-6 py-3 backdrop-blur-sm md:mt-8">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-light-brown">
                {t("Order ID", { defaultValue: "Order ID" })}
              </span>
              <span className="font-medium tracking-wide text-primary md:text-lg">
                #{orderId}
              </span>
            </div>
          )} */}

          {!isError && (
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 gap-4 border-y border-brown/10 py-6 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-brown/10">
              <div className="flex flex-col items-center gap-2 px-4 text-center">
                <HiOutlineMail className="size-5 text-brown" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  {t("Email receipt", { defaultValue: "Email receipt" })}
                </p>
                <p className="text-xs leading-snug text-light-gray">
                  {t("Check your inbox for order details", {
                    defaultValue: "Check your inbox for order details",
                  })}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 px-4 text-center">
                <HiOutlineTruck className="size-5 text-brown" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  {t("We are packing", { defaultValue: "We are packing" })}
                </p>
                <p className="text-xs leading-snug text-light-gray">
                  {t("We'll notify you when it ships", {
                    defaultValue: "We'll notify you when it ships",
                  })}
                </p>
              </div>
            </div>
          )}

          <div className="mt-9 flex w-full flex-col-reverse items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
            {isError ? (
              <>
                <Button
                  text={t("Continue Shopping")}
                  onClick={() => router.push("/collections")}
                  btnTheme="transparent"
                  className="!border-brown !px-6 !text-primary hover:!bg-brown hover:!text-secondary max-sm:w-full"
                />
                <Button
                  text={t("Contact Us", { defaultValue: "Contact Us" })}
                  onClick={() => router.push("/contact-us")}
                  btnTheme="dark"
                  className="!px-8 max-sm:w-full"
                />
              </>
            ) : (
              <>
                <Button
                  text={t("Continue Shopping")}
                  onClick={() => router.push("/collections")}
                  btnTheme="transparent"
                  className="!border-brown !px-6 !text-primary hover:!bg-brown hover:!text-secondary max-sm:w-full"
                />
                <Button
                  text={
                    <>
                      {t("Track My Order")}
                      <GoArrowRight className="ms-2 inline size-5 rtl:rotate-180" />
                    </>
                  }
                  onClick={handleTrack}
                  btnTheme="dark"
                  className="!px-8 max-sm:w-full"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
