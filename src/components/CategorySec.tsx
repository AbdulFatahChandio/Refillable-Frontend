"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks/product/useProducts";
import ProductError from "./ProductError";
import Button from "./Button";
import { useRouter } from "next/navigation";
import CategoryCard from "./CategoryCard";
import CustomSwiper from "./swiper/CustomSwiper";
import Subtitle from "./Subtitle";
import SecHd from "./SecHd";

export default function CategorySec({ section }: any) {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError, error, refetch } = useCategories({
    depth: 3,
    limit: 6,
  });

  const categories = data?.data ?? [];

  const getTranslation = (
    translations: any[] = [],
    key:
      | "title"
      | "subtitle"
      | "description"
      | "buttonText"
      | "buttonUrl"
      | "buttonUrl"
      | "icon",
  ) => {
    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] ?? translations[0]?.[key] ?? "";
  };

  const SkeletonCard = () => (
    <div className="overflow-hidden bg-light-brown/10 h-[200px] lg:h-100 animate-pulse relative">
      <div className="absolute md:bottom-10 bottom-3 md:px-10 px-2 start-0 text-white w-full [&_span]:block">
        <span className="lg:h-4 lg:w-40 h-3 w-30 bg-gray-200" />
        <span className="lg:h-5 lg:w-30 h-4 w-25 bg-gray-200 md:my-4 my-2" />
        <span className="lg:h-4 lg:w-50 h-3 w-35 bg-gray-200" />
      </div>
    </div>
  );

  return (
    <section className="category-sec relative md:py-20 py-10 lg:py-[100px]">
      <div className="container-fluid mb-10">

        <div className="text-center">
          <Subtitle text={getTranslation(section?.translations, "subtitle") || "Find Your Piece"} />
          <SecHd text={getTranslation(section?.translations, "title") || "Shop by Category"} />
        </div>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-2 divide-x divide-y divide-light-brown/10">
        {
          isLoading &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

        {isError && !isLoading && (
          <div className="md:col-span-3 col-span-2">
            <ProductError
              text={
                error
                  ? (error as any)?.message
                  : "Something went wrong"
              }
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => refetch()}
                className="mx-auto rounded-lg border border-black/15 bg-black/5 px-4 py-2 hover:bg-black/10 transition"
              >
                {t("Retry")}
              </button>
            </div>
          </div>
        )}

        {/* <div className="md:col-span-2 col-span-1">
            <Button
              text={t("Explore More")} btnTheme="dark" className="min-md:hidden mx-auto" icon onClick={() => router.push(link)} />
          </div> */}

        {!isLoading && !isError && categories.length === 0 && (
          <div className="col-span-12 mt-6">
            <ProductError text={"No categories found!"} />
          </div>
        )}
      </div>
      <div className="grid md:grid-cols-3 grid-cols-2">
        {categories.map((item, index) => {
          return (
            <CategoryCard category={item} key={index} />
          )
        })}
      </div>
    </section>
  );
}
