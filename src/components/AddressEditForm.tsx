"use client";

import { useForm, Controller } from "react-hook-form";
import { AddAddressTypes } from "../ts-types/generated";
import Button from "./Button";
import TextField from "./TextField";
import CustomSelect from "./custom-select/custom-select";
import { useGetAllCountries } from "../hooks/useGetAllCountries";
import { useGetAllCitiesByCountry } from "../hooks/useGetAllCitiesByCountry";
import { useEffect, useMemo, useState } from "react";
import { useUserUpdateAddress } from "../hooks/address/useUserUpdateAddress";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneNumberField from "./phone-number-field";

type AddressEditFormProps = {
    address: AddAddressTypes;
    onShippingLocationChange?: (location: {
        country: string;
        city: string;
    }) => void;
};

export default function AddressEditForm({
    address,
    onShippingLocationChange,
}: AddressEditFormProps) {

    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const { mutate: updateAddress, isPending: isUpdating } =
        useUserUpdateAddress();

    const { data: countryResponse, isLoading } = useGetAllCountries();
    const { data: cityResponse, isLoading: isLoading2 } =
        useGetAllCitiesByCountry(selectedCountry);

    const countries = useMemo(
        () => countryResponse?.data?.map((c: any) => ({ value: String(c.id), label: c.name })) || [],
        [countryResponse]
    );

    const cities = useMemo(
        () => cityResponse?.data?.map((c: any) => ({ value: String(c.id), label: c.name })) || [],
        [cityResponse]
    );


    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<AddAddressTypes>({
        defaultValues: {
            firstName: address.firstName,
            lastName: address.lastName,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            country: address.country,
            city: address.city,
            phone: address.phone,
            email: address.email,
            isDefault: address.isDefault,
        },
    });

    const onSubmit = (data: AddAddressTypes) => {
        const countryLabel =
            countries?.find((c: any) => c.value === String(data.country))?.label ||
            "";
        const cityLabel =
            cities?.find((c: any) => c.value === String(data.city))?.label || "";

        const payload = {
            ...data,
            country: countryLabel,
            city: cityLabel,
        };
        updateAddress(
            { id: address.id, input: payload },
            {
                onSuccess: (data) => {
                    toast.success(t("Address updated successfully"));
                },
            }
        );
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

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 md:gap-5 gap-3 [&_input]:py-3 [&_input]:px-3 mb-5"
        >
            <TextField
                {...register("firstName", { required: t("First Name is required") })}
                placeholder={t("First Name")}
                error={errors.firstName && errors.firstName?.message}
            />
            <TextField
                {...register("lastName", { required: t("Last Name is required") })}
                placeholder={t("Last Name")}
                error={errors.lastName && errors.lastName?.message}
            />
            <TextField
                {...register("addressLine1", { required: t("Address is required") })}
                placeholder={t("Address line 1")}
                error={errors.addressLine1 && errors.addressLine1?.message} className="col-span-2"
            />
            <TextField {...register("addressLine2")} placeholder={t("Address line 2")} className="col-span-2" />

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
                        (field.value === undefined) ||
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
                                const countryMeta = countryResponse?.data?.find(
                                    (c: any) => String(c.id) === String(selected.value)
                                );
                                onShippingLocationChange?.({
                                    country:
                                        countryMeta?.code ||
                                        selected.label ||
                                        "",
                                    city: "",
                                });
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
                        (field.value === undefined) ||
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
                                const countryMeta = countryResponse?.data?.find(
                                    (c: any) => String(c.id) === String(selectedCountry)
                                );
                                onShippingLocationChange?.({
                                    country:
                                        countryMeta?.code ||
                                        countryMeta?.name ||
                                        address?.country ||
                                        "",
                                    city: selected.label || "",
                                });
                            }}
                        />
                    );
                }}
            />
            {errors.city && (
                <p className="!text-red-500 text-sm mt-2">{errors.city.message}</p>
            )}
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
            {/* <TextField
                type="number"
                {...register("phone", { required: "Phone Number is required" })}
                placeholder={t("Phone Number")}
                error={errors.phone && errors.phone?.message}
            /> */}


            <div className="col-span-2">
                <Button
                    text={t("Save Address")}
                    className="!text-base !capitalize !flex ms-auto"
                    loading={isUpdating}
                    type="submit"
                    btnTheme="dark"
                />
            </div>
        </form>
    );
}
