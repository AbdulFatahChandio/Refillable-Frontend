"use client";

import { useTranslation } from "react-i18next";
import Button from "./Button";
import SecHd from "./SecHd";
import Image from "next/image";

export default function BenefitSec() {
  const { t } = useTranslation();

  return (
    <section className="lg:py-9 py-4 lg:px-20 md:px-10 px-3 relative bg-gold flex max-md:flex-wrap items-center md:justify-between justify-center gap-3 text-center">
      <div className="max-sm:w-full">
        <Image
          src="/assets/images/benefit.png"
          alt="Decoration"
          width={50}
          height={50}
          className="mx-auto max-md:max-w-7"
        />
        <h5 className="md:mt-7 mt-3 md:text-[28px] text-lg">{t("Gentle & Trusted")}</h5>
      </div>
      <div className="max-sm:w-full">
        <Image
          src="/assets/images/benefit.png"
          alt="Decoration"
          width={50}
          height={50}
          className="mx-auto max-md:max-w-7"
        />
        <h5 className="md:mt-7 mt-3 md:text-[28px] text-lg">{t("Thoughtfully Formulated")}</h5>
      </div>
      <div className="max-sm:w-full">
        <Image
          src="/assets/images/benefit.png"
          alt="Decoration"
          width={50}
          height={50}
          className="mx-auto max-md:max-w-7"
        />
        <h5 className="md:mt-7 mt-3 md:text-[28px] text-lg">{t("Suitable for Daily Use")}</h5>
      </div>
      <div className="max-sm:w-full">
        <Image
          src="/assets/images/benefit.png"
          alt="Decoration"
          width={50}
          height={50}
          className="mx-auto max-md:max-w-7"
        />
        <h5 className="md:mt-7 mt-3 md:text-[28px] text-lg">{t("Premium Ingredients")}</h5>
      </div>
    </section>
  );
}
