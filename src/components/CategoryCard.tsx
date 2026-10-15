"use client";

import Image from "next/image";
import { CategoryType, ProductType } from "../ts-types/generated";
import { useTranslation } from "react-i18next";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { KeyboardEvent, useMemo } from "react";
import { IoCart, IoHeartCircleOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { useAddWishlist } from "../hooks/wishlist/useAddWishlist";
import { useRemoveWishlist } from "../hooks/wishlist/useRemoveWishlist";
import { useUserStore } from "../store/useUserStore";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "../store/useCartStore";
import { useModalStore } from "../store/useModalStore";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";

type CategoryProps = {
  category: CategoryType;
};

const formatPrice = (n?: number, currency = "PKR") => {
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

export default function CategoryCard({ category }: CategoryProps) {
  const { i18n, t } = useTranslation();
  const router = useAppRouter();

  const getTranslation = (translations: any[], key: "name" | "description") => {
    if (!translations || translations.length === 0) return "";
    const ar = translations.find((tr: any) => tr.language === "ar");
    const en = translations.find((tr: any) => tr.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] || translations[0]?.[key] || "";
  };

  const name = useMemo(
    () =>
      getTranslation((category as any)?.translations ?? [], "name") ||
      t("Untitled"),
    [category, i18n.language],
  );

  return (
    <div
      className="cursor-pointer relative group overflow-hidden"
        onClick={() =>
          router.push(
            `/collections/${getTranslation(category?.translations, "name")?.toLowerCase()?.split(" ").join("-")}?id=${category?.id}`,
          )
        }
    >
      <img
        src={category?.image ?? "/assets/images/defaultImage.png"}
        // src={"/assets/images/category.png"}
        alt={name}
        className="w-full group-hover:scale-120 duration-8000 h-full object-cover"
        width={500}
        height={500}
      />
      <div className="absolute md:bottom-10 bottom-3 md:px-10 px-2 start-0 text-white w-full">
        <span className="2xl:text-[12px] md:text-[10px] text-[8px] uppercase 2xl:tracking-[4px] tracking-[2px]">18k gold plated</span>
        <h3 className="2xl:text-4xl md:text-2xl text-xl md:mt-2 md:mb-4 mt-1 mb-2">{name}</h3>
        <Link className="inline-flex items-center justify-center font-semibold uppercase 2xl:tracking-[4px] tracking-[2px] max-2xl:text-[12px] max-md:text-[10px]"
          href={`/collections/${getTranslation(category?.translations, "name")?.toLowerCase()?.split(" ").join("-")}?id=${category?.id}`}>
          {t("View Products")}
          <GoArrowRight className="ms-2" />
        </Link>
      </div>
    </div>
  );
}
