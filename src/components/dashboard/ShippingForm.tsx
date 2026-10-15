"use client";

import React, { useEffect, useState } from "react";
import TextField from "../TextField";
import CustomSelect from "../custom-select/custom-select";
import Button from "../Button";
import { useUserAddAddress } from "@/src/hooks/address/useUserAddAddress";
import { Controller, set, useForm } from "react-hook-form";
import { AddAddressTypes } from "@/src/ts-types/generated";
import { useGetAllCountries } from "@/src/hooks/useGetAllCountries";
import { useGetAllCitiesByCountry } from "@/src/hooks/useGetAllCitiesByCountry";
import { useUserUpdateAddress } from "@/src/hooks/address/useUserUpdateAddress";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useAddressGetById } from "@/src/hooks/address/useAddressGetById";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import PhoneNumberField from "../phone-number-field";
import { isValidPhoneNumber } from "react-phone-number-input";

export default function ShippingForm({
  edit,
  isDefault,
  checkout,
  billingCheckout,
  onShippingLocationChange,
}: {
  edit?: boolean;
  isDefault?: boolean;
  checkout?: boolean;
  billingCheckout?: boolean;
  onShippingLocationChange?: (location: {
    country: string;
    city: string;
  }) => void;
}) {
  const router = useAppRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const id = router.query.id as string;

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

  const { data: addressResponse, refetch } = useAddressGetById(id);

  const address = addressResponse?.data;

  const { mutate, isPending } = useUserAddAddress();
  const { mutate: updateAddress, isPending: isUpdating } =
    useUserUpdateAddress();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    resetField,
  } = useForm<AddAddressTypes>({
    mode: "onBlur",
    defaultValues: {
      isDefault: checkout && !billingCheckout && true,
    },
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

    if (edit) {
      updateAddress(
        { id, input: payload },
        {

          onSuccess: (data) => {
            router.back();
            toast.success(t("Address updated successfully"));
          },
        }
      );
    } else {
      mutate(payload, {
        onSuccess: () => {

          !checkout && router.push("/dashboard/address");
        },
      });
    }
  };

  useEffect(() => {
    if (!address || !countries?.length) return;
    const matchedCountry = countries?.find(
      (c: any) => c.label === address.country
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
      isDefault: address.isDefault || false,
    });

    setSelectedCountry(matchedCountry?.value || "");
  }, [address, countryResponse, reset]);

  useEffect(() => {
    if (address && cities?.length) {
      const matchedCity = cities.find((c: any) => c.label === address.city);


      if (matchedCity) {
        reset((prev) => ({
          ...prev,
          city: matchedCity.value || "",
        }));
      }
      setSelectedCity(matchedCity?.value || "");
    }
  }, [address, cityResponse, reset]);

  useEffect(() => {
    if (!id) return;
    refetch();
  }, [id]);

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
                (edit && field.value === undefined) ||
                (field.value === "" && !selectedOption)
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
                    if (!billingCheckout) {
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
                (edit && field.value === undefined) ||
                (field.value === "" && !selectedOption)
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
                    if (!billingCheckout) {
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
              // required: t("Email is required"),
              // pattern: {
              //   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              //   message: t("Please enter a valid email address"),
              // },
            })}
            placeholder={t("Email Address")}
            error={errors.email && errors.email?.message}
          />
        </div>
        <div className={`col-span-2 ${isDefault ? "visible" : "invisible"}`}>
          <label htmlFor="isDefault" className="flex items-center">
            <input
              type="checkbox"
              {...register("isDefault")}
              id="isDefault"
              readOnly
              className="relative w-4 h-4 !p-0 border border-primary bg-transparent appearance-none cursor-pointer checked:bg-white checked:before:content-['✓']
                                    checked:before:absolute checked:before:text-black checked:before:font-bold checked:before:text-xs checked:before:left-[2px]
                                    transition-all duration-200"
            />
            <span className="ms-2 text-sm text-primary">
              {t("Set as default address")}
            </span>
          </label>
        </div>



        {/* <div className="col-span-2">
          <TextField name='postalCode' onChange={() => { }} placeholder='Postal Code' />
        </div> */}
        <div className="col-span-2">
          <Button
            text={t("Save Address")}
            loading={isPending || isUpdating}
            type="submit"
            className="!text-base !capitalize !flex ms-auto"
            btnTheme="dark"
          />
        </div>
      </form>
    </>
  );
}
