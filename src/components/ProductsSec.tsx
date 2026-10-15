"use client";

import { useTranslation } from "react-i18next";
import Product from "./Product";
import ProductError from "./ProductError";
import Subtitle from "./Subtitle";
import LinkButton from "./LinkButton";

export default function ProductsSec({ title, description, link, products, isLoading, error }: any) {
  const { t } = useTranslation();

  const SkeletonCard = () => (
    <div className="overflow-hidden animate-pulse relative">
      <div className="bg-light-brown/10 h-[170px] lg:h-100" />
      <div className=" text-white w-full [&_span]:block mt-4">
        <span className="lg:h-5 lg:w-40 h-4 w-30 bg-gray-200" />
        <span className="lg:h-4 lg:w-30 h-3 w-25 bg-gray-200 md:mt-2 md:mb-4 mt-1 mb-2" />
      </div>
    </div>
  );

  return (
    <section className="relative md:pb-20 pb-10">
      <div className="container-fluid">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-10 md:mb-12">
          <div>
            <Subtitle text={t(description)} />
            <h2 className="secHd">{t(title)}</h2>
          </div>
          {!isLoading && products?.length > 0 && (
            <LinkButton
              text={t("Explore All")}
              btnTheme="dark"
              icon
              className="max-md:hidden"
              link={link}
            />
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

          {error && !isLoading && (
            <div className="lg:col-span-4 col-span-2">
              <ProductError
                text={
                  error
                    ? error?.message
                    : "Something went wrong"
                }
              />

            </div>
          )}

          {!isLoading &&
            products?.map((p: any, idx: number) => (
              <Product product={p} key={p?.id ?? idx} />
            ))}

          {!isLoading && !error && products?.length === 0 && (
            <div className="col-span-2 lg:col-span-4 mt-6">
              <ProductError text={"No products found!"} />
            </div>
          )}
          {!isLoading && products?.length > 0 && (
            <div className="col-span-2 lg:col-span-4">
              <LinkButton
                text={t("Explore More")}
                btnTheme="dark"
                icon
                className="min-md:hidden! mx-auto flex! max-w-max"
                link={link}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
