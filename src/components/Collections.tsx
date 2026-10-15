"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ProductError from "./ProductError";
import Product from "./Product";

export default function CollectionProducts({
  products,
  view,
  isLoading,
  isFetchingMore,
  total,
  page,
  totalPages,
  handlePageClick,
}: any) {
  const { t } = useTranslation();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const handlePageClickRef = useRef(handlePageClick);
  const hasMore = page < totalPages && total > 0;
  const canLoadMore = hasMore && !isLoading && !isFetchingMore;

  handlePageClickRef.current = handlePageClick;

  const SkeletonCard = () => (
    <div className="overflow-hidden animate-pulse relative">
      <div className="bg-light-brown/10 h-[170px] lg:h-100" />
      <div className="text-white w-full [&_span]:block mt-4">
        <span className="lg:h-5 lg:w-40 h-4 w-30 bg-gray-200" />
        <span className="lg:h-4 lg:w-30 h-3 w-25 bg-gray-200 md:mt-2 md:mb-4 mt-1 mb-2" />
      </div>
    </div>
  );

  const cardColClass =
    view === "list"
      ? "col-span-12"
      : view === "column"
        ? "md:col-span-6 col-span-12"
        : "xl:col-span-4 lg:col-span-4 col-span-6";

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !canLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handlePageClickRef.current?.();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [canLoadMore, page]);

  return (
    <section className="">
      <div className=" grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12">
          {products?.length > 0 && (
            <div className="grid grid-cols-12 lg:gap-10 gap-4">
              {products?.map((product: any, index: any) => (
                <div
                  className={cardColClass}
                  key={product?.id ?? `${index}`}
                >
                  <Product product={product} key={product?.id ?? index} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && products?.length === 0 && (
            <ProductError text={t("Products Not Found")} />
          )}

          {isLoading && (
            <div className="grid grid-cols-12 lg:gap-10 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className={cardColClass} key={i}>
                  <SkeletonCard />
                </div>
              ))}
            </div>
          )}

          {isFetchingMore && (
            <div className="grid grid-cols-12 lg:gap-10 gap-4 mt-4 lg:mt-10">
              {Array.from({ length: 3 }).map((_, i) => (
                <div className={cardColClass} key={i}>
                  <SkeletonCard />
                </div>
              ))}
            </div>
          )}

          {canLoadMore && (
            <div ref={loadMoreRef} className="h-1 w-full" aria-hidden />
          )}
        </div>
      </div>
    </section>
  );
}
