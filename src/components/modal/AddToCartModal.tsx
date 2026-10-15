"use client";

import { useModalStore } from "@/src/store/useModalStore";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../Button";
import { Trans, useTranslation } from "react-i18next";
import { montserrat } from "@/src/lib/fonts";
import { toast } from "react-toastify";
import { useCartStore } from "@/src/store/useCartStore";
import { ProductType } from "@/src/ts-types/generated";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from "react-responsive";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { getProductPrices } from "@/src/utils/productPrice";

const formatPrice = (n?: number, currency = "AED") => {
  if (typeof n !== "number") return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `Rs ${n}`;
  }
};

function AddToCartModal() {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [mainSwiper, setMainSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<any>([]);
  const [variantErrors, setVariantErrors] = useState<any>({});
  const { i18n, t } = useTranslation();
  const { closeModal, data: product, isOpen } = useModalStore();

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { addToCart, cart } = useCartStore();

  useEffect(() => {
    if (!product?.productVariants) {
      setSelectedVariants([]);
      setVariantErrors({});
      setActiveIndex(0);
      return;
    }

    const defaults = product.productVariants
      .map((variant: any) => {
        const firstValue = variant?.productVariantValues?.[0];
        if (!firstValue) return null;

        const variantTranslations = variant.variant?.translations || [];
        const valueTranslations = firstValue?.variantValue?.translations || [];

        return {
          variantId: variant.variantId,
          variantTranslations,
          variantName: variantTranslations.find((t: any) => t.language === "en")
            ?.name,
          variantValueId: firstValue.variantValueId,
          valueTranslations,
          valueName: valueTranslations.find((t: any) => t.language === "en")
            ?.name,
          imageUrls: firstValue?.imageUrls || [],
        };
      })
      .filter(Boolean);

    setSelectedVariants(defaults);
    setVariantErrors({});
    setActiveIndex(0);
    setSelectedQuantity(1);
  }, [product, isOpen]);

  const getTranslation = (
    translations: any[] = [],
    key: "name" | "description" | "text",
  ) => {
    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] ?? translations[0]?.[key] ?? "";
  };

  const getVariantCode = (translations: any[] = []) => {
    return translations.find((t) => t.code)?.code || null;
  };

  const buildSelectionKey = (variants: any[] = []) =>
    variants
      .map((v) => `${v.variantId}:${v.variantValueId}`)
      .sort((a, b) => Number(a.split(":")[0]) - Number(b.split(":")[0]))
      .join("|");

  const selectedSku = useMemo(() => {
    const skus = (product as any)?.skus;
    if (!skus || !selectedVariants?.length) return null;
    const key = buildSelectionKey(selectedVariants);
    return skus.find((sku: any) => sku.selectionKey === key) || null;
  }, [product?.skus, selectedVariants]);

  const selectedSkuQty = selectedSku?.inventory?.availableQuantity;

  const availableQty = useMemo(() => {
    const hasVariants = (product?.productVariants?.length || 0) > 0;
    if (hasVariants)
      return typeof selectedSkuQty === "number" ? selectedSkuQty : null;
    return product?.skus?.[0]?.inventory?.availableQuantity ?? null;
  }, [product?.productVariants?.length, product?.quantity, selectedSkuQty]);

  const showLowStock = typeof availableQty === "number" && availableQty <= 10;

  const sortVariants = (variants: any[] = []) =>
    [...variants].sort((a, b) => a.variantId - b.variantId);

  const getExistingCartQty = () => {
    const sortedSelected = JSON.stringify(sortVariants(selectedVariants || []));
    const existing = cart?.find(
      (p: any) =>
        p.id === product?.id &&
        JSON.stringify(sortVariants(p.selectedVariants || [])) ===
        sortedSelected,
    );
    return existing?.quantity ?? 0;
  };

  const maxAddableQty = useMemo(() => {
    const existingCartQty = product?.id ? getExistingCartQty() : 0;
    if (typeof availableQty !== "number") return Infinity;
    return Math.max(0, availableQty - existingCartQty);
  }, [availableQty, cart, selectedVariants, product?.id]);

  const canAddToCart = Number.isFinite(maxAddableQty) ? maxAddableQty > 0 : true;

  useEffect(() => {
    setSelectedQuantity((prev) => {
      const safeMax = Number.isFinite(maxAddableQty)
        ? Math.max(1, maxAddableQty)
        : Infinity;
      return Math.max(1, Math.min(prev, safeMax));
    });
  }, [maxAddableQty]);


  const basePrice = product?.price;
  const off = product?.specialOffer?.discountPercent || 0;
  const discounted =
    basePrice && off > 0
      ? Math.max(0, Math.round(basePrice * (1 - off / 100)))
      : undefined;
  const hasDiscount = discounted && discounted < (basePrice ?? Infinity);

  const handleVariantSelect = (variant: any, value: any) => {
    // Keep both EN + AR copies so cart page can render per active language
    const variantTranslations = variant.variant?.translations || [];
    const valueTranslations = value?.variantValue?.translations || [];

    setSelectedVariants((prev: any[]) => {
      const filtered = prev.filter((v) => v.variantId !== variant.variantId);

      setVariantErrors((prevErrors: any) => {
        const newErrors = { ...prevErrors };
        delete newErrors[variant.variantId]; // variantId ke basis par error remove
        return newErrors;
      });

      return [
        ...filtered,
        {
          variantId: variant.variantId,
          variantTranslations,
          variantName: variantTranslations.find((t: any) => t.language === "en")
            ?.name,
          variantValueId: value.variantValueId,
          valueTranslations,
          valueName: valueTranslations.find((t: any) => t.language === "en")
            ?.name,
          imageUrls: value?.imageUrls || [],
        },
      ];
    });
  };

  const handleAdd = (p: ProductType, quantity: number, imageUrl?: string) => {
    const sortedVariants = [...selectedVariants].sort(
      (a, b) => a.variantId - b.variantId,
    );

    addToCart({
      id: p?.id,
      translations: p?.translations,
      price: getProductPrices(p).finalPrice,
      quantity,
      images: imageUrl ? [imageUrl] : p?.imageUrls,
      selectedVariants: sortedVariants,
      availableQty,
    });
    toast.success(t("Product added to cart"));
  };

  const handleAddClick = (product: any) => {
    const errors: any = {};

    product.productVariants?.forEach((variant: any) => {
      const selected = selectedVariants.find(
        (v: any) => v.variantId === variant.variantId,
      );
      if (!selected) {
        errors[variant.variantId] = t("PLEASE SELECT", {
          variant: getTranslation(variant.variant.translations, "name"),
        });
      }
    });

    if (Object.keys(errors).length > 0) {
      setVariantErrors(errors);
      return;
    }

    // sab selected → error remove
    setVariantErrors({});

    // enforce inventory cap
    if (typeof availableQty === "number") {
      const existingQty = getExistingCartQty();
      const desiredQty = existingQty + selectedQuantity;
      if (desiredQty > availableQty) {
        toast.error(
          t("The maximum quantity of this variant is already in your cart."),
        );
        return;
      }
    }

    const activeImage = images?.[activeIndex] || images?.[0];
    handleAdd(product, selectedQuantity, activeImage);
    closeModal();
  };

  const getCurrentImages = () => {
    const defaultImage = "/assets/images/defaultImage.jpg";
    const variantWithImages = product?.productVariants?.find((variant: any) =>
      variant?.productVariantValues?.some(
        (vv: any) => vv?.imageUrls?.length > 0,
      ),
    );

    if (!variantWithImages) {
      return product?.imageUrls?.length ? product.imageUrls : [defaultImage];
    }

    const selectedVariant = selectedVariants.find(
      (v: any) => v.variantId === variantWithImages.variantId,
    );

    const selectedImages = variantWithImages.productVariantValues.find(
      (vv: any) => vv.variantValueId === selectedVariant?.variantValueId,
    )?.imageUrls;

    if (selectedImages?.length) return selectedImages;

    const fallbackVariantImages = variantWithImages.productVariantValues.find(
      (vv: any) => vv?.imageUrls?.length > 0,
    )?.imageUrls;

    if (fallbackVariantImages?.length) return fallbackVariantImages;

    return product?.imageUrls?.length ? product.imageUrls : [defaultImage];
  };

  const images = getCurrentImages();

  const safeSwiper = (swiper: any) =>
    swiper && !(swiper as any).destroyed ? swiper : null;

  useEffect(() => {
    const safeThumbs = safeSwiper(thumbsSwiper);
    const safeMain = safeSwiper(mainSwiper);

    // reset to first slide when images list changes (e.g., color change)
    setActiveIndex(0);
    safeMain?.slideTo?.(0, 0);
    safeThumbs?.slideTo?.(0, 0);
    safeThumbs?.update?.();
  }, [images?.join(",")]);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={closeModal}
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 p-4 transition duration-100 ease-in data-[closed]:opacity-0 z-[9999999999999]"
        transition
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            className={`${montserrat.variable} font-inter !max-w-5xl w-full grid grid-cols-12 gap-5 md:max-h-[90vh] max-h-[85vh] overflow-y-auto bg-white lg:p-12 md:p-6 p-3`}
          >
            <div className="md:col-span-6 col-span-12">
              <div className="grid grid-cols-12 gap-2">
                <div className="md:col-span-2 max-md:order-2 col-span-12">
                  <Swiper
                    onSwiper={setThumbsSwiper as any}
                    spaceBetween={5}
                    slidesPerView={isMobile ? 4 : "auto"}
                    freeMode={true}
                    watchSlidesProgress={true}
                    direction={isMobile ? "horizontal" : "vertical"}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper3 lg:max-h-[500px] md:max-h-[400px] overflow-y-auto"
                  >
                    {images?.map((image: string, i: number) => (
                      <SwiperSlide
                        key={i}
                        className={`!inline-block !h-[80px] aspect-square cursor-pointer p-0.5 border-2 border-transparent`}
                      >
                        <img
                          src={image || "/assets/images/defaultImage.jpg"}
                          alt="product"
                          // fill
                          // sizes="100%"
                          className="object-cover max-w-full absolute inset-0 w-full h-full "
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="md:col-span-10 col-span-12 max-md:order-1">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={isMobile ? 1.2 : 1}
                    navigation={true}
                    onSwiper={setMainSwiper as any}
                    thumbs={{ swiper: safeSwiper(thumbsSwiper) }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper4 mySwiper lg:h-[500px] md:h-[400px]"
                    onSlideChange={(swiper) =>
                      setActiveIndex(swiper.activeIndex)
                    }
                  >
                    {images?.map((image: string, i: number) => (
                      <SwiperSlide key={i}>
                        <div className="relative w-full aspect-[6/8] overflow-hidden bg-black/5">
                          <img
                            src={image || "/assets/images/defaultImage.jpg"}
                            alt="product"

                            className="object-cover absolute inset-0 w-full h-full "
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
            <div className="md:col-span-6 col-span-12 flex flex-col gap-2">
              <div>
                <p
                  className="! lg:text-4xl! text-lg! capitalize line-clamp-2"
                  title={getTranslation(product.translations, "name")}
                >
                  {getTranslation(product.translations, "name")}
                </p>
                <p className="font-archivo md:text-3xl font-medium! text-lg mb-4 mt-5 border-b border-light-brown pb-3">
                  {product?.specialOffer && (
                    <span className="me-3 font-bold!">
                      AED{" "}
                      {product?.price &&
                        (
                          product?.price -
                          (product?.price *
                            product?.specialOffer?.discountPercent) /
                          100
                        ).toFixed(2)}
                    </span>
                  )}
                  <span
                    className={`${product?.specialOffer &&
                      "line-through decoration-1 text-red-400"
                      }`}
                  >
                    AED {product?.price?.toFixed(2)}
                  </span>
                </p>
                <div>
                  {product?.productVariants?.length > 0 &&
                    product?.productVariants?.map((variant: any, i: number) => {
                      const variantEnName = variant.variant.translations.find(
                        (t: any) => t.language === "en",
                      )?.name;

                      return (
                        <div className="mb-4" key={i}>
                          <p className="md:text-lg text-[12px] mb-2 font-semibold text-[#393939] capitalize">
                            {getTranslation(
                              variant.variant.translations,
                              "name",
                            )}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {variant?.productVariantValues?.map(
                              (value: any, index: number) => {
                                const enName =
                                  value?.variantValue?.translations.find(
                                    (t: any) => t.language === "en",
                                  )?.name;

                                return (
                                  <div key={enName}>
                                    <input
                                      type="radio"
                                      name={variantEnName}
                                      id={value?.variantValueId ?? value?.id}
                                      className="peer hidden"
                                      checked={selectedVariants.some(
                                        (v: any) =>
                                          v.variantId === variant.variantId &&
                                          v.variantValueId ===
                                          value.variantValueId,
                                      )}
                                      onChange={() =>
                                        handleVariantSelect(variant, value)
                                      }
                                    />
                                    <label
                                      htmlFor={
                                        value?.variantValueId ?? value?.id
                                      }
                                      className={`inline-block
                           peer-checked:border-black cursor-pointer border-2 border-gray-300 ${getVariantCode(value?.variantValue?.translations)?.includes("#000") ? "hover:border-green-500 peer-checked:border-green-500" : "hover:border-black"}
                           ${getVariantCode(value?.variantValue?.translations) ? "md:w-7 md:h-7 w-5 h-5 peer-checked:w-5.5 peer-checked:h-5.5 peer-checked:md:w-7.5 peer-checked:md:h-7.5 rounded-full" : " md:px-4 px-2 lg:text-sm text-[10px] md:py-2 py-1 uppercase"}`}
                                      style={{
                                        backgroundColor: getVariantCode(
                                          value?.variantValue?.translations,
                                        ),
                                      }}
                                    >
                                      {/* {getTranslation(value?.variantValue?.translations, "name")} */}
                                      {getVariantCode(
                                        value?.variantValue?.translations,
                                      )
                                        ? null
                                        : getTranslation(
                                          value?.variantValue?.translations,
                                          "name",
                                        )}
                                    </label>
                                  </div>
                                );
                              },
                            )}
                          </div>
                          {variantErrors[variant.variantId] && (
                            <p className="!text-red-600 md:text-sm text-[12px] mt-2">
                              {variantErrors[variant.variantId]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
                {showLowStock && availableQty > 0 && (
                  <p className="text-red-600 mb-4 font-normal! capitalize flex items-center gap-2">
                    <span className="relative flex md:size-3 size-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex md:size-3 size-2.5 rounded-full bg-red-500"></span>
                    </span>{" "}
                    <Trans
                      i18nKey="Only {{availableQty}} left in stock - act fast!"
                      values={{ availableQty }}
                      components={[<span key={5} className="font-bold" />]}
                    />
                  </p>
                )}
                {product?.limited && availableQty > 10 && (
                  <p className="mb-4 font-normal! capitalize flex items-center gap-3">
                    <span className="relative flex md:size-3 size-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ed660] opacity-75"></span>
                      <span className="relative inline-flex md:size-3 size-2.5 rounded-full bg-[#3ed660]"></span>
                    </span>{" "}
                    {t("Limited Stock Alert: Get Yours Before They're Gone!")}
                  </p>
                )}
                <div className="flex md:gap-3 gap-2 mt-auto">
                  {availableQty > 0 ? (
                    <>
                      <div className="flex border md:py-2.5 py-1.5 md:px-3 px-1 md:gap-8 gap-4 rounded-[2px]">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedQuantity((prev) => {
                              if (Number.isFinite(maxAddableQty)) {
                                return Math.min(prev + 1, Math.max(1, maxAddableQty));
                              }
                              return prev + 1;
                            })
                          }
                          disabled={Number.isFinite(maxAddableQty) && selectedQuantity >= Math.max(1, maxAddableQty)}
                        >
                          <GoPlus size={24} />
                        </button>

                        <button type="button" disabled>{selectedQuantity}</button>

                        <button
                          type="button"
                          onClick={() => setSelectedQuantity((prev) => Math.max(1, prev - 1))}
                          disabled={selectedQuantity <= 1}
                        >
                          <FiMinus size={24} />
                        </button>
                      </div>
                      <Button
                        text={t("ADD TO CART")}
                        btnTheme="dark"
                        className="w-full"
                        onClick={() => handleAddClick(product)}
                        disabled={!canAddToCart}
                        title={!canAddToCart ? "You already have max quantity of this item in your cart" : t("ADD TO CART")}
                      />
                    </>
                  ) : (
                    <span className="bg-brown  border border-brown text-secondary rounded-[2px] flex items-center justify-center font-medium grow text-sm md:text-base md:px-8 px-4 md:py-3 py-2">
                      {product?.comingSoon ? t("COMING SOON") : t("OUT OF STOCK")}
                    </span>
                  )}
                </div>

                <h5 className="text-sm mt-3 mb-2 font-bold ">
                  {t("Description")}
                </h5>
                <p className="mb-4 mt-2 md:text-sm text-[12px]">
                  {getTranslation(product.translations, "description")}
                </p>
                {product?.productFeatures &&
                  product?.productFeatures.length > 0 && (
                    <>
                      <h5 className="text-sm mb-3 font-bold ">
                        {t("Product Details")}
                      </h5>
                      <ul className="list-disc ps-6 mb-7">
                        {product?.productFeatures?.map((feature: any) => (
                          <li
                            key={feature.id}
                            className="normal-case font-normal md:text-sm text-[12px] mb-2"
                          >
                            {getTranslation(feature?.translations, "text")}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default AddToCartModal;
