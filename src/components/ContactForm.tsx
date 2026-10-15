"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { IoCloudUploadOutline } from "react-icons/io5";
import { isValidPhoneNumber } from "react-phone-number-input";
import Button from "./Button";
import TextField from "./TextField";
import PhoneNumberField from "./phone-number-field";
import { useContact } from "../hooks/useContact";
import { useUploadFile } from "../hooks/useUploadFile";
import { useDeleteFile } from "../hooks/useDeleteFile";
import { ContactTypes } from "../ts-types/generated";
import { useTranslation } from "react-i18next";

export default function ContactForm() {
  const { t } = useTranslation();
  const { mutate, isPending } = useContact();
  const { mutate: uploadMutate, isPending: isUploading } = useUploadFile();
  const { mutate: deleteMutate } = useDeleteFile();
  const [imageUrl, setImageUrl] = useState<string>("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ContactTypes>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    uploadMutate(files.slice(0, 1), {
      onSuccess: (res) => {
        const url = res?.data?.[0]?.image;
        if (url) setImageUrl(url);
      },
    });

    e.target.value = "";
  };

  const handleDeleteImage = () => {
    if (!imageUrl) return;
    deleteMutate(imageUrl, {
      onSuccess: () => setImageUrl(""),
    });
  };

  const onSubmit = (values: ContactTypes) => {
    mutate(
      { ...values, imageUrl: imageUrl || undefined },
      {
        onSuccess: () => {
          reset();
          setImageUrl("");
        },
      },
    );
  };

  return (
    <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <TextField
          {...register("firstName", { required: t("First Name is required") })}
          error={errors.firstName && errors.firstName?.message}
          label={t("First Name")}
          placeholder={t("Please enter your first name")}
          className="mb-6"
        />
        <TextField
          {...register("lastName", { required: t("Last Name is required") })}
          error={errors.lastName && errors.lastName?.message}
          label={t("Last Name")}
          placeholder={t("Please enter your last name")}
          className="mb-6"
        />
      </div>
      <TextField
        {...register("email", {
          required: t("Email is required"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("Please enter a valid email address"),
          },
        })}
        error={errors.email && errors.email?.message}
        label={t("Email address")}
        placeholder={t("Please enter your email")}
        className="mb-6"
      />
      <Controller
        name="contactNumber"
        control={control}
        rules={{
          required: t("Phone Number is required"),
          validate: (value) =>
            isValidPhoneNumber(value || "") || t("Invalid phone number"),
        }}
        render={({ field, fieldState }) => (
          <PhoneNumberField
            label={t("Contact Number")}
            labelClassName="!text-light-gray font-semibold mb-1 max-2xl:text-sm"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            mainClassName="mb-6"
          />
        )}
      />
      <TextField
        {...register("subject", { required: t("Subject is required") })}
        error={errors.subject && errors.subject?.message}
        label={t("Subject")}
        placeholder={t("Please enter your subject")}
        className="mb-6"
      />
      <TextField
        type="textarea"
        {...register("message")}
        error={errors.message && errors.message?.message}
        label={`${t("Message")} (${t("optional")})`}
        placeholder={t("Please enter your message")}
        className="mb-6"
      />
      <label
        htmlFor="contact-image"
        className="p-2 cursor-pointer border-dashed border border-light-brown text-light-gray w-full mb-5 max-sm:text-[12px] block text-center"
      >
        <input
          type="file"
          id="contact-image"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <IoCloudUploadOutline className="mx-auto md:size-7 size-4 mb-2" />
        {isUploading
          ? t("Uploading...")
          : `${t("Upload Image")} (${t("optional")})`}
      </label>
      {imageUrl && (
        <div className="relative mb-6 w-fit">
          <Image
            src={imageUrl}
            alt="uploaded"
            width={80}
            height={80}
            className="rounded object-cover w-[80px] h-[80px]"
          />
          <button
            type="button"
            onClick={handleDeleteImage}
            className="absolute -top-2 -right-2 bg-red-600 w-6 h-6 text-white rounded-full text-xs"
          >
            ✕
          </button>
        </div>
      )}
      <Button
        text={isPending ? t("Sending...") : t("Submit")}
        type="submit"
        className="w-full !capitalize"
        btnTheme="dark"
      />
    </form>
  );
}
