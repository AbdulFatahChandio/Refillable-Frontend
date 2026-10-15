"use client";

import AboutSec from "@/src/components/AboutSec";
import HeroBanner from "@/src/components/HeroBanner";
import ProductsSec from "@/src/components/ProductsSec";
import SocialSec from "@/src/components/SocialSec";
import { useGetPageAllContent } from "@/src/hooks/useGetPageAllContent";
import { useTranslation } from "react-i18next";
import CategorySec from "./CategorySec";
import QuoteSec from "./QuoteSec";
import { useProducts } from "../hooks/product/useProducts";
import { useCollections } from "../hooks/collection/useCollections";
import { useCollectionGetBySlug } from "../hooks/collection/useCollectionGetBySlug";
import { ProductType } from "../ts-types/generated";

export default function HomePage() {
  const { i18n } = useTranslation();
  const { data: content, isLoading: isSectionLoading, error: sectionError } = useGetPageAllContent({
    pageName: "home",
  });

  const {
    data: newArrivals,
    isLoading: isLoadingNewArrivals,
    error: newArrivalsError,
  } = useCollectionGetBySlug("new-arrivals", {
    limit: 4,
    page: 1,
  });

  const { data: bestSellers, isLoading: isLoadingBestSellers } = useProducts(
    "user",
    {
      limit: 4,
      sort: "best_selling",
    },
  );

  const sections = content?.data;
  const heroSec = sections?.find((sec: any) => sec?.type === "hero section");
  const aboutSec = sections?.find((sec: any) => sec?.type === "about section");
  const quoteSec = sections?.find((sec: any) => sec?.type === "quote section");
  const socialSec = sections?.find((sec: any) => sec?.type === "social section");
  const categorySec = sections?.find((sec: any) => sec?.type === "category section");

  
  const newArrivalsProducts =
    newArrivals?.data
      ?.map((item) => item.product)
      .filter((product): product is ProductType => Boolean(product)) ?? [];


  return (
    <>
      <HeroBanner section={heroSec} />
      <CategorySec section={categorySec} />
      <ProductsSec
        title={"New Arrivals"}
        description={"Just Landed"}
        link={`/collections/new-arrivals`}
        products={newArrivalsProducts}
        isLoading={isLoadingNewArrivals}
        error={newArrivalsError}
      />
      <AboutSec button section={aboutSec} />
      <div className="md:pt-20 pt-10">
        {!isLoadingBestSellers && bestSellers?.data && bestSellers?.data?.length > 0 && (
          <ProductsSec
            title="Our Best Sellers"
            description="Just Landed"
            link="/collections/best-sellers"
            products={bestSellers?.data}
            isLoading={isLoadingBestSellers}
          />
        )}
      </div>
      <SocialSec section={socialSec} isLoading={isSectionLoading} error={sectionError} />
      <QuoteSec section={quoteSec} />
    </>
  );
}
