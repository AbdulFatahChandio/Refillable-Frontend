"use client";

import React from "react";
import TextField from "../TextField";
import Button from "../Button";
import { useUserSignUp } from "@/src/hooks/useUserSignUp";
import { LoginInputTypes } from "@/src/ts-types/generated";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useSendOtp } from "@/src/hooks/useSendOtp";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function SignupForm() {
  const router = useAppRouter();
  const { t } = useTranslation();
  const { mutate, isPending } = useUserSignUp();
  const { mutate: sendOtp } = useSendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginInputTypes & { confirmPassword: string; agree: boolean }>({
    mode: "onBlur",
  });

  const onSubmit = (
    values: LoginInputTypes & { confirmPassword: string; agree: boolean }
  ) => {
    const { confirmPassword, agree, ...payload } = values;

    mutate(payload, {
      onSuccess: async (data) => {
        toast.success(t(data.message));
        // toast.info(t("OTP sent to your email!"));
        localStorage.setItem("userEmail", payload.email);
        router.push("/verify");

        // sendOtp(
        //   { email: payload.email, purpose: "SIGNUP" },
        //   {
        //     onSuccess: (otpRes) => {
        //       toast.info(otpRes.message || t("OTP sent to your email!"));
        //       router.push("/verify");
        //     },
        //     onError: (error: any) => {
        //       toast.error(
        //         error?.response?.data?.message || t("Failed to send OTP")
        //       );
        //     },
        //   }
        // );
      },
    });
  };

  const password = watch("password");

  return (
    <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label={t("First Name")}
        type="firstName"
        placeholder={t("Enter your first name")}
        className="mb-6"
        {...register("firstName", {
          required: t("First name is required"),
        })}
        error={errors.firstName && errors.firstName.message}
      />
      <TextField
        label={t("Last Name")}
        type="lastName"
        placeholder={t("Enter your last name")}
        className="mb-6"
        {...register("lastName", {
          required: t("Last name is required"),
        })}
        error={errors.lastName && errors.lastName.message}
      />
      <TextField
        label={t("Email address")}
        type="email"
        placeholder={t("Enter your email")}
        className="mb-6"
        {...register("email", {
          required: t("Email is required"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
          },
        })}
        error={errors.email && errors.email.message}
      />
      <TextField
        label={t("Password")}
        type="password"
        placeholder={t("Enter your password")}
        className="mb-6"
        {...register("password", {
          required: t("Password is required"),
          pattern: {
            value:
              /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s])\S{8,}$/,
            message:
              t("Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character"),
          },
        })}
        error={errors.password && errors.password.message}
      />
      <TextField
        label={t("Confirm Password")}
        type="password"
        placeholder={t("Enter your confirm password")}
        className="mb-6"
        {...register("confirmPassword", {
          required: t("Please confirm your password"),
          validate: (value) => value === password || t("Passwords do not match"),
        })}
        error={errors.confirmPassword && errors.confirmPassword.message}
      />
      <div className="mb-6">
        <label
          htmlFor="agree"
          className="md:text-sm text-[12px] flex items-center gap-2 [&_a]:underline [&_a]:capitalize [&_a]:font-medium"
        >
          <input
            className="accent-black size-4"
            type="checkbox"
            id="agree"
            {...register("agree", {
              required: t("Please agree to the terms to continue"),
            })}
          />
          <p>
            {t("Agree to")}{" "}
            <Link href="/terms-and-conditions">{t("terms and conditions")}</Link>{" "}
            {t("and")}{" "}
            <Link href="/privacy-policy">{t("privacy policy")}</Link>
          </p>
        </label>
        {errors.agree && (
          <p className="!text-red-500 md:text-sm text-[12px] mt-2 block text-start">{errors.agree.message}</p>
        )}
      </div>
      <Button
        text={t("Create account")}
        loading={isPending}
        type="submit"
        className="w-full !capitalize"
        btnTheme="dark"
      />
    </form>
  );
}
