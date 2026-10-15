"use client";

import React from "react";
import TextField from "../TextField";
import Button from "../Button";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useSendOtp } from "@/src/hooks/useSendOtp";
import { useForm } from "react-hook-form";
import { SendOtpTypes } from "@/src/ts-types/generated";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordForm() {
  const router = useAppRouter();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendOtpTypes>({
    mode: "onBlur",
  });

  const { mutate, isPending } = useSendOtp();

  const onSubmit = (values: SendOtpTypes) => {
    const payload = {
      ...values,
      purpose: "PASSWORD_RESET",
    };
    mutate(payload, {
      onSuccess: async (data) => {
        toast.success(t(data?.message));

        localStorage.setItem("userEmail", payload.email);

        router.push("/verify?method=resetpassword");
      },
    });
  };

  return (
    <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register("email", {
          required: t("Email is required"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
          },
        })}
        label={t("Email Address")}
        placeholder={t("Enter your email")}
        className="mb-6"
        error={errors.email && errors.email.message}
      />
      <Button text={t("Next")} loading={isPending} type="submit" className="w-full !capitalize"
      btnTheme="dark" />
    </form>
  );
}
