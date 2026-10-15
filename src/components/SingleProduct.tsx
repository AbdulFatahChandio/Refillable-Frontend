"use client";

import Image from "next/image";
import Button from "./Button";
import { IoHeartCircleOutline, IoHeartOutline } from "react-icons/io5";
import { useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { useProductGetById } from "../hooks/product/useProductGetById";
import { Trans, useTranslation } from "react-i18next";
import { useAddWishlist } from "../hooks/wishlist/useAddWishlist";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../store/useUserStore";
import { useRemoveWishlist } from "../hooks/wishlist/useRemoveWishlist";
import { useCartStore } from "../store/useCartStore";
import { ProductType } from "../ts-types/generated";
import coffeeImage from "@/public/assets/images/defaultImage.jpg";
import { GoPlus } from "react-icons/go";
import { FiChevronLeft, FiChevronRight, FiMinus, FiX } from "react-icons/fi";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { notFound } from "next/navigation";
import { isAxiosError } from "axios";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

// Swiper for thumbnails
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules";
import { useMediaQuery } from "react-responsive";
import { useWishlistStore } from "../store/useWishlistStore";
import { useModalStore } from "../store/useModalStore";
import RelatedProducts from "./RelatedProducts";
import { useFormatPrice } from "@/src/hooks/useFormatPrice";
import { getProductPrices } from "@/src/utils/productPrice";

type Props = {
  id: string;
};

export default function SingleProductSec({ id }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [mainSwiper, setMainSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSwiper, setLightboxSwiper] = useState<any>(null);
  const lightboxPointerRef = useRef<{ x: number; y: number } | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<any>([]);
  const [variantErrors, setVariantErrors] = useState<any>({});
  const { user } = useUserStore();
  const { addToCart, decreaseQuantity, cart, updateQuantity } = useCartStore();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { increment, decrement } = useWishlistStore();
  const { openModal } = useModalStore();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const formatMoney = useFormatPrice();

  const { data, isLoading, isError, error, isFetched } = useProductGetById(
    user ? "user" : "public",
    id,
  );
  const product = data?.data?.product;

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
  }, [product?.id]);

  // ---------- helpers ----------
  const getTranslation = (
    translations: any[] = [],
    key: "name" | "description" | "text" | "title",
  ) => {
    if (!translations || translations.length === 0) return "";

    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");
    if (i18n.language === "ar" && ar && ar[key]) return ar[key];
    return en?.[key] || translations[0]?.[key] || "";
  };

  const getVariantCode = (translations: any[] = []) => {
    return translations.find((t) => t.code)?.code || null;
  };

  const buildSelectionKey = (variants: any[] = []) =>
    variants
      .map((v) => `${v.variantId}:${v.variantValueId}`)
      .sort(
        (a, b) => Number(a.split(":")[0] ?? 0) - Number(b.split(":")[0] ?? 0),
      )
      .join("|");

  // Match the currently selected variant combination with the API skus
  const selectedSku = useMemo(() => {
    const skus = product?.skus;
    if (!skus || !selectedVariants?.length) return null;
    const key = buildSelectionKey(selectedVariants);
    return skus.find((sku: any) => sku.selectionKey === key) || null;
  }, [product?.skus, selectedVariants]);

  const selectedSkuQty = selectedSku?.inventory?.availableQuantity;

  // available quantity: use SKU inventory when variants exist, otherwise product.quantity
  const availableQty = useMemo(() => {
    const hasVariants = (product?.productVariants?.length || 0) > 0;

    if (hasVariants) return selectedSkuQty ?? null;
    return product?.skus?.[0]?.inventory?.availableQuantity ?? null;
  }, [product?.productVariants?.length, selectedSkuQty]);

  const showLowStock = availableQty <= 10;

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

  // ---------- wishlist ----------
  const { mutate, isPending } = useAddWishlist();
  const { mutate: removeProductWishlist, isPending: isPendingRemove } =
    useRemoveWishlist();

  const toggleWishlist = (pid: string) => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    if (product?.isWishlisted) {
      removeProductWishlist(
        { id: pid },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            decrement();
          },
        },
      );
    } else {
      mutate(
        { id: pid },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product"] });
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            increment();
          },
        },
      );
    }
  };

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

    // sab selected -> error remove
    setVariantErrors({});

    // enforce inventory cap (variants => SKU qty, otherwise product.qty)
    if (typeof availableQty === "number") {
      const existingQty = getExistingCartQty();
      const desiredQty = existingQty + selectedQuantity;
      if (desiredQty > availableQty) {
        toast.error(
          t("Only {{qty}} items were added to your cart due to availability.", {
            qty: availableQty,
          }),
        );
        return;
      }
    }

    const activeImage = images?.[activeIndex] || images?.[0];
    handleAdd(product, selectedQuantity, activeImage);
  };

  const getCurrentImages = () => {
    const defaultImage = coffeeImage.src;
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
  // const safeThumbsSwiper = safeSwiper(thumbsSwiper);

  const safeThumbsSwiper =
    thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const showLightboxPrev = () => {
    const swiper = safeSwiper(lightboxSwiper);
    if (swiper) {
      if (swiper.zoom?.scale > 1) swiper.zoom.out();
      swiper.slidePrev();
      return;
    }
    setLightboxIndex((prev) =>
      prev === 0 ? Math.max(0, (images?.length || 1) - 1) : prev - 1,
    );
  };

  const showLightboxNext = () => {
    const swiper = safeSwiper(lightboxSwiper);
    if (swiper) {
      if (swiper.zoom?.scale > 1) swiper.zoom.out();
      swiper.slideNext();
      return;
    }
    setLightboxIndex((prev) =>
      prev >= (images?.length || 1) - 1 ? 0 : prev + 1,
    );
  };

  const toggleLightboxZoom = () => {
    const swiper = safeSwiper(lightboxSwiper);
    if (!swiper?.zoom) return;
    if (swiper.zoom.scale > 1) {
      swiper.zoom.out();
    } else {
      swiper.zoom.in();
    }
  };

  const handleLightboxImagePointerDown = (
    e: PointerEvent<HTMLImageElement>,
  ) => {
    lightboxPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleLightboxImageClick = (e: MouseEvent<HTMLImageElement>) => {
    const start = lightboxPointerRef.current;
    lightboxPointerRef.current = null;
    if (start) {
      const moved =
        Math.abs(e.clientX - start.x) > 8 || Math.abs(e.clientY - start.y) > 8;
      if (moved) return;
    }
    e.stopPropagation();
    toggleLightboxZoom();
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showLightboxPrev();
      if (e.key === "ArrowRight") showLightboxNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, lightboxSwiper, images?.length]);

  useEffect(() => {
    if (!lightboxOpen) {
      setLightboxSwiper(null);
    }
  }, [lightboxOpen]);

  useEffect(() => {
    const safeThumbs = safeThumbsSwiper;
    const safeMain = safeSwiper(mainSwiper);

    // reset to first slide when image set changes (e.g., color change)
    setActiveIndex(0);
    setLightboxIndex(0);
    safeMain?.slideTo?.(0, 0);
    safeThumbs?.slideTo?.(0, 0);
    safeThumbs?.update?.();
  }, [images?.join(",")]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  const is404 =
    isError && isAxiosError(error) && error.response?.status === 404;

  if (is404 || (isFetched && !isError && !product)) {
    notFound();
  }

  if (!product) return null;

  return (
    <section className="py-12 px-3">
      <div className="container-fluid grid grid-cols-2 md:gap-10 items-start">
        <div className="md:col-span-1 col-span-2 lg:sticky lg:top-10">
          <div className="grid grid-cols-12 gap-2">
            <div className="md:col-span-2 max-md:order-2 col-span-12">
              <Swiper
                onSwiper={setThumbsSwiper}
                dir="ltr"
                spaceBetween={5}
                slidesPerView={isMobile ? 4 : "auto"}
                freeMode
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
                    <div className="relative w-full h-full">
                      <img
                        src={image}
                        alt="product"
                        className="object-cover w-full h-full absolute inset-0"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="md:col-span-10 col-span-12 max-md:order-1">
              <Swiper
                dir="ltr"
                spaceBetween={10}
                slidesPerView={isMobile ? 1.2 : 1}
                navigation
                autoHeight={true}
                onSwiper={setMainSwiper}
                thumbs={{ swiper: safeThumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper4"
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              >
                {images?.map((image: string, i: number) => (
                  <SwiperSlide key={i}>
                    <button
                      type="button"
                      onClick={() => openLightbox(i)}
                      className="relative overflow-hidden bg-black/5 w-full cursor-zoom-in block text-left"
                      aria-label="View larger image"
                    >
                      <img src={image} alt="product" className="w-full" />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 col-span-2 max-md:pt-3">
          <div className="text-primary uppercase grow">
            <div className="">

              {product?.limited && (
                <span className="inline-block text-[11px] font-bold bg-light-brown text-white px-3 py-1 rounded-full mb-5">
                  {t("LIMITED")}
                </span>
              )}

              <h3 className="md:mb-6 md:text-4xl text-2xl">
                {getTranslation(product?.translations, "name")}
              </h3>

              {/* PRICE */}
              {(() => {
                const {
                  price: actualPrice,
                  discountedPrice: offerPrice,
                  hasDiscount: showOffer,
                } = getProductPrices(product);

                return (
                  <p className="font-archivo 2xl:text-3xl md:text-2xl font-medium! text-lg mb-4 border-b border-light-brown pb-3">
                    {showOffer && (
                      <span className="me-3">
                        {formatMoney(offerPrice)}
                      </span>
                    )}
                    <span
                      className={`${
                        showOffer &&
                        "line-through decoration-1 text-red-400"
                      }`}
                    >
                      {formatMoney(actualPrice)}
                    </span>
                  </p>
                );
              })()}

              <div>
                {product?.productVariants?.length > 0 &&
                  product?.productVariants?.map((variant: any, i: number) => {
                    const variantEnName = variant.variant.translations.find(
                      (t: any) => t.language === "en",
                    )?.name;

                    return (
                      <div className="mb-4" key={i}>
                        <p className="md:text-lg text-[12px] mb-2 font-semibold text-[#393939] capitalize">
                          {getTranslation(variant.variant.translations, "name")}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {variant?.productVariantValues?.map(
                            (value: any, index: number) => {
                              const enName =
                                value?.variantValue?.translations.find(
                                  (t: any) => t.language === "en",
                                )?.name;
                              const colorCode = getVariantCode(
                                value?.variantValue?.translations,
                              );

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
                                    htmlFor={value?.variantValueId ?? value?.id}
                                    className={`inline-block
                           peer-checked:border-black cursor-pointer border-2 border-gray-300 ${colorCode?.includes("#000") ? "hover:border-green-500 peer-checked:border-green-500" : "hover:border-black"} 
                           ${colorCode ? "w-7 h-7 peer-checked:w-7.5 peer-checked:h-7.5 rounded-full" : " md:px-4 px-2 lg:text-sm text-[10px] py-2 uppercase"}`}
                                    style={{
                                      backgroundColor: colorCode || undefined,
                                    }}
                                  >
                                    {colorCode
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
                          <p className="!text-red-600 text-sm mt-2">
                            {variantErrors[variant.variantId]}
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
              {showLowStock &&
                availableQty > 0 &&
                product?.inStock &&
                !product?.comingSoon && (
                  <p className="text-red-600 mb-4 font-normal! text-lg capitalize flex items-center md:gap-3 gap-2">
                    <span className="relative flex md:size-3 size-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex md:size-3 size-2.5 rounded-full bg-red-500"></span>
                    </span>{" "}
                    <Trans
                      i18nKey="Only {{availableQty}} left in stock - act fast!"
                      values={{ availableQty }}
                      components={[<span key={3} className="font-bold" />]}
                    />
                  </p>
                )}
              {product?.limited && availableQty > 10 && (
                <p className="mb-4 font-normal! capitalize text-lg flex items-center gap-3">
                  <span className="relative flex md:size-3 size-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ed660] opacity-75"></span>
                    <span className="relative inline-flex md:size-3 size-2.5 rounded-full bg-[#3ed660]"></span>
                  </span>{" "}
                  {t("Limited Stock Alert: Get Yours Before They're Gone!")}
                </p>
              )}
              {/* CART + QTY + WISHLIST */}
              <div className="flex flex-wrap items-center md:gap-10 gap-5">
                <div className="flex md:gap-3 gap-1 flex-wrap grow items-stretch [&_svg]:cursor-pointer max-sm:w-full">
                  {product?.inStock && !product?.comingSoon &&
                    availableQty > 0 && <div className="flex border md:py-2.5 py-1.5 md:px-3 px-1 md:gap-8 gap-4 rounded-[2px]">
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
                    </div>}


                  {product?.inStock &&
                    !product?.comingSoon &&
                    availableQty > 0 ? (
                    <Button
                      btnTheme="dark"
                      text={t("ADD TO CART")}
                      // onClick={() => openModal("ADD_TO_CART_MODAL", product)}
                      onClick={() => handleAddClick(product)}
                      disabled={!canAddToCart}
                      title={!canAddToCart ? "You already have max quantity of this item in your cart" : t("ADD TO CART")}
                      className="md:px-8 px-4 py-2 !md:text-sm grow !font-medium"
                    />
                  ) : (
                    <span className="bg-brown  rounded-[2px] border border-brown md:text-base text-secondary flex items-center justify-center font-medium grow text-sm md:px-8 px-4 md:py-3 py-2">
                      {product?.comingSoon
                        ? t("COMING SOON")
                        : t("OUT OF STOCK")}
                    </span>
                  )}


                </div>
              </div>
              <h5 className="max-md:text-sm text-lg mb-3 md:mt-10 mt-5 ">
                {t("DESCRIPTION")}
              </h5>
              <p className="normal-case font-normal max-2xl:text-sm mb-7">
                {getTranslation(product?.translations, "description")}
              </p>
              {product?.productFeatures &&
                product?.productFeatures.length > 0 && (
                  <>
                    <h5 className="max-md:text-sm text-lg mb-3">
                      {t("Why you’ll love it:")}
                    </h5>
                    <ul className="list-disc ps-6">
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
        </div>
      </div>
      {data?.data?.relatedProducts &&
        data?.data?.relatedProducts.length > 0 && (
          <div className="container-fluid">
            <RelatedProducts relatedProdcuts={data?.data?.relatedProducts} />
          </div>
        )}

      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        className="relative z-[100]"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/90 transition duration-300 ease-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex items-center justify-center">
          <DialogPanel
            transition
            className="relative w-full h-full outline-none transition duration-300 ease-out data-closed:opacity-0 data-closed:scale-95"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 end-3 z-30 text-white/90 hover:text-white p-2"
              aria-label="Close"
            >
              <FiX size={28} />
            </button>

            {images?.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showLightboxPrev();
                  }}
                  className="absolute start-1 md:start-4 top-1/2 -translate-y-1/2 z-30 text-white/90 hover:text-white p-2"
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={36} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showLightboxNext();
                  }}
                  className="absolute end-1 md:end-4 top-1/2 -translate-y-1/2 z-30 text-white/90 hover:text-white p-2"
                  aria-label="Next image"
                >
                  <FiChevronRight size={36} />
                </button>
              </>
            )}

            <Swiper
                key={`lightbox-${images?.join(",")}`}
                dir="ltr"
                initialSlide={lightboxIndex}
                spaceBetween={0}
                slidesPerView={1}
                speed={450}
                loop={images?.length > 1}
                zoom={{ maxRatio: 3, minRatio: 1, toggle: false }}
                modules={[Zoom, Navigation]}
                onSwiper={setLightboxSwiper}
                onSlideChange={(swiper) => {
                  setLightboxIndex(swiper.realIndex);
                  swiper.zoom?.out?.();
                }}
                className="w-full h-full product-lightbox-swiper"
              >
                {images?.map((image: string, i: number) => (
                  <SwiperSlide key={i} className="flex! items-center justify-center">
                    <div className="swiper-zoom-container flex items-center justify-center w-full h-full px-10 md:px-16">
                      <img
                        src={image}
                        alt="product large view"
                        className="max-h-[85vh] max-w-full object-contain select-none cursor-zoom-in"
                        onPointerDown={handleLightboxImagePointerDown}
                        onClick={handleLightboxImageClick}
                        draggable={false}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

            {images?.length > 1 && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-white/80 text-sm pointer-events-none">
                {lightboxIndex + 1} / {images.length}
              </p>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
