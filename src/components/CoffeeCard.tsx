"use client";

import Image from "next/image";
import Link from "next/link";
import { KeyboardEvent, useMemo } from "react";
import { ProductType } from "../ts-types/generated";

import { PiShareNetworkLight } from "react-icons/pi";
import { RxPlusCircled } from "react-icons/rx";
import { IoHeartCircleOutline } from "react-icons/io5";
import { IoCart } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";

import { useAddWishlist } from "../hooks/wishlist/useAddWishlist";
import { useRemoveWishlist } from "../hooks/wishlist/useRemoveWishlist";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/useCartStore";
import { useUserStore } from "../store/useUserStore";
import { toast } from "react-toastify";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { getProductUrl } from "@/src/lib/seo/slugs";
import { useModalStore } from "../store/useModalStore";

type ProductProps = {
  product: ProductType;
  view: "list" | "column" | string;
  wishlist?: boolean; // true when rendering on wishlist page
};

const formatPrice = (n?: number, currency = "AED") => {
  if (typeof n !== "number") return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `AED ${n}`;
  }
};

export default function CoffeeCard({ product, view, wishlist }: ProductProps) {
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();
  const { addToCart } = useCartStore();
  const { user } = useUserStore();
  const { mutate: addWishlist, isPending: addPending } = useAddWishlist();
  const { mutate: removeWishlist, isPending: removePending } =
    useRemoveWishlist();
  const router = useAppRouter();
  const { openModal } = useModalStore();

  /** helpers */
  const getTranslation = (
    translations: any[] = [],
    key: "name" | "description",
  ) => {
    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] ?? translations[0]?.[key] ?? "";
  };

  const basePrice =
    typeof (product as any)?.price === "number"
      ? (product as any).price
      : undefined;

  const discountedPrice = useMemo(() => {
    if (!product?.specialOffer?.discountPercent || !basePrice) return null;
    const off = Number(product.specialOffer.discountPercent) || 0;
    return Math.max(0, Math.round(basePrice * (1 - off / 100))) as number;
  }, [product, basePrice]);

  const displayPrice = (p?: number | null) => formatPrice(p ?? undefined);

  const handleShare = async (url: string | number) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Refillable Coffee",
          text: "Check out this product!",
          url: `${window.location.origin}${getProductUrl(product)}`,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const handleAdd = (p: ProductType) => {
    addToCart({
      id: p?.id,
      translations: p?.translations,
      price: discountedPrice ?? p?.price ?? 0,
      quantity: 1,
      images: p?.imageUrls,
    });
    toast.success("Product added to cart");
  };

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

  // Add/Remove wishlist using your API hooks
  const toggleWishlist = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    const shouldRemove = wishlist || !!product?.isWishlisted;
    const onSuccess = () => {
      // invalidate common caches
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    };

    if (shouldRemove) {
      removeWishlist({ id }, { onSuccess });
    } else {
      addWishlist({ id }, { onSuccess });
    }
  };

  /** small subcomponents */
  const Price = () => (
    <div className="mt-2 flex items-center gap-2">
      {discountedPrice !== null ? (
        <>
          <span className="md:text-lg text-[12px] text-[#393939]">
            {displayPrice(discountedPrice)}
          </span>
          <span className="md:text-sm text-[12px] opacity-70 line-through">
            {displayPrice(basePrice)}
          </span>
        </>
      ) : (
        <span className="md:text-lg text-[12px]">
          {displayPrice(basePrice)}
        </span>
      )}
    </div>
  );

  const Badges = () => (
    <>
      {product?.limited && (
        <span className="absolute left-3 bottom-3 text-[10px] rounded-full px-2 py-1 bg-black/70 text-white tracking-widest">
          {t("LIMITED")}
        </span>
      )}

      {!!product?.specialOffer?.discountPercent && (
        <span className="absolute left-3 top-3 text-xs rounded-full px-2 py-1 border border-emerald-400/30 bg-emerald-400/10">
          -{product.specialOffer.discountPercent}%
        </span>
      )}
    </>
  );


    const name =
    getTranslation((product as any)?.translations ?? [], "name") || "Untitled";

  const images = product?.productVariants
    ?.find((variant: any) =>
      variant?.productVariantValues?.some(
        (vv: any) => vv?.imageUrls?.length > 0,
      ),
    )
    ?.productVariantValues?.find((vv: any) => vv?.imageUrls?.length > 0)
    ?.imageUrls || product?.imageUrls;

  /** ---------------- LIST VIEW ---------------- */
  if (view === "list") {
    return (
      <div className="group relative grid h-full grid-cols-1 md:grid-cols-[280px_1fr] gap-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 md:p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
        <div className="relative">
          <Link href={getProductUrl(product)}>
            <div className="overflow-hidden rounded-xl bg-black/10">
              <Image
                src={product?.imageUrls?.[0]}
                width={560}
                height={420}
                alt={getTranslation(product?.translations, "name") || "product"}
                className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 280px"
                priority={false}
              />
            </div>
          </Link>
          <Badges />

          {/* Heart bottom-left: toggle add/remove */}
          <button
            onClick={(e) => toggleWishlist(e, String(product?.id))}
            className="absolute bottom-3 start-3 text-white/90 hover:text-white"
            aria-label={
              wishlist || product?.isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            disabled={addPending || removePending}
          >
            {wishlist || product?.isWishlisted ? (
              <IoHeartCircleOutline className="size-8 drop-shadow" />
            ) : (
              <IoMdHeartEmpty className="size-8 drop-shadow" />
            )}
          </button>
        </div>

        <div className="flex flex-col justify-between">
          <div className="pe-1">
            <p className="uppercase text-xs tracking-widest text-primary/70">
              {getTranslation(product?.category?.translations, "name")}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-primary leading-tight">
              {getTranslation(product?.translations, "name")}
            </h3>
            <p className="mt-3 text-sm normal-case text-primary/80 line-clamp-3 border-b border-white/10 pb-4">
              {getTranslation(product?.translations, "description")}
            </p>
            <Price />
          </div>
          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => handleShare(product?.id || "")}
              aria-label="Share product"
              className="grid place-items-center size-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-secondary transition"
            >
              <PiShareNetworkLight className="size-5" />
            </button>

            {product?.inStock ? (
              <button
                type="button"
                onClick={() => handleAdd(product)}
                aria-label="Add to cart"
                className="grid place-items-center size-10 rounded-full bg-primary text-secondary hover:brightness-110 transition shadow-md"
              >
                <RxPlusCircled className="size-6" />
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-full bg-zinc-500/20 text-[10px] tracking-wider text-primary">
                OUT OF STOCK
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  /** ---------------- COLUMN VIEW ---------------- */
  if (view === "column") {
    return (
      <div className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
        <div className="relative">
          <Link href={getProductUrl(product)}>
            <div className="mx-auto w-full overflow-hidden rounded-xl bg-black/5">
              <Image
                src={product?.imageUrls?.[0]}
                width={560}
                height={420}
                alt={getTranslation(product?.translations, "name") || "product"}
                className="h-[230px] w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
          <Badges />
        </div>

        <div className="mt-4 flex flex-col">
          <p className="uppercase text-xs tracking-widest text-primary/70">
            {getTranslation(product?.category?.translations, "name")}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-primary line-clamp-2">
            {getTranslation(product?.translations, "name")}
          </h3>
          <p className="mt-2 text-sm normal-case text-primary/80 line-clamp-3 border-b border-white/10 pb-3">
            {getTranslation(product?.translations, "description")}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Price />
            <div className="flex items-center gap-3">
              {/* Wishlist toggle */}
              <button
                type="button"
                onClick={(e) => toggleWishlist(e, String(product?.id))}
                aria-label={
                  wishlist || product?.isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className="grid place-items-center size-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-secondary transition"
                disabled={addPending || removePending}
              >
                {wishlist || product?.isWishlisted ? (
                  <IoHeartCircleOutline className="size-5" />
                ) : (
                  <IoMdHeartEmpty className="size-5" />
                )}
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={() => handleShare(product?.id || "")}
                aria-label="Share product"
                className="grid place-items-center size-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-secondary transition"
              >
                <PiShareNetworkLight className="size-5" />
              </button>

              {/* Add to cart */}
              {product?.inStock ? (
                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  aria-label="Add to cart"
                  className="grid place-items-center size-10 rounded-full bg-primary text-secondary hover:brightness-110 transition shadow-md"
                >
                  <RxPlusCircled className="size-6" />
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-full bg-zinc-500/20 text-[10px] tracking-wider text-primary">
                  OUT OF STOCK
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** ---------------- DEFAULT GRID VIEW (your Product design + wishlist & share) ---------------- */



  return (
    <div
      role="link"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={onKey}
      className="group cursor-pointer overflow-hidden"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/5">
        {/* main image */}
        <Image
          src={
            images?.[0] ||
            "/assets/images/defaultImage.jpg"
          }
          alt={name}
          fill
          sizes="100%"
          className={`transition object-cover ${
            product?.imageUrls?.length > 1 ? "group-hover:opacity-0" : ""
          }`}
        />

        {/* hover image – static like your example */}
        {images?.length > 1 && (
          <Image
            src={images?.[1]}
            alt={name}
            fill
            sizes="100%"
            className="transition opacity-0 group-hover:opacity-100"
          />
        )}

        <Badges />

        {/* right side hover actions – cart + wishlist + share */}
        <div
          className="
            absolute right-4 top-5 flex flex-col gap-2 text-white text-xl
            md:opacity-0 md:group-hover:opacity-100 opacity-100
            transition
          "
        >
          {/* ADD TO CART */}
          {product?.inStock && !product?.comingSoon && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openModal("ADD_TO_CART_MODAL", product);
              }}
              aria-label="Add to cart"
              className="p-1 bg-primary md:w-9 md:h-9 w-7 h-7 flex items-center justify-center"
            >
              <IoCart />
            </button>
          )}

          {/* WISHLIST: toggle */}
          <button
            type="button"
            onClick={(e) => toggleWishlist(e, String(product?.id))}
            aria-label={
              wishlist || product?.isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className="p-1 bg-primary md:w-9 md:h-9 w-7 h-7 flex items-center justify-center disabled:opacity-60"
            disabled={addPending || removePending}
          >
            {wishlist || product?.isWishlisted ? (
              <IoHeartCircleOutline />
            ) : (
              <IoMdHeartEmpty />
            )}
          </button>

          {/* SHARE */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleShare(product?.id || "");
            }}
            aria-label="Share product"
            className="p-1 bg-primary md:w-9 md:h-9 w-7 h-7 flex items-center justify-center"
          >
            <PiShareNetworkLight className="text-base" />
          </button>
        </div>
      </div>

      <div className="py-4 md:py-5">
        <h5 className="capitalize font-medium text-primary md:text-2xl text-sm line-clamp-1 mb-2">
          {name}
        </h5>

        <Price />
      </div>
    </div>
  );
}
