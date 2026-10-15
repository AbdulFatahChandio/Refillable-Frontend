"use client";

import { useTranslation } from "react-i18next";
import Button from "./Button";
import SecHd from "./SecHd";
import Image from "next/image";
import Subtitle from "./Subtitle";
import LinkButton from "./LinkButton";

export default function CTABanner({ section }: any) {

  const { t, i18n } = useTranslation();

  const getTranslation = (
    translations: any[] = [],
    key: "title" | "subtitle" | "description" | "buttonText" | "buttonUrl",
  ) => {
    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");

    if (i18n.language === "ar" && ar?.[key]) return ar[key];

    return en?.[key] ?? translations[0]?.[key] ?? "";
  };

  return (
    <section className="lg:py-40 py-10 px-3 relative bg-[url('/assets/images/cta.png')] bg-cover flex flex-col items-center justify-center md:gap-7 gap-4 text-center md:mt-20 mt-10">
      <Subtitle text={getTranslation(section?.translations, "subtitle") || "LIMITED TIME OFFER"} />
      <SecHd text={getTranslation(section?.translations, "title") || "Save 30% - Indulge in Luxury"} />
      <p>
        {getTranslation(section?.translations, "description") || "Enjoy exclusive savings across selected categories, including beauty, wellness, and lifestyle essentials."}
      </p>
      <LinkButton text={getTranslation(section?.translations, "buttonText") || "Shop Now"} 
        link={getTranslation(section?.translations, "buttonUrl") || "/collections"} 
      />
    </section>
  );
}
