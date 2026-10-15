"use client";

import { IoChevronDown } from "react-icons/io5";
import Button from "./Button";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import logo from "@/public/assets/images/smallLogo.svg"
import visaLogo from "@/public/assets/images/visa.svg"
import mastercardLogo from "@/public/assets/images/mastercard.svg"
import Image from "next/image";
import TextField from "./TextField";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePlatformSettings } from "../hooks/usePlatformSettings";
import { useCartStore } from "../store/useCartStore";
import { useCheckValidateCoupon } from "../hooks/useCheckValidateCoupon";
import { set, useForm } from "react-hook-form";
import { ValidateCouponInputTypes } from "../ts-types/generated";
import { useAddressGetAll } from "../hooks/address/useAddressGetAll";
import { useUserUpdateAddress } from "../hooks/address/useUserUpdateAddress";
import AddressEditForm from "./AddressEditForm";
import ShippingForm from "./dashboard/ShippingForm";
import { toast } from "react-toastify";
import { useCreateOrder } from "../hooks/orders/useCreateOrder";
import { useShippingQuote } from "../hooks/useShippingQuote";
import { useGetAllCountries } from "../hooks/useGetAllCountries";
import { useCountryWiseShippingFees } from "../hooks/useCountryWiseShippingFees";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useUserStore } from "../store/useUserStore";
import GuestCheckoutAddressForm from "./dashboard/GuestCheckoutAddressForm";
import { useTranslation } from "react-i18next";
import { BsArrowRight } from "react-icons/bs";
import { GoArrowRight } from "react-icons/go";
import SecHd from "./SecHd";
import { useFormatPrice } from "@/src/hooks/useFormatPrice";
import ShippingQuotePreview from "./ShippingQuotePreview";
import { useCurrencyStore } from "../store/useCurrencyStore";
import { getCountryCode } from "../utils/getCountryCode";
import { formatPrice } from "@/src/utils/formatPrice";
import { FiLoader } from "react-icons/fi";



export default function Checkout() {


    const router = useAppRouter();
    const { isLoggedIn } = useUserStore();
    const formatMoney = useFormatPrice();

    const [isHydrated, setIsHydrated] = useState(false);
    const [checked, setChecked] = useState(false);
    const [checkoutData, setCheckoutData] = useState<any>({})
    const [billingAddress, setBillingAddress] = useState<any>(null)
    const [paymentMethod, setPaymentMethod] = useState("PAYMENNT")
    const hasRedirectedForEmptyCart = useRef(false);

    const [discount, setDiscount] = useState<any>("")
    const [couponCode, setCouponCode] = useState<any>("")
    const [discountType, setDiscountType] = useState<any>("")
    const suggestedCountryCode = useCurrencyStore((s) => s.countryCode)


    const { mutate: couponMutate, isPending: isCouponPending } = useCheckValidateCoupon()
    const { mutate: updateAddress, isPending: isUpdating } =
        useUserUpdateAddress();


    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];

    const { data } = usePlatformSettings()

    const tax = Number(data?.data?.taxPercentage) || 0

    const shippingFeeExemptedAfter = Number(data?.data?.shippingFeeExemptedAfter) || 0

    const { totalPrice, cart, clearCart } = useCartStore()

    const { data: addressData } = useAddressGetAll({
        limit: 999,
    });

    const userAddresses = addressData?.data;


    useEffect(() => {
        try {
            const raw = localStorage.getItem("checkout");
            setCheckoutData(raw ? JSON.parse(raw) : {});
        } catch {
            setCheckoutData({});
        }
    }, [])



    const { register, handleSubmit, formState: { errors }, reset, } = useForm<ValidateCouponInputTypes>({
        defaultValues: {
            email: checkoutData?.email,
            code: "",
            cartSubtotal: totalPrice,
        },
    })

    useEffect(() => {
        if (checkoutData) {
            reset({
                email: checkoutData.email || "",
                code: "",
                cartSubtotal: totalPrice || 0,
            })
        }
    }, [checkoutData, totalPrice, reset])


    const couponSubmit = (data: any) => {
        couponMutate(data, {
            onSuccess: (res) => {
                setDiscount(res?.data?.discountValue)
                setDiscountType(res?.data?.type)
                setCouponCode(data?.code)
                reset();
            }
        })
    }

    const removeCoupon = () => {
        setDiscount("");
        setDiscountType("");
        setCouponCode("");
        reset({
            email: checkoutData?.email || "",
            code: "",
            cartSubtotal: totalPrice || 0,
        });
    }




    const handleUpdate = (id: any) => {
        setShippingLocationOverride(null);
        updateAddress(
            {
                id, // address ID
                input: { isDefault: true }, // body
            }
        );
    };



    const { mutate: createOrder, isPending: isCreating } = useCreateOrder()
    const { mutate: quoteShipping, isPending: isQuoting } = useShippingQuote()
    const { data: countryResponse } = useGetAllCountries()


    const defaultAddress = userAddresses?.find((address: any) => address?.isDefault)

    const [guestAddress, setGuestAddress] = useState<any>(null);
    const [guestBillingAddress, setGuestBillingAddress] = useState<any>(null);
    const [shippingLocationOverride, setShippingLocationOverride] = useState<{
        country: string;
        city: string;
    } | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedGuest = localStorage.getItem("guest_addresses");
            const savedBilling = localStorage.getItem("guest_billing_addresses");
            setGuestAddress(savedGuest ? JSON.parse(savedGuest) : null);
            setGuestBillingAddress(savedBilling ? JSON.parse(savedBilling) : null);
        }
    }, []);


    const shippingAddress = {
        firstName: isLoggedIn ? defaultAddress?.firstName : guestAddress?.firstName,
        lastName: isLoggedIn ? defaultAddress?.lastName : guestAddress?.lastName,
        addressLine1: isLoggedIn ? defaultAddress?.addressLine1 : guestAddress?.addressLine1,
        addressLine2: isLoggedIn ? defaultAddress?.addressLine2 : guestAddress?.addressLine2,
        city: isLoggedIn ? defaultAddress?.city : guestAddress?.city,
        country: isLoggedIn ? defaultAddress?.country : guestAddress?.country,
        phone: isLoggedIn ? defaultAddress?.phone : guestAddress?.phone,
        email: isLoggedIn ? defaultAddress?.email : guestAddress?.email,
    }

    const feeCountry =
        shippingLocationOverride?.country ?? shippingAddress.country;
    const feeCity = shippingLocationOverride?.city ?? shippingAddress.city;

    const shippingCountryCode = getCountryCode(
        feeCountry,
        countryResponse?.data
    );

    const countryWiseFeesInput = useMemo(() => {
        if (!shippingCountryCode || !feeCity || cart.length === 0) {
            return null;
        }

        return {
            cartItems: cart.map((item: any) => ({
                productId: item?.id,
                quantity: item?.quantity,
            })),
            countries: [shippingCountryCode],
            city: feeCity,
            subtotal: totalPrice,
            includeQuoteToken: false as const,
        };
    }, [cart, feeCity, shippingCountryCode, totalPrice]);

    const { data: countryWiseFeesData, isFetching: isCheckingShipping } =
        useCountryWiseShippingFees(countryWiseFeesInput);

    const countryWiseFeeItem = countryWiseFeesData?.data?.items?.[0];
    const isUndeliverable = countryWiseFeeItem?.isDeliverable === false;
    const deliveryMessage = isUndeliverable
        ? countryWiseFeesData?.data?.message || countryWiseFeesData?.message ||
          "We do not deliver orders to this location or region"
        : null;
    const shippingFee =
        !isUndeliverable && countryWiseFeeItem?.shippingFee != null
            ? Number(countryWiseFeeItem.shippingFee)
            : null;
    const shippingCurrency = countryWiseFeeItem?.currency;
    const isFreeShipping =
        shippingFee != null &&
        (shippingFee === 0 ||
            (shippingFeeExemptedAfter > 0 &&
                totalPrice >= shippingFeeExemptedAfter));
    const appliedShippingFee =
        shippingFee == null || isFreeShipping ? 0 : shippingFee;

    const formatShippingMoney = (amount: number) =>
        shippingCurrency
            ? formatPrice(amount, shippingCurrency)
            : formatMoney(amount);

    const billAddress = {
        firstName: isLoggedIn ? billingAddress?.firstName : guestBillingAddress?.firstName,
        lastName: isLoggedIn ? billingAddress?.lastName : guestBillingAddress?.lastName,
        addressLine1: isLoggedIn ? billingAddress?.addressLine1 : guestBillingAddress?.addressLine1,
        addressLine2: isLoggedIn ? billingAddress?.addressLine2 : guestBillingAddress?.addressLine2,
        city: isLoggedIn ? billingAddress?.city : guestBillingAddress?.city,
        country: isLoggedIn ? billingAddress?.country : guestBillingAddress?.country,
        phone: isLoggedIn ? billingAddress?.phone : guestBillingAddress?.phone,
        email: isLoggedIn ? billingAddress?.email : guestBillingAddress?.email,
    }


    const payload = {
        shippingAddress: shippingAddress,
        billingAddress: checked && billAddress.firstName ? billAddress : null,
        email: checkoutData?.email || "",
        notes: checkoutData?.note || "",
        couponCode: couponCode || "",
        cartItems: cart?.map((item: any) => ({
            productId: item?.id,
            quantity: item?.quantity,
            selections: item?.selectedVariants.length > 0 && item?.selectedVariants.map((variant: any) => ({
                variantId: variant?.variantId,
                variantValueId: variant?.variantValueId
            })) || [],
        })),
        isBillingAddSameAsShippingAdd: checked && billAddress.firstName ? false : true,
        paymentMethod: paymentMethod
    }


    const { t } = useTranslation();

    const createOrderSubmit = () => {
        if (isCheckingShipping || isUpdating || isQuoting || isCreating) return;
        if (deliveryMessage) {
            toast.error(t(deliveryMessage));
            return;
        }
        if (!shippingAddress.firstName || cart.length === 0) {
            toast.error(t(!shippingAddress.firstName ? t("Shipping Address is required") : t("Please add items in cart")));
            return;
        }

        const countryCode = getCountryCode(
            shippingAddress.country,
            countryResponse?.data
        );

        if (!countryCode) {
            toast.error(t("Country is required"));
            return;
        }

        if (!shippingAddress.city) {
            toast.error(t("City is required"));
            return;
        }

        quoteShipping(
            {
                cartItems: cart.map((item: any) => ({
                    productId: item?.id,
                    quantity: item?.quantity,
                })),
                country: countryCode,
                city: shippingAddress.city,
                subtotal: totalPrice,
            },
            {
                onSuccess: (res) => {
                    const quoteToken = res?.data?.quoteToken;
                    if (!quoteToken) {
                        toast.error(t("something went wrong"));
                        return;
                    }

                    createOrder(
                        { ...payload, quoteToken },
                        {
                            onSuccess: (orderRes) => {
                                toast.success(t(orderRes?.message));
                                if (!orderRes.data?.paymentUrl) {
                                    clearCart();
                                    router.push(
                                        `/thank-you?orderId=${orderRes.data?.orderId || ""}&method=cod`,
                                    );
                                } else {
                                    router.push(orderRes?.data?.paymentUrl);
                                }
                            },
                        }
                    );
                },
            }
        );
    }

    useEffect(() => {
        const unsubscribe = useCartStore.persist.onFinishHydration(() => {
            setIsHydrated(true);
        });

        if (useCartStore.persist.hasHydrated()) {
            setIsHydrated(true);
        }

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!isHydrated || cart.length > 0) return;
        if (hasRedirectedForEmptyCart.current) return;

        hasRedirectedForEmptyCart.current = true;
        toast.error(t("Please add items in cart"), {
            toastId: "empty-cart-checkout",
        });
        router.replace("/");
    }, [isHydrated, cart.length, router, t]);

    if (!isHydrated || cart.length === 0) {
        return null;
    }

    return (
        <section className='lg:pt-14 md:pt-36 pb-10 pt-28 px-3' >
            <div className="container">
                <Button text={t("Back To Cart")} btnTheme="dark" onClick={() => router.push("/cart")} className="!text-base !capitalize" />
                <div className="grid grid-cols-12 lg:gap-18 gap-2 mt-10">
                    <div className="col-span-12 lg:col-span-8">
                        <h2 className="secHd 2xl:!text-2xl lg:!text-2xl !text-2xl mb-5">{t("Shipping address")}</h2>

                        {userAddresses?.map((address, index) => (
                            <Disclosure as="div" defaultOpen={false} key={index} className={"mb-5"}>
                                <div className="group flex w-full items-center gap-5 border border-brown py-2 px-3">
                                    <input
                                        type="radio"
                                        name="address"
                                        id={`${address?.id}`}
                                        value={`${address?.id}`}
                                        checked={address?.isDefault}
                                        disabled={isUpdating}
                                        onChange={() => handleUpdate(String(address?.id))}
                                        className="relative w-5 h-5 shrink-0 border-2 border-brown rounded-[2px] bg-transparent appearance-none cursor-pointer
                           checked:before:absolute checked:before:bg-brown checked:before:rounded-[2px] checked:before:w-2 checked:before:h-2 checked:before:left-[4px] checked:before:top-[4px]
                           transition-all duration-200"
                                    />
                                    <label
                                        htmlFor={`${address?.id}`}
                                        className="grow cursor-pointer ltr:text-left rtl:text-right"
                                    >
                                        {address?.firstName}{" "}
                                        <p className="text-[#C4C8C2] dark:text-[#465240] line-clamp-1">
                                            {address?.addressLine1}
                                        </p>
                                    </label>
                                    <DisclosureButton className="px-2 py-1 bg-brown block"><IoChevronDown className="size-6 text-secondary group-data-open:rotate-180" /></DisclosureButton>
                                </div>

                                <DisclosurePanel className="mt-2 md:px-4 px-1 pt-4">
                                    <AddressEditForm
                                        key={address.id || index}
                                        address={address}
                                        onShippingLocationChange={
                                            address?.isDefault
                                                ? setShippingLocationOverride
                                                : undefined
                                        }
                                    />

                                </DisclosurePanel>
                            </Disclosure>
                        ))}
                        <Disclosure as="div" defaultOpen={false}>
                            <DisclosureButton className="group flex w-full items-center gap-5 border border-brown py-2 px-3">
                                {/* <Image src={logo} alt="logo" className="dark:invert animate-spin" width={30} height={30} /> */}
                                <span className="">
                                    {isLoggedIn ? t("New address") : t("Address")}
                                </span>
                                <span className="px-2 py-1 bg-brown block ms-auto"><IoChevronDown className="size-6 text-secondary group-data-open:rotate-180" /></span>
                            </DisclosureButton>
                            <DisclosurePanel className="mt-2 md:px-4 px-1 pt-4">
                                {isLoggedIn ? (
                                    <ShippingForm
                                        checkout
                                        onShippingLocationChange={
                                            setShippingLocationOverride
                                        }
                                    />
                                ) : (
                                    <GuestCheckoutAddressForm
                                        onAddressChange={setGuestAddress}
                                        onShippingLocationChange={
                                            setShippingLocationOverride
                                        }
                                    />
                                )}

                            </DisclosurePanel>
                        </Disclosure>
                        <h2 className="secHd 2xl:!text-2xl lg:!text-2xl !text-2xl mt-10 mb-5">{t("Billing address")}</h2>
                        <Disclosure as="div" defaultOpen={false}>
                            <DisclosureButton
                                onClick={() => setChecked(!checked)}
                                className="group flex w-full items-center gap-5 border border-brown  py-3 px-3 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    readOnly
                                    className="relative w-4 h-4 border border-brown bg-transparent appearance-none cursor-pointer checked:bg-white checked:before:content-['✓']
                                    checked:before:absolute checked:before:text-brown checked:before:font-bold checked:before:text-xs checked:before:left-[2px]
                                    transition-all duration-200"
                                />
                                <span>{t("Use a different billing address")}</span>
                            </DisclosureButton>
                            <DisclosurePanel className="mt-2 pt-4">

                                {userAddresses?.filter((address) => !address?.isDefault).map((address, index) => (
                                    <Disclosure as="div" defaultOpen={false} key={index} className={"mb-5"}>
                                        <DisclosureButton className="group flex w-full items-center gap-5 border py-2 px-3">
                                            <input
                                                type="radio"
                                                name="billingaddress"
                                                value={`${index + 1}`}
                                                id={`${index + 1}`}
                                                defaultChecked={userAddresses?.filter((address) => !address?.isDefault)[0]?.id === address?.id}
                                                onChange={() => setBillingAddress(address)}
                                                className="relative w-5 h-5 shrink-0 border-2 border-brown rounded-[2px] bg-transparent appearance-none cursor-pointer
                           checked:before:absolute checked:before:bg-brown checked:before:rounded-[2px] checked:before:w-2 checked:before:h-2 checked:before:left-[4px] checked:before:top-[4px]
                           transition-all duration-200"
                                            />
                                            <label
                                                htmlFor={`${index + 1}`}
                                                className="grow cursor-pointer ltr:text-left rtl:text-right"
                                            >
                                                {address?.firstName}{" "}
                                                <p className="text-[#C4C8C2] dark:text-[#465240] line-clamp-1">
                                                    {address?.addressLine1}
                                                </p>
                                            </label>
                                            <span className="px-2 py-1 bg-primary block"><IoChevronDown className="size-6 text-secondary group-data-open:rotate-180" /></span>
                                        </DisclosureButton>

                                        <DisclosurePanel className="mt-2 md:px-4 px-1 pt-4">
                                            <AddressEditForm
                                                key={address.id || index}
                                                address={address}

                                            />

                                        </DisclosurePanel>
                                    </Disclosure>
                                ))}
                                <Disclosure as="div" defaultOpen={false}>
                                    <DisclosureButton className="group flex w-full items-center gap-5 border border-brown py-2 px-3">
                                        {/* <Image src={logo} alt="logo" className="dark:invert animate-spin" width={30} height={30} /> */}
                                        <span className="">
                                            {t("New address")}
                                        </span>
                                        <span className="px-2 py-1 bg-brown block ms-auto"><IoChevronDown className="size-6 text-secondary group-data-open:rotate-180" /></span>
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 md:px-4 px-1 pt-4">
                                        {isLoggedIn ? (
                                            <ShippingForm
                                                checkout billingCheckout
                                            />
                                        ) : <GuestCheckoutAddressForm billing onAddressChange={setGuestBillingAddress} />}
                                    </DisclosurePanel>
                                </Disclosure>
                            </DisclosurePanel>
                        </Disclosure>
                        {shippingFee != null && (
                            <>
                                <h2 className="secHd 2xl:!text-2xl lg:!text-2xl !text-2xl mt-10 mb-5">{t("Shipping")}</h2>
                                <ShippingQuotePreview
                                    addressCountry={shippingAddress.country}
                                    suggestedCountryCode={suggestedCountryCode}
                                    // isFreeShipping={isFreeShipping}
                                    fallbackShippingFee={shippingFee}
                                    shippingCurrency={shippingCurrency}
                                    formatMoney={formatMoney}
                                />
                            </>
                        )}
                        {shippingAddress.firstName ? (
                            null
                        ) : <p className="text-sm !text-red-500 mt-5">{t("Please add a shipping address to complete the wallet payment")}</p>}

                    </div>
                    <div className="col-span-12 lg:col-span-4 uppercase max-lg:mt-10">
                        {couponCode ? (
                            <div className="mt-5 flex items-stretch gap-2">
                                <div className="grow border border-brown px-3 py-2.5 flex flex-col justify-center min-h-[58px]">
                                    <p className="text-[11px] text-light-gray leading-none mb-1.5">{t("Promo Code")}</p>
                                    <p className="font-semibold text-sm normal-case leading-none">{couponCode}</p>
                                </div>
                                <Button
                                    text={t("Remove")}
                                    btnTheme="dark"
                                    type="button"
                                    onClick={removeCoupon}
                                    className="!text-sm !px-4 !py-0 !font-medium shrink-0 self-stretch h-auto"
                                />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(couponSubmit)} className={`flex mt-5 gap-2 ${errors.code ? "items-center" : "items-end"}`}>
                                <TextField {...register("code", { required: t("Promo Code is Required") })} placeholder={t('Enter Promo Code')} label={t("Promo Code")} className="grow [&>input]:py-3 shrink-1"
                                    error={errors.code && errors.code.message} />
                                <Button loading={isCouponPending} text={<>{t("Apply")} <GoArrowRight className="inline size-6 md:ms-2 ms-1 rtl:rotate-180" /></>} btnTheme="dark" type="submit" className="!text-sm [&>svg]:size-5 !py-3 !px-4 !font-medium shrink-0" />
                            </form>
                        )}
                        <div className="border-y border-[#D9D9D9] py-5 my-5 max-md:text-sm">
                            <p className="mb-5 font-semibold flex justify-between items-center">{t("Subtotal")} <span className="font-medium">{formatMoney(totalPrice)}</span></p>
                                <p className="mb-5 font-semibold flex justify-between items-center">{t("Shipping")}
                                    <span className="font-medium capitalize">
                                        {isUndeliverable
                                            ? t("Unavailable")
                                            : isCheckingShipping
                                                ? <FiLoader className="animate-spin" />
                                                : shippingFee == null
                                                    ? "—"
                                                    : formatShippingMoney(shippingFee)}
                                    </span>
                                </p>
                            <p className="mb-5 font-semibold flex justify-between items-center">{t("Tax")}{tax > 0 && ` (${tax}%)`} <span className="font-medium">{formatMoney(totalPrice * tax / 100)}</span></p>
                            {discount > 0 && <p className="font-semibold flex justify-between items-center">{t("Discount")} <span className="font-medium">
                                {formatMoney(discountType === "FIXED" ? discount : totalPrice * discount / 100)}</span>
                            </p>
                            }
                        </div>
                        <SecHd text={t("Payment Method")} className="2xl:!text-2xl lg:!text-2xl !text-2xl" />
                        <div className="my-5">
                            {["PAYMENNT"].map((item, index) => (
                                <div className="flex items-center first:mb-2" key={index}>
                                    <input
                                        type="radio"
                                        name={"payment_method"}
                                        id={item}
                                        value={item}
                                        checked={paymentMethod === item}
                                        className="peer accent-primary"
                                        onChange={() => setPaymentMethod(item)}
                                    />
                                    <label
                                        htmlFor={item}
                                        className="px-3 lg:text-sm text-[12px] py-1 rounded-full capitalize cursor-pointer"
                                    >
                                        {item === "PAYMENNT" ? t("Credit / Debit Card") : t(item.split("_").join(" ")?.toLowerCase())}
                                    </label>
                                    {item === "PAYMENNT" && (
                                        <div className="flex items-center gap-2 ms-2" aria-label={t("We accept")}>
                                            <Image
                                                src={visaLogo}
                                                alt="Visa"
                                                width={48}
                                                height={32}
                                                className="h-6 w-auto"
                                            />
                                            <Image
                                                src={mastercardLogo}
                                                alt="Mastercard"
                                                width={48}
                                                height={32}
                                                className="h-6 w-auto"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="mb-7 font-semibold flex justify-between items-center">
                            {t("Total")}
                            <span className="font-medium">
                                {formatMoney(
                                    discount > 0
                                    ? (
                                        (
                                            totalPrice +
                                            appliedShippingFee +
                                            (totalPrice * tax / 100)
                                        ) -
                                        (discountType === "FIXED"
                                            ? discount
                                            : (totalPrice * discount) / 100)
                                    )
                                    : (
                                            totalPrice +
                                            appliedShippingFee +
                                            (totalPrice * tax / 100)
                                    )
                                )}
                            </span>
                        </p>
                        {deliveryMessage && (
                            <p role="alert" className="mb-4 text-sm text-red-500 normal-case">
                                {t(deliveryMessage)}
                            </p>
                        )}
                        <Button disabled={isUndeliverable || isCheckingShipping || isUpdating} loading={isQuoting || isCreating} text={t("place order")} btnTheme="dark" onClick={createOrderSubmit} className="w-full !text-base !font-medium disabled:opacity-50" />

                    </div>
                </div>
            </div>
        </section>
    )
}
