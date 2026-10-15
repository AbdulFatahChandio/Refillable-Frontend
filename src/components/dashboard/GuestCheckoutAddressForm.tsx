"use client";

import React, { useEffect, useState } from "react";
import TextField from "../TextField";
import CustomSelect from "../custom-select/custom-select";
import Button from "../Button";
import { Controller, useForm } from "react-hook-form";
import { AddAddressTypes } from "@/src/ts-types/generated";
import { useGetAllCountries } from "@/src/hooks/useGetAllCountries";
import { useGetAllCitiesByCountry } from "@/src/hooks/useGetAllCitiesByCountry";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import PhoneNumberField from "../phone-number-field";
import { isValidPhoneNumber } from "react-phone-number-input";

export default function GuestCheckoutAddressForm({
  billing,
  onAddressChange,
  onShippingLocationChange,
}: {
  billing?: boolean;
  onAddressChange?: (address: any) => void;
  onShippingLocationChange?: (location: {
    country: string;
    city: string;
  }) => void;
}) {
  const { t } = useTranslation();



  const address = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(billing ? "guest_billing_addresses" : "guest_addresses") || "null")
    : null;


  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");


  const { data: countryResponse, isLoading } = useGetAllCountries();
  const { data: cityResponse, isLoading: isLoading2 } =
    useGetAllCitiesByCountry(selectedCountry);

  const countries = countryResponse?.data?.map((country: any) => ({
    value: String(country.id),
    label: country.name,
  }));
  const cities = cityResponse?.data?.map((city: any) => ({
    value: String(city.id),
    label: city.name,
  }));




  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    resetField,
  } = useForm<AddAddressTypes>({
    mode: "onBlur",
  });

  const onSubmit = (values: any) => {
    const countryLabel =
      countries?.find((c: any) => c.value === String(values.country))?.label ||
      "";
    const cityLabel =
      cities?.find((c: any) => c.value === String(values.city))?.label || "";

    const payload = {
      ...values,
      country: countryLabel,
      city: cityLabel,
    };
    const existingAddress = localStorage.getItem("guest_addresses");

    if (existingAddress) {
      // ✅ If exists → update/overwrite the address
      localStorage.setItem(billing ? "guest_billing_addresses" : "guest_addresses", JSON.stringify(payload));
      onAddressChange?.(payload)
      toast.success(t("Address updated successfully"));
    } else {
      // 🆕 If not exists → add new one
      localStorage.setItem(billing ? "guest_billing_addresses" : "guest_addresses", JSON.stringify(payload));
      onAddressChange?.(payload)
      toast.success(t("Address saved successfully"));
    }

  };

  useEffect(() => {
    if (!address) return;
    const matchedCountry = countries?.find(
      (c: any) => c.label === address?.country
    );

    reset({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      country: matchedCountry?.value || "",
      city: "",
      phone: address.phone || "",
      email: address.email || "",
    });

    setSelectedCountry(matchedCountry?.value || "");

  }, [countryResponse]);

  useEffect(() => {
    if (address) {
      const matchedCity = cities?.find((c: any) => c.label === address.city);

      if (matchedCity) {
        reset((prev) => ({
          ...prev,
          city: matchedCity.value || "",
        }));
      }
    }
  }, [cityResponse]);


  const deleteAddress = () => {
    localStorage.removeItem(billing ? "guest_billing_addresses" : "guest_addresses");
    onAddressChange?.(null);
    reset({
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      country: "",
      city: "",
      phone: "",
      email: "",
    });
    setSelectedCountry("");
    setSelectedCity("");
    toast.success(t("Address deleted successfully"));
  };


  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 md:gap-5 gap-3 [&_input]:py-3 [&_input]:px-3"
      >
        <div className="col-span-1">
          <TextField
            {...register("firstName", { required: t("First Name is required") })}
            placeholder={t("First Name")}
            error={errors.firstName && errors.firstName?.message}
          />
        </div>
        <div className="col-span-1">
          <TextField
            {...register("lastName", { required: t("Last Name is required") })}
            placeholder={t("Last Name")}
            error={errors.lastName && errors.lastName?.message}
          />
        </div>
        <div className="col-span-2">
          <TextField
            {...register("addressLine1", { required: t("Address is required") })}
            placeholder={t("Address line 1")}
            error={errors.addressLine1 && errors.addressLine1?.message}
          />
        </div>
        <div className="col-span-2">
          <TextField
            {...register("addressLine2")}
            placeholder={t("Address line 2")}
          />
        </div>

        <div className="md:col-span-1 col-span-2">
          <Controller
            key={selectedCountry || "country"}
            name="country"
            control={control}
            rules={{ required: t("Country is required") }}
            render={({ field }) => {
              // 🧠 Only render select if value is not undefined OR countries are loaded
              const selectedOption =
                countries?.find((c: any) => c.value === String(field.value)) ||
                countries?.find((c: any) => c.label === address?.country) ||
                null;

              // 🧠 Wait until value or options exist before rendering
              if (
                (address && field.value === undefined) ||
                (address && field.value === "" && !selectedOption)
              )
                return <div></div>;

              return (
                <CustomSelect
                  label=""
                  list={countries}
                  classNamePrefix="select2"
                  name="country"
                  placeholder={t("Country")}
                  value={selectedOption}
                  onChange={(selected: any) => {
                    field.onChange(String(selected.value));
                    setSelectedCountry(String(selected.value));
                    setSelectedCity("");
                    resetField("city");
                    if (!billing) {
                      const countryMeta = countryResponse?.data?.find(
                        (c: any) => String(c.id) === String(selected.value)
                      );
                      onShippingLocationChange?.({
                        country:
                          countryMeta?.code || selected.label || "",
                        city: "",
                      });
                    }
                  }}
                />
              );
            }}
          />

          {errors.country && (
            <p className="!text-red-500 text-sm mt-2">
              {errors.country.message}
            </p>
          )}
        </div>

        <div className="md:col-span-1 col-span-2">
          <Controller
            key={selectedCity || "city"}
            name="city"
            control={control}
            rules={{ required: t("City is required") }}
            render={({ field }) => {

              // 🧠 Only render select if value is not undefined OR countries are loaded
              const selectedOption =
                cities?.find((c: any) => c.value === String(field.value)) ||
                cities?.find((c: any) => c.label === address?.city) ||
                null;

              // 🧠 Wait until value or options exist before rendering
              if (
                (address && field.value === undefined) ||
                (address && field.value === "" && !selectedOption)
              )
                return <div></div>;

              return (
                <CustomSelect
                  label=""
                  list={cities}
                  classNamePrefix="select2"
                  name="city"
                  placeholder={t("City")}
                  value={selectedOption}
                  onChange={(selected: any) => {
                    field.onChange(String(selected.value));
                    setSelectedCity(String(selected.value));
                    if (!billing) {
                      const countryMeta = countryResponse?.data?.find(
                        (c: any) => String(c.id) === String(selectedCountry)
                      );
                      onShippingLocationChange?.({
                        country:
                          countryMeta?.code ||
                          countryMeta?.name ||
                          "",
                        city: selected.label || "",
                      });
                    }
                  }}
                />
              );
            }}
          />
          {errors.city && (
            <p className="!text-red-500 text-sm mt-2">{errors.city.message}</p>
          )}
        </div>
        <div className="md:col-span-1 col-span-2">
          {/* <TextField
            type="number"
            {...register("phone", { required: "Phone Number is required" })}
            placeholder={t("Phone Number")}
            error={errors.phone && errors.phone?.message}
          /> */}
          <Controller
            name="phone"
            control={control}
            rules={{
              required: t("Phone Number is required"),
              validate: (value) =>
                isValidPhoneNumber(value || "") || t("Invalid phone number"),
            }}

            render={({ field, fieldState }) => (
              <PhoneNumberField
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              // mainClassName="mb-5"
              />
            )}
          />
        </div>
        <div className="md:col-span-1 col-span-2">
          <TextField
            {...register("email", {
              required: t("Email is required"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("Please enter a valid email address"),
              },
            })}
            placeholder={t("Email Address")}
            error={errors.email && errors.email?.message}
          />
        </div>
        <div className="col-span-2 flex gap-2 flex-wrap">
          <Button
            text={
              t("Delete Address")
            }
            type="button"
            onClick={deleteAddress}
            className="!text-base !text-secondary dark:!text-secondary !bg-[#EA4335] !capitalize max-sm:grow !flex md:ms-auto"
          />
          <Button
            text={
              t("Save Address")
            }
            type="submit"
            className="!text-base !capitalize !flex max-sm:grow"
            btnTheme="dark"
          />
        </div>
      </form>
    </>
  );
}
