"use client";


import Button from "./Button";
import { useTranslation } from "react-i18next";
import Subtitle from "./Subtitle";
import LinkButton from "./LinkButton";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

export default function HeroImageSlider({ section }: any) {
  const { i18n } = useTranslation();
  const getTranslation = (
    translations: any[] = [],
    key:
      | "title"
      | "subtitle"
      | "description"
      | "buttonText"
      | "buttonUrl"
      | "icon",
  ) => {
    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] ?? translations[0]?.[key] ?? "";
  };

  const title =
  getTranslation(section?.translations, "title") || "Artistry in the golden hour";

const words = title.split(" ");

const lastTwoWords = words.slice(-2).join(" ");
const firstWords = words.slice(0, -2).join(" ");


  return (
    <section
      className={`relative pt-6 pb-10 flex items-end bg-[#FCFAF7]`}
    >
      <span className="absolute font-cormorant 2xl:text-[315px] lg:text-[240px] text-[#6D49170D] 2xl:-top-22 lg:-top-16 max-lg:hidden start-[52%] -translate-x-1/2">BIJOU</span>
      {/* <div style={{
        backgroundImage: `url('/assets/images/hero.png')`,
      }} className="absolute md:min-h-[calc(100dvh-130px)] h-full w-full top-0 start-0 bg-cover bg-center bg-no-repeat rtl:-scale-x-100"/> */}
      <div className="grid grid-cols-12 relative z-20 items-center container-fluid max-md:gap-y-10">
        <div className="lg:col-span-6 md:col-span-8 col-span-12 md:space-y-6 space-y-3 md:pe-15">
          <Subtitle text={getTranslation(section?.translations, "subtitle") || "Fine Jewellery · Est. 2026"} />
          <h1 className="2xl:text-7xl md:text-[52px] text-2xl">
            {firstWords} <span className="text-brown block">{lastTwoWords}</span>
          </h1>
          <p className="2xl:text-lg! text-sm!">
            {getTranslation(section?.translations, "description") ||
              "Hand-finished 18K gold-plated pieces, made to catch the soft warmth of twilight on bare skin. Designed to be layered, lived in, and loved."}
          </p>
          <div className="flex items-center 2xl:gap-10 md:gap-5 gap-3 flex-wrap">
            <LinkButton icon btnTheme="dark" text={getTranslation(section?.translations, "buttonText") || "EXPLORE COLLECTION"} link={"/all-collections"} />
            <Link href="/collections/new-arrivals" className="flex items-center gap-2 font-semibold max-md:text-[10px] max-2xl:text-[12px] text-light-brown pb-2.5 border-b-2 border-black 2xl:tracking-[4px] tracking-[2px]">NEW ARRIVALS <HiOutlineArrowLongRight className='rtl:rotate-180' /></Link>
          </div>
          
      </div>
      <div className="lg:col-span-6 md:col-span-4 col-span-12">
        <Image src={section?.foregroundMedias[0] || "/assets/images/hero-img.png"} alt="hero" width={900} height={1000} />
      </div>
    </div>
    </section >
  );
}
