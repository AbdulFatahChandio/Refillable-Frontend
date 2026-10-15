"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { GoArrowRight } from "react-icons/go";
import Button from "./Button";
import CustomSelect from "./custom-select/custom-select";
import TextField from "./TextField";
import { useGetAllCountries } from "@/src/hooks/useGetAllCountries";
import { useShippingQuotePreview } from "@/src/hooks/useShippingQuotePreview";
import {
    ShippingQuotePreviewData,
    ShippingQuotePreviewInput,
} from "@/src/ts-types/generated";
import { formatPrice } from "@/src/utils/formatPrice";
import { COUNTRIES_CURRENCIES } from "@/src/utils/countries-currencies";

type Props = {
    addressCountry?: string;
    suggestedCountryCode?: string;
    isFreeShipping?: boolean;
    fallbackShippingFee?: number | null;
    shippingCurrency?: string;
    formatMoney: (n?: number | null) => string;
};

export default function ShippingQuotePreview({
    addressCountry,
    suggestedCountryCode,
    isFreeShipping,
    fallbackShippingFee,
    shippingCurrency,
    formatMoney,
}: Props) {
    const { t } = useTranslation();
    const [quote, setQuote] = useState<ShippingQuotePreviewData | null>(null);
    const { data: countryResponse, isLoading: isCountriesLoading } =
        useGetAllCountries();
    const { mutate: previewQuote, isPending } = useShippingQuotePreview();

    const countries = countryResponse?.data
        ?.map((country) => {
            const matchedCode =
                country?.code ||
                COUNTRIES_CURRENCIES.find(
                    (item) =>
                        item.countryName.toLowerCase() ===
                        String(country?.name || "").toLowerCase()
                )?.countryCode;
            return {
                value: String(matchedCode || "").toUpperCase(),
                label: country.name,
            };
        })
        .filter((country) => country.value);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ShippingQuotePreviewInput>({
        defaultValues: {
            country: "",
            weightKg: "",
        },
    });

    const selectedCountry = watch("country");

    const clearQuote = () => {
        setQuote(null);
    };

    useEffect(() => {
        if (!countries?.length) return;

        const matchedByAddress = addressCountry
            ? countries.find(
                  (country) =>
                      country.label.toLowerCase() ===
                      addressCountry.toLowerCase()
              )
            : undefined;
        const matchedByCode = suggestedCountryCode
            ? countries.find(
                  (country) =>
                      country.value === suggestedCountryCode.toUpperCase()
              )
            : undefined;

        const nextCountry =
            matchedByAddress?.value || matchedByCode?.value || "";

        if (nextCountry && !selectedCountry) {
            setValue("country", nextCountry);
        }
    }, [addressCountry, countries, selectedCountry, setValue, suggestedCountryCode]);

    const onSubmit = (values: ShippingQuotePreviewInput) => {
        previewQuote(
            {
                country: values.country,
                weightKg: String(values.weightKg),
            },
            {
                onSuccess: (res) => {
                    setQuote(res?.data ?? null);
                },
            }
        );
    };

    const selectedOption =
        countries?.find((country) => country.value === selectedCountry) || null;

    const quotedFee = quote ? Number(quote.shippingFee) : null;
    const hasShippingFee = quotedFee != null || fallbackShippingFee != null;

    if (!hasShippingFee) {
        return null;
    }

    const displayFee =
        quotedFee != null
            ? formatPrice(quotedFee, quote?.currency)
            : isFreeShipping
              ? t("Free")
              : shippingCurrency
                ? formatPrice(Number(fallbackShippingFee), shippingCurrency)
                : formatMoney(Number(fallbackShippingFee));

    return (
        <div>
            {/* <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                    <Controller
                        name="country"
                        control={control}
                        rules={{ required: t("Country is required") }}
                        render={({ field }) => (
                            <CustomSelect
                                label={t("Country")}
                                list={countries}
                                disable={isCountriesLoading}
                                classNamePrefix="select2"
                                name="country"
                                placeholder={t("Select country")}
                                value={selectedOption}
                                errorMsg={errors.country?.message}
                                labelClassName="text-light-gray max-2xl:text-sm"
                                selectClassName="[&>div:first-child]:pb-0 [&>div:first-child]:mb-3 [&_.select2__control]:!min-h-[50px] [&_.select2__control]:!h-[50px] [&_.select2__value-container]:!py-0 [&_.select2__value-container]:!px-3 [&_.select2__indicators]:!pr-2"
                                onChange={(selected: any) => {
                                    field.onChange(
                                        selected?.value
                                            ? String(selected.value)
                                            : ""
                                    );
                                    clearQuote();
                                }}
                            />
                        )}
                    />
                    <TextField
                        {...register("weightKg", {
                            required: t("Weight is required"),
                            validate: (value) => {
                                const parsed = Number(value);
                                if (Number.isNaN(parsed) || parsed <= 0) {
                                    return t("Weight is required");
                                }
                                return true;
                            },
                            onChange: () => clearQuote(),
                        })}
                        type="number"
                        min="0.01"
                        step="0.01"
                        name="weightKg"
                        label={t("Weight (kg)")}
                        placeholder={t("Enter weight")}
                        error={errors.weightKg?.message}
                        className="[&>label]:mb-3 [&>input]:h-[50px] [&>input]:py-0 [&>input]:px-3 [&>input]:text-base [&>input]:rounded-none [&>input]:2xl:!h-[50px] [&>input]:2xl:!px-3 [&>input]:2xl:!py-0 [&>input]:2xl:!text-base"
                    />
                </div>
                <Button
                    loading={isPending}
                    text={
                        <>
                            {t("Check rate")}{" "}
                            <GoArrowRight className="inline size-6 md:ms-2 ms-1 rtl:rotate-180" />
                        </>
                    }
                    btnTheme="dark"
                    type="submit"
                    className="!text-sm [&>svg]:size-5 !py-3 !px-4 !font-medium mt-3"
                />
            </form> */}
            <div className="group flex w-full items-center gap-7 border border-brown py-2 px-3">
                <div>
                    <p className="">{t("1-3 working days shipping")}</p>
                    <span className="">
                        {t("Shipping")} {displayFee}
                    </span>
                    {quote && (
                        <p className="text-sm text-light-gray mt-1 normal-case">
                            {t("Estimated shipping")} · {quote.countryCode} ·{" "}
                            {quote.billableWeightKg} kg
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
