"use client";

import Image from "next/image";
import { FiMinus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { PiShareNetworkLight } from "react-icons/pi";
import Button from "./Button";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/useCartStore";
import ProductError from "./ProductError";
import { usePlatformSettings } from "../hooks/usePlatformSettings";
import CheckoutForm from "./CheckoutForm";
import { useCreateOrderValidate } from "../hooks/orders/useCreateOrderValidate";
import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";
import { useFormatPrice } from "@/src/hooks/useFormatPrice";

export default function Cart() {
  const router = useAppRouter();
  const formatMoney = useFormatPrice();

  const { data } = usePlatformSettings();

  const { mutate, isPending } = useCreateOrderValidate();

  const [missingItems, setMissingItems] = useState<any>([]);

  const shippingFee = data?.data?.shippingFee;

  const shippingFeeExemptedAfter = Number(data?.data?.shippingFeeExemptedAfter);

  const handleShare = async (url: string | number) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Refillable Coffee",
          text: "Check out this product!",
          url: `https://staging-front.bijou.com/collections/detail/${url}`,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const { t, i18n } = useTranslation();

  const {
    cart,
    removeFromCart,
    totalItems,
    decreaseQuantity,
    updateQuantity,
    totalPrice,
  } = useCartStore();

  const getAvailableQty = (item: any) =>
    typeof item?.availableQty === "number" ? item.availableQty : null;

  const getTranslation = (translations: any[], key: "name" | "description") => {
    if (!translations || translations.length === 0) return "";

    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");

    if (i18n.language === "ar" && ar && ar[key]) return ar[key];
    return en?.[key] || translations[0]?.[key] || "";
  };

  const handleCheckout = (checkoutData: any) => {
    // Email + Note localStorage se aayenge
    localStorage.setItem(
      "checkout",
      JSON.stringify({
        email: checkoutData.email,
        note: checkoutData.note,
      }),
    );

    // Cart ko API format me convert
    const cartItemsPayload = cart.map((item: any) => ({
      productId: item.id,
      quantity: item.quantity,
      selections: item.selectedVariants.map((v: any) => ({
        variantId: v.variantId,
        variantValueId: v.variantValueId,
      })),
    }));

    mutate(
      { cartItems: cartItemsPayload },
      {
        onSuccess: (res) => {
          if (res?.data?.status) {
            router.push("/checkout");
          } else {
            toast.error(res?.data?.message);
            const missingItems = res?.data?.cartItems?.filter(
              (item: any) => !item?.valid,
            );
            setMissingItems(missingItems);
          }
        },
      },
    );
  };

  const getFriendlyErrors = (product: any, missingItem: any) => {
    console.log(missingItem);

    if (!missingItem?.selections || missingItem.selections.length === 0) {
      return [t("This product is out of stock")];
    }

    return missingItem.selections
      .filter((sel: any) => !sel.valid)
      .map((sel: any) => {
        const variantInfo = product.selectedVariants.find(
          (v: any) =>
            v.variantId === sel.variantId &&
            v.variantValueId === sel.variantValueId,
        );

        if (variantInfo) {
          const variantName =
            getTranslation(variantInfo.variantTranslations || [], "name") ||
            variantInfo.variantName;
          const valueName =
            getTranslation(variantInfo.valueTranslations || [], "name") ||
            variantInfo.valueName;
          return `${variantName}: ${valueName} ${t("is not available")}`;
        }

        // Fallback (if variant not found)
        return t("Some selected option is not available");
      });
  };

  return (
    <section className="py-12 px-3">
      <div className="container">
        <div className="flex gap-2 justify-between items-center border-b border-brown pb-5">
          <h1 className="secHd 2xl:!text-[32px] lg:!text-[32px] md:!text-[32px] !text-2xl">
            {t("Shopping Cart")}
          </h1>
          <span className="font-semibold md:text-xl text-primary">
            {" "}
            ({totalItems})
          </span>
        </div>
        {cart && cart?.length > 0 ? (
          cart?.map((product, index: number) => (
            <div
              className="grid grid-cols-12 md:gap-4 gap-2 items-center cart-item py-5 border-b border-brown"
              key={index}
            >
              <div className="md:col-span-2 col-span-12">
                <div className="relative aspect-[4/5]">
                  <img
                    src={
                      product?.images?.[0] || "/assets/images/product-image.png"
                    }
                    alt="product"
                    className="mx-auto absolute inset-0 w-full h-full  rounded-xl object-cover object-top"
                  />
                </div>
              </div>
              <div className="md:col-span-10 col-span-12">
                <div className="flex justify-between items-start mb-10 gap-2">
                  <div className="font-medium capitalize">
                    <h6 className="mb-3 ! xl:text-2xl md:text-xl">
                      {getTranslation(product?.translations, "name")}
                    </h6>
                    {product.selectedVariants &&
                      product.selectedVariants?.length > 0 && (
                        <div className="flex flex-wrap mt-1">
                          {product.selectedVariants?.map(
                            (variant: any, i: number) => (
                              <span
                                key={i}
                                className={`text-sm px-3 border-e-2 first:ps-0 last:border-e-0 flex gap-2`}
                              >
                                {getTranslation(
                                  variant?.variantTranslations || [],
                                  "name",
                                ) || variant?.variantName}{" "}
                                :{" "}
                                <span>
                                  {getTranslation(
                                    variant?.valueTranslations || [],
                                    "name",
                                  ) || variant?.valueName}
                                </span>
                              </span>
                            ),
                          )}
                        </div>
                      )}
                  </div>
                  {/* <button type="button" onClick={() => handleShare(product?.id || "")}>
                                    <PiShareNetworkLight size={30} />
                                </button> */}
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(product?.id, product.selectedVariants)
                    }
                    className="bg-secondary text-primary p-1.5 max-sm:p-1 border border-[#D9D9D9] rounded-md hover:bg-primary hover:text-secondary"
                  >
                    <MdDelete size={24} />
                  </button>
                  <div className="flex items-center">
                    <p className="md:text-lg text-sm font-semibold ltr:mr-3 rtl:ml-3">
                      {t("Amount")}: {formatMoney(product?.price)}
                    </p>
                    <div className="flex border border-[#D9D9D9]  px-2 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          const availableQty = getAvailableQty(product);
                          const desired = product?.quantity + 1;
                          if (
                            typeof availableQty === "number" &&
                            desired > availableQty
                          ) {
                            toast.error(
                              t(
                                "The maximum quantity of this variant is already in your cart."
                              ),
                            );
                            return;
                          }
                          updateQuantity(
                            product?.id,
                            desired,
                            product?.selectedVariants,
                          );
                        }}
                        className=""
                      >
                        <GoPlus size={24} />
                      </button>
                      <span className="min-w-8 text-center">
                        {product?.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            product?.id,
                            product?.selectedVariants,
                          )
                        }
                        className=""
                      >
                        <FiMinus size={24} />
                      </button>
                    </div>
                  </div>
                </div>
                {(() => {
                  const missingItem = missingItems?.find((item: any) => {
                    // Match product id
                    if (item.productId !== product.id) return false;

                    // If comingSoon or out-of-stock, we don't need to match variants
                    if (item.comingSoon === true || item.inStock === false)
                      return true;

                    // Now match variant combinations
                    const missingSelections = item.selections || [];
                    const selected = product.selectedVariants || [];

                    return missingSelections.every((ms: any) =>
                      selected.some(
                        (sv: any) =>
                          sv.variantId === ms.variantId &&
                          sv.variantValueId === ms.variantValueId,
                      ),
                    );
                  });

                  if (!missingItem) return null;

                  let errors: string[] = [];

                  // Coming Soon error
                  if (missingItem.comingSoon === true) {
                    errors.push(t("This product is coming soon"));
                  }
                  // Out of Stock error
                  else if (missingItem.inStock === false) {
                    errors.push(t("This product is out of stock"));
                  }
                  // Variant mismatch errors (fallback)
                  else {
                    errors = getFriendlyErrors(product, missingItem);
                  }

                  return (
                    <span className="bg-red-200 inline-block mt-4 rounded-md capitalize text-red-500 py-2 px-4">
                      {errors.join(", ")}
                    </span>
                  );
                })()}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-12 mt-20 flex flex-col gap-10 items-center">
            <ProductError text={t("Cart is empty")} />
              <Button text={t("Back to Collections")} onClick={()=> router.push("/collections")} />
          </div>
        )}

        {cart && cart.length > 0 && (
          <>
            <div className="border-b py-10 border-brown">
              {/* {totalPrice >= shippingFeeExemptedAfter ?
                                <p className="md:text-lg text-sm max-w-[370px] ltr:ml-auto rtl:mr-auto md:mb-5 mb-2 font-medium flex justify-between items-center">{t('Shipping')} <span>{t("Free")}</span></p>
                                :
                                <p className="md:text-lg text-sm max-w-[370px] ltr:ml-auto rtl:mr-auto md:mb-5 mb-2 font-medium flex justify-between items-center">{t('Shipping Fee')} <span>{shippingFee}</span></p>
                            } */}

              <div className="flex md:justify-between md:items-center max-md:flex-wrap max-md:flex-col-reverse">
                <h6 className=" md:text-xl capitalize">
                  {t("Taxes calculated at checkout")}
                </h6>
                <p className="md:text-lg text-sm md:max-w-[370px] md:min-w-[370px] w-full font-medium flex justify-between items-center max-md:mb-2">
                  {t("Subtotal")} <span>{formatMoney(totalPrice)}</span>
                </p>
              </div>
            </div>
            <CheckoutForm onCheckout={handleCheckout} />
          </>
        )}
      </div>
    </section>
  );
}
