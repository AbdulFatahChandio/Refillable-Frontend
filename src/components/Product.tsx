"use client";

import Image from "next/image";
import { ProductType } from "../ts-types/generated";
import { useTranslation } from "react-i18next";
import { getProductUrl } from "@/src/lib/seo/slugs";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { KeyboardEvent, useEffect, useState } from "react";
import { IoHeartCircleOutline } from "react-icons/io5";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useAddWishlist } from "../hooks/wishlist/useAddWishlist";
import { useRemoveWishlist } from "../hooks/wishlist/useRemoveWishlist";
import { useUserStore } from "../store/useUserStore";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "../store/useCartStore";
import { useModalStore } from "../store/useModalStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCurrencyCode } from "@/src/hooks/useFormatPrice";
import { formatPrice } from "@/src/utils/formatPrice";
import { getProductPrices } from "@/src/utils/productPrice";

type ProductProps = {
  product: ProductType;
  currency?: string;
  /** true when rendered on wishlist page — treat as already wishlisted */
  wishlist?: boolean;
};

export default function Product({
  product,
  currency: currencyProp,
  wishlist = false,
}: ProductProps) {
  const storeCurrency = useCurrencyCode();
  const currency = currencyProp || product?.currency || storeCurrency;
  const { i18n, t } = useTranslation();
  const router = useAppRouter();
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const { addToCart } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(
    wishlist || !!product?.isWishlisted,
  );

  useEffect(() => {
    setIsWishlisted(wishlist || !!product?.isWishlisted);
  }, [product?.id, product?.isWishlisted, wishlist]);

  const getTranslation = (
    translations: any[] = [],
    key: "name" | "description",
  ) => {
    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] ?? translations[0]?.[key] ?? "";
  };
  const name = getTranslation(product?.translations, "name");

  const { price, discountedPrice, discountPercent, hasDiscount } =
    getProductPrices(product);

  const goDetail = () => {
    if (!product?.id) return;
    router.push(getProductUrl(product));
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goDetail();
    }
  };

  const { mutate, isPending } = useAddWishlist();
  const { mutate: removeProductWishlist, isPending: isPendingRemove } =
    useRemoveWishlist();

  const { increment, decrement } = useWishlistStore();

  const toggleWishlist = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    pid: string,
  ) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    const nextWishlisted = !isWishlisted;
    setIsWishlisted(nextWishlisted);

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
    };

    if (!nextWishlisted) {
      removeProductWishlist(
        { id: pid },
        {
          onSuccess: () => {
            invalidate();
            decrement();
          },
          onError: () => setIsWishlisted(true),
        },
      );
    } else {
      mutate(
        { id: pid },
        {
          onSuccess: () => {
            invalidate();
            increment();
          },
          onError: () => setIsWishlisted(false),
        },
      );
    }
  };

  const handleAdd = (p: ProductType) => {
    addToCart({
      id: p?.id,
      translations: p?.translations,
      price: getProductPrices(p).finalPrice,
      quantity: 1,
      images: p?.imageUrls,
    });
    toast.success(t("Product added to cart"));
  };

  const { openModal } = useModalStore();

  return (
    <div
      className="group overflow-hidden cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={onKey}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/5">
        <img
          src={product?.imageUrls?.[0] || "/assets/images/defaultImage.jpg"}
          alt={name}
          className={`object-cover absolute inset-0 w-full h-full transition delay-300 ${product?.imageUrls?.length > 1 ? "group-hover:opacity-0" : ""}`}
        />
        {product?.imageUrls?.length > 1 && (
          <img
            src={product?.imageUrls?.[1]}
            alt={name}
            
            className={`object-cover absolute inset-0 w-full h-full transition opacity-0 delay-300 group-hover:opacity-100`}
          />
        )}

        <div className="flex absolute inset-x-0 md:top-5 top-3 md:pe-4 pe-2 justify-between items-start gap-2">
          {product?.inStock === false && (
            <span className="md:text-[12px] text-[10px] uppercase tracking-[1px] md:px-5 px-2 md:py-3 py-2 bg-primary text-secondary shrink-0">
              {product?.comingSoon ? t("Coming Soon") : t("Out of Stock")}
            </span>
          )}

          <div className="flex flex-col gap-2 ms-auto text-white text-xl lg:opacity-0 lg:group-hover:opacity-100 duration-500">
            <button
              className="p-1 bg-secondary text-primary flex items-center justify-center"
              type="button"
              onClick={(e) => toggleWishlist(e, String(product?.id))}
              disabled={isPending || isPendingRemove}
            >
              {isWishlisted ? (
                <IoMdHeart className="max-md:text-[15px]" />
              ) : (
                <IoMdHeartEmpty className="max-md:text-[15px]" />
              )}
            </button>
          </div>
        </div>
        {/* {product?.inStock && !product?.comingSoon && (
          <Button
            text={t("Add to Cart")}
            className="!absolute duration-500 w-[95%] lg:-bottom-full transition-all lg:group-hover:bottom-5 bottom-5 left-1/2 -translate-x-1/2"
            onClick={(e) => {
              e.stopPropagation();
              openModal("ADD_TO_CART_MODAL", product);
            }}
          />
        )} */}
      </div>

      <div className="pt-4 md:pt-5 cursor-pointer">
        {/* {product?.productCategories?.length > 0 && (
          <p className="text-[12px] font-inter! uppercase mb-4">
            {getTranslation(
              product?.productCategories?.[0]?.category?.translations,
              "name",
            )}
          </p>
        )} */}

        <div className="flex flex-col gap-2">
          <h5 className="capitalize line-clamp-2 2xl:text-4xl md:text-2xl text-xl">
            {name}
          </h5>

          {hasDiscount ? (
            <p className="flex flex-wrap items-center gap-2 md:text-base 2xl:text-xl text-[12px] font-medium text-brown">
              <span>{formatPrice(discountedPrice, currency)}</span>
              <span className="line-through opacity-60 decoration-1 font-normal text-light-gray">
                {formatPrice(price, currency)}
              </span>
              <span className="rounded-full bg-light-gold text-brown px-3 py-1.5 text-[10px] md:text-xs font-semibold leading-none">
                -{discountPercent}%
              </span>
            </p>
          ) : (
            <p className="md:text-base 2xl:text-xl font-medium text-[12px] text-brown">
              {formatPrice(price, currency)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
