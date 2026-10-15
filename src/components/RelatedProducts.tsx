"use client";

import React, { useEffect } from "react";
import { ProductType } from "../ts-types/generated";
import Product from "./Product";
import SecHd from "./SecHd";
import { useTranslation } from "react-i18next";

export default function RelatedProducts({
  relatedProdcuts,
}: {
  relatedProdcuts: ProductType[];
}) {
 
  const { t } = useTranslation();

  return (
    <div className="md:mt-20 mt-5">
      <SecHd text={t("You May Also Like")} />
      <div className="grid lg:grid-cols-4 grid-cols-2 md:gap-7 gap-3 mt-5">
        {relatedProdcuts?.slice(0, 4)?.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
