"use client";

import { useTranslation } from "react-i18next";
import ProductsSec from "./ProductsSec";
import ProductError from "./ProductError";
import { useCollections } from "../hooks/collection/useCollections";
import { CollectionType, ProductType } from "../ts-types/generated";
import { useCollectionGetBySlug } from "../hooks/collection/useCollectionGetBySlug";
import CollectionPageBanner from "./CollectionPageBanner";

function CollectionSectionSkeleton() {
  return (
    <section className="relative md:pb-20 pb-10 animate-pulse">
      <div className="container-fluid">
        <div className="mb-10 md:mb-12 space-y-3">
          <div className="h-3 md:h-4 w-24 bg-gray-200" />
          <div className="h-7 md:h-12 w-48 md:w-72 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="overflow-hidden">
              <div className="bg-light-brown/10 h-[170px] lg:h-100" />
              <div className="mt-4 space-y-2">
                <div className="lg:h-5 lg:w-40 h-4 w-30 bg-gray-200" />
                <div className="lg:h-4 lg:w-30 h-3 w-25 bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getCollectionTranslation(
  collection: CollectionType | undefined,
  language: string,
) {
  const translations = collection?.translations ?? [];
  return (
    translations.find((tr: any) => tr.language === language) ||
    translations.find((tr: any) => tr.language === "en") ||
    translations[0]
  );
}

function CollectionSection({ collection }: { collection: CollectionType }) {
  const { i18n } = useTranslation();
  const { data: listing, isLoading, error } = useCollectionGetBySlug(
    collection.slug ?? "",
    { limit: 4, page: 1 },
  );
  const products =
    listing?.data
      ?.map((item) => item.product)
      .filter((product): product is ProductType => Boolean(product)) ?? [];

  const translation = getCollectionTranslation(collection, i18n.language);


  return (
    <ProductsSec
      title={translation?.name}
      description={translation?.description || "Explore"}
      link={`/collections/${collection.slug}`}
      products={products}
      isLoading={isLoading}
      error={error}
    />
  );
}

export default function AllCollectionsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useCollections({ limit: 99 });

  const collections =
    data?.data
      ?.filter((c) => c?.slug && c?.isActive !== false && c?.slug !== "new-arrivals")
      ?.sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0)) ?? [];


  return (
    <div>
      <CollectionPageBanner title={t("Collections")} />

      <div className="md:pt-16 pt-10">
        {isLoading &&
          Array.from({ length: 2 }).map((_, index) => (
            <CollectionSectionSkeleton key={index} />
          ))}

        {error && !isLoading && (
          <div className="container-fluid">
            <ProductError
              text={
                (error as any)?.response?.data?.message ||
                "Something went wrong"
              }
            />
          </div>
        )}

        {!isLoading && !error && collections.length === 0 && (
          <div className="container-fluid">
            <ProductError text="No collections found!" />
          </div>
        )}

        {!isLoading &&
          collections.map((collection) => (
            <CollectionSection
              key={collection.id ?? collection.slug}
              collection={collection}
            />
          ))}
      </div>
    </div>
  );
}
