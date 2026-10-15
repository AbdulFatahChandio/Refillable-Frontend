"use client";

import React, { useEffect, useState } from "react";
import TextField from "../TextField";
import Button from "../Button";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useForm } from "react-hook-form";
import { LoginInputTypes } from "@/src/ts-types/generated";
import { useUserSignIn } from "@/src/hooks/useUserSignIn";
import { getOrCreateDeviceToken } from "@/src/utils/deviceToken";
import { getFcmToken } from "@/firebase";
import { useUserStore } from "@/src/store/useUserStore";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

export default function SigninForm() {
  const [deviceToken, setDeviceToken] = useState<string>("");
  const [fcmToken, setFcmToken] = useState<string>("");
  const { t } = useTranslation();
  const router = useAppRouter();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputTypes>({
    mode: "onBlur",
  });
  const { mutate, isPending, isError, error, data } = useUserSignIn();

  const onSubmit = (values: LoginInputTypes) => {
    const payload = {
      ...values,
      deviceId: deviceToken,
      fcmToken,
      from: "front"
    };
    mutate(payload, {
      onSuccess: async (data) => {
        const token = data?.meta?.accessToken;

        if (token) {
          // Save token in cookie (7 din ke liye)
          Cookies.set("_ca", token, {
            expires: 1,
            secure: true,
            sameSite: "strict",
          });
        }

        toast.success(t(data.message));
        setUser(data.data);

        router.push("/dashboard/profile-management");
      },
      onError: (err: any) => {
        if (
          err.response?.data.message === "Please verify your email first. We have sent you an OTP."
        ) {
          localStorage.setItem("userEmail", payload.email);
          router.push("/verify");
        }
      },
    });
  };

  return (
    <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label={t("Email address")}
        {...register("email", {
          required: t("Email is required"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("Please enter a valid email address"),
          },
        })}
        placeholder={t("Enter your email")}
        className="mb-6"
        error={errors.email && errors.email.message}
      />
      <div className="relative">
        <TextField
          label={t("Password")}
          type="password"
          {...register("password", { required: t("Password is required") })}
          placeholder={t("Enter your password")}
          className="mb-6"
          error={errors.password && errors.password.message}
        />
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="text-brown absolute top-0 ltr:right-0 rtl:left-0 cursor-pointer font-medium max-2xl:text-sm"
        >
          {t("Forgot Password?")}
        </button>
      </div>
      <Button
        text={t("Login")}
        loading={isPending}
        type="submit"
        className="w-full !capitalize"
        btnTheme="dark"
      />
    </form>
  );
}
