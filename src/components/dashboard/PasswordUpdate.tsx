"use client";

import React from "react";
import DashboardSecHd from "./DashboardSecHd";
import TextField from "../TextField";
import Button from "../Button";
import { useForm } from "react-hook-form";
import { ChangePasswordTypes } from "@/src/ts-types/generated";
import { useChangePassword } from "@/src/hooks/useChangePassword";
import { useTranslation } from "react-i18next";

export default function PasswordUpdate() {
  const { t } = useTranslation();
  const { mutate, isPending } = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordTypes>();

  const onSubmit = (values: ChangePasswordTypes) => {
    const { confirmPassword, ...payload } = values;
    mutate(payload);
  };

  const password = watch("newPassword");

  return (
    <div className="md:my-20 my-10">
      <DashboardSecHd text={t("Change Password")} />
      <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("oldPassword", { required: t("Password is required") })}
          placeholder={t("Current Password")}
          className="mb-6"
          error={errors?.oldPassword && errors?.oldPassword?.message}
        />
        <TextField
          {...register("newPassword", {
            required: t("Password is required"),
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s])\S{8,}$/,
              message: t(
                "Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character"
              ),
            },
          })}
          placeholder={t("New Password")}
          className="mb-6"
          error={errors?.newPassword && errors?.newPassword?.message}
        />
        <TextField
          {...register("confirmPassword", {
            required: t("Please confirm your password"),
            validate: (value) =>
              value === password || t("Passwords do not match"),
          })}
          placeholder={t("Confirm New Password")}
          className="mb-6"
          error={errors?.confirmPassword && errors?.confirmPassword?.message}
        />
        <Button
          text={t("Save Changes")}
          loading={isPending}
          type="submit"
          className="ml-auto"
          btnTheme="dark"
        />
      </form>
    </div>
  );
}
