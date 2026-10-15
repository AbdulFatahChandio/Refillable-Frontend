"use client";

import React, { useEffect, useState } from "react";
import TextField from "../TextField";
import Button from "../Button";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useVerifyOtp } from "@/src/hooks/useVerifyOtp";
import { VerifyOtpTypes } from "@/src/ts-types/generated";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUserStore } from "@/src/store/useUserStore";
import { getOrCreateDeviceToken } from "@/src/utils/deviceToken";
import { getFcmToken } from "@/firebase";
import Cookies from "js-cookie";
import { useSendOtp } from "@/src/hooks/useSendOtp";
import { useTranslation } from "react-i18next";

export default function VerifyForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState<any>("");

  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    setEmail(userEmail);
  }, []);

  const [deviceToken, setDeviceToken] = useState<string>("");
  const [fcmToken, setFcmToken] = useState<string>("");

  const router = useAppRouter();

  const method = router.query.method;

  const { setUser } = useUserStore();

  useEffect(() => {
    const token = getOrCreateDeviceToken();
    setDeviceToken(token);
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getFcmToken();
      setFcmToken(token || "");
      localStorage.setItem("fcmToken", token || "");
    };

    fetchToken();
  }, []);

  const { mutate, isPending } = useVerifyOtp();
  const { mutate: resendOtpMutate, isPending: resendLoading } = useSendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerifyOtpTypes>({
    mode: "onBlur",
  });

  const onSubmit = (values: VerifyOtpTypes) => {
    const payload = {
      ...values,
      email,
      deviceId: deviceToken,
      fcmToken,
      purpose: method ? "PASSWORD_RESET" : "SIGNUP",
    };

    mutate(payload, {
      onSuccess: async (data) => {
        toast.success(t(data.message));

        if (method) {
          localStorage.setItem("otp", payload.otp);
          router.push("/reset-password");
        } else {
          const token = data?.meta?.accessToken;

          if (token) {
            // Save token in cookie (7 din ke liye)
            Cookies.set("_ca", token, {
              expires: 7,
              secure: true,
              sameSite: "strict",
            });
          }
          setUser(data.data);
          localStorage.removeItem("userEmail");
          router.push("/dashboard/profile-management");
        }
      },
    });
  };

  const handleResend = () => {
    resendOtpMutate(
      {
        email,
        purpose: method ? "PASSWORD_RESET" : "SIGNUP",
      },
      {
        onSuccess: () => {
          toast.success(t("OTP resent successfully!"));
          setTimer(60);
        },
      }
    );
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <>
      <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label={t("Verification Code")}
          placeholder={t("Enter Your Verification Code")}
          type="text"
          inputMode="numeric"
          className="mb-6"
          {...register("otp", {
            required: t("Otp is required"),
            pattern: {
              value: /^[0-9]+$/,
              message: t("Only numbers are allowed"),
            },
            minLength: { value: 6, message: t("OTP must be 6 digits") },
            maxLength: { value: 6, message: t("OTP must be 6 digits") },
          })}
          onInput={(e: any) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
          error={errors.otp && errors.otp.message}
        />

        <Button
          text={t("Verify")}
          type="submit"
          loading={isPending}
          className="w-full !capitalize"
          btnTheme="dark"
        />
      </form>
      <p className="2xl:text-[18px] text-sm text-center mt-7 text-[#ffffffcc] dark:text-primary">
        {t("Haven’t received a code?")}{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0}
          className="text-primary underline disabled:!cursor-not-allowed font-medium"
        >
          {timer > 0 ? `${t("Resend in")} ${timer}s` : t("Resend")}
        </button>
      </p>
    </>
  );
}
