"use client";

import DashboardSecHd from "@/src/components/dashboard/DashboardSecHd";
import Pagination from "@/src/components/Pagination";
import Product from "@/src/components/Product";
import ProductError from "@/src/components/ProductError";
import { useWishlistProducts } from "@/src/hooks/wishlist/useWishlistProducts";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const SkeletonCard = () => (
  <div className="overflow-hidden animate-pulse relative">
    <div className="bg-light-brown/10 aspect-[4/5]" />
    <div className="w-full [&_span]:block mt-4 md:mt-5">
      <span className="lg:h-5 lg:w-40 h-4 w-30 bg-gray-200" />
      <span className="lg:h-4 lg:w-30 h-3 w-25 bg-gray-200 md:mt-2 mt-1" />
    </div>
  </div>
);

export default function WishlistPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useWishlistProducts({
    page,
    limit: 9,
  });
  const { t } = useTranslation();
  const products = data?.data ?? [];
  const totalpages = data?.meta?.totalPages ?? 1;

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
  };

  return (
    <>
      <DashboardSecHd text={t("Wishlist")} />
      <div className="grid grid-cols-10 lg:gap-14 gap-3 md:mt-10 mt-5">
        {isLoading &&
          Array.from({ length: 9 }).map((_, i) => (
            <div
              className="2xl:col-span-3 col-span-10 min-sm:col-span-5"
              key={i}
            >
              <SkeletonCard />
            </div>
          ))}

        {!isLoading &&
          products?.length > 0 &&
          products?.map((product, index) => (
            <div
              className="2xl:col-span-3 col-span-5"
              key={product.product?.id ?? index}
            >
              <Product product={product.product} wishlist />
            </div>
          ))}

        {!isLoading && products?.length === 0 && (
          <div className="md:mt-28 mt-18 col-span-10">
            <ProductError text={t("Wishlist Not Found!")} />
          </div>
        )}

        <div className="col-span-10">
          {!isLoading && totalpages > 0 && (
            <div className="mt-10">
              <Pagination
                totalPages={totalpages}
                currentPage={page}
                onPageChange={handlePageClick}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
