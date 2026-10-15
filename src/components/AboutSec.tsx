"use client";

import { useEffect, useMemo } from "react";
import { useGetContent } from "../hooks/useGetContent";
import SecHd from "./SecHd";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Button from "./Button";
import Subtitle from "./Subtitle";
import LinkButton from "./LinkButton";
interface AboutSecProps {
  className?: string;
  section?: any;
  button?: boolean;
}

export default function AboutSec({
  className,
  section,
  button,
}: AboutSecProps) {
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
    <section className={`grid grid-cols-2 items-stretch ${className}`}>
      <div className="md:col-span-1 col-span-2">
        <Image
          src={"/assets/images/aboutImage.png"}
          alt="About Us"
          className="w-full object-cover"
          width={920}
          height={1000}
        />
      </div>
      <div className="md:col-span-1 col-span-2 2xl:px-20 md:px-10 px-3 py-5 md:gap-3 gap-3 flex flex-col justify-center bg-brown">
        <Subtitle className="text-[#DBBE94]!" text={getTranslation(section?.translations, "subtitle") || t("Our Atelier")} />
        <SecHd
        className="text-white!"
          text={
            getTranslation(section?.translations, "title") ||
            "Born from the earth, shaped by light."
          }
        />
        <p className="text-[#DBBE94]">
          {getTranslation(section?.translations, "description") ||
            "Each product is selected with care — prioritizing quality, trust, and everyday usability. From personal care and cosmetics to therapeutic solutions and essentials, BIJOU Sky brings together items that support balance, confidence, and well-being."}
        </p>

        {button &&
          <LinkButton btnTheme="light" className="w-fit mt-5"
          icon
            text={getTranslation(section?.translations, "buttonText") || "Read our story"}
            link={getTranslation(section?.translations, "buttonUrl") || "/"}
          />
        }
      </div>
    </section>
  );
}
