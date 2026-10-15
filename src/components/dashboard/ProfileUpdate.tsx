"use client";

import React, { useEffect } from "react";
import DashboardSecHd from "./DashboardSecHd";
import TextField from "../TextField";
import Button from "../Button";
import { useUserStore } from "@/src/store/useUserStore";
import { useProfileUpdate } from "@/src/hooks/useProfileUpdate";
import { ProfileUpdateTypes } from "@/src/ts-types/generated";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PhoneNumberField from "../phone-number-field";
import { isValidPhoneNumber } from "react-phone-number-input";

export default function ProfileUpdate() {
  const { t } = useTranslation();
  const { user } = useUserStore();

  const { mutate, isPending } = useProfileUpdate();
  const { register, handleSubmit, control, reset } = useForm<ProfileUpdateTypes>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      phone: user?.phone || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const onSubmit = (values: ProfileUpdateTypes) => {
    mutate(values);
  };

  useEffect(() => {
    if (user) {
      reset({
        phone: user?.phone || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
      });
    }
  }, [user, reset]);

  return (
    <div>
      <DashboardSecHd text={t("Profile Management")} />
      <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("firstName")}
          // defaultValue={user?.firstName}
          placeholder={t("First Name")}
          className="mb-6"
        />
        <TextField
          {...register("lastName")}
          // defaultValue={user?.lastName}
          placeholder={t("Last Name")}
          className="mb-6"
        />
        <TextField
          name="email"
          disabled
          placeholder={t("Email Address")}
          defaultValue={user?.email}
          className="mb-6"
        />
        {/* <TextField
          type="number"
          {...register("phone")}
          placeholder={t("Phone Number")}
          defaultValue={user?.phone}
          className="mb-6"
        /> */}
        <Controller
          name="phone"
          control={control}
          rules={{
            validate: (value) =>
              !value || isValidPhoneNumber(value) || t("Invalid phone number"),
          }}

          render={({ field, fieldState }) => (
            <PhoneNumberField
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              mainClassName="mb-5"
            />
          )}
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
