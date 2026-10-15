"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useGetPageAllContent } from "@/src/hooks/useGetPageAllContent";
import LinkButton from "./LinkButton";
import Subtitle from "./Subtitle";
import Spinner from "./Spinner";

type TranslationKey =
  | "title"
  | "subtitle"
  | "description"
  | "buttonText"
  | "buttonUrl";

const DEFAULT_IMAGES = {
  hero: "/assets/images/collection-banner.jpg",
  brand: "/assets/images/aboutImage.png",
  philosophy: "/assets/images/collection-banner.jpg",
  materials: "/assets/images/about.jpg",
  cta: "/assets/images/collection-banner.jpg",
};

function getMedia(
  section: any,
  kind: "background" | "foreground",
  fallback: string,
) {
  const medias =
    kind === "background"
      ? section?.backgroundMedias
      : section?.foregroundMedias;
  return medias?.[0] || fallback;
}

export default function AboutPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { data: content, isLoading } = useGetPageAllContent({
    pageName: "about-us",
  });

  const getTranslation = (
    translations: any[] = [],
    key: TranslationKey,
  ) => {
    const ar = translations.find((tr) => tr.language === "ar");
    const en = translations.find((tr) => tr.language === "en");

    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] ?? translations[0]?.[key] ?? "";
  };

  const heroSec = content?.data?.find(
    (sec: any) => sec?.type === "hero section",
  );
  const subSections: any[] = heroSec?.subContent ?? [];

  const findSection = (type: string) =>
    subSections.find((sec: any) => sec?.type === type);

  const sectionTwo = findSection("section two");
  const sectionThree = findSection("section three");
  const sectionFour = findSection("section four");
  const sectionFive = findSection("section five");
  const sectionSix = findSection("section six");

  if (isLoading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center px-3 py-20">
        <Spinner />
      </section>
    );
  }

  const heroTitle =
    getTranslation(heroSec?.translations, "title") ||
    "Exquisite jewellery crafted with care — a crystallization of art, innovation, craftsmanship, and passion";
  const heroBg = getMedia(heroSec, "background", DEFAULT_IMAGES.hero);

  return (
    <article dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-[#FCFAF7] px-3 py-14 lg:py-28"
        style={{
          backgroundImage: `url('${heroBg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#00000085]" />
        <div className="container-fluid relative z-10 mx-auto max-w-[900px] text-center">
          <h1 className="secHd text-white!">{heroTitle}</h1>
        </div>
      </section>

      {/* Brand intro — section two */}
      {sectionTwo && (
        <section className="container mt-10 grid grid-cols-1 items-center md:my-20 md:grid-cols-2">
          <div className="relative h-[220px] md:h-[300px] xl:h-[350px]">
            <Image
              src={getMedia(sectionTwo, "foreground", DEFAULT_IMAGES.brand)}
              alt={getTranslation(sectionTwo?.translations, "title") || "Bijou Sky"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center bg-secondary px-5 py-10 md:px-10 md:py-14 2xl:px-20">
            {getTranslation(sectionTwo?.translations, "subtitle") && (
              <Subtitle
                className="mb-4"
                text={getTranslation(sectionTwo?.translations, "subtitle")}
              />
            )}
            <h2 className="mb-6 font-boska-medium text-2xl text-primary md:text-3xl lg:text-4xl">
              {getTranslation(sectionTwo?.translations, "title")}
            </h2>
            {getTranslation(sectionTwo?.translations, "description") && (
              <p className="text-light-gray text-base leading-relaxed md:text-base 2xl:text-lg">
                {getTranslation(sectionTwo?.translations, "description")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Our Philosophy — section three */}
      {sectionThree && (
        <section className="relative overflow-hidden px-3 py-14 2xl:py-28 lg:py-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${getMedia(sectionThree, "background", DEFAULT_IMAGES.philosophy)}')`,
            }}
          />
          <div className="absolute inset-0 bg-[#00000085]" />
          <div className="container relative z-10 mx-auto max-w-[780px] text-center">
            <h2 className="mb-8 font-boska-bold text-2xl text-white md:text-4xl lg:text-5xl">
              {getTranslation(sectionThree?.translations, "title")}
            </h2>
            {getTranslation(sectionThree?.translations, "description") && (
              <p className="text-base leading-relaxed text-white/90 md:text-base 2xl:text-lg">
                {getTranslation(sectionThree?.translations, "description")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Our Materials — section four */}
      {sectionFour && (
        <section className="container grid grid-cols-1 items-center md:my-20 md:grid-cols-2">
          <div className="flex flex-col justify-center bg-secondary px-5 py-10 md:px-10 md:py-14 2xl:px-20">
            {getTranslation(sectionFour?.translations, "subtitle") && (
              <Subtitle
                className="mb-4"
                text={getTranslation(sectionFour?.translations, "subtitle")}
              />
            )}
            <h3 className="mb-6 font-boska-medium text-2xl md:text-3xl">
              {getTranslation(sectionFour?.translations, "title")}
            </h3>
            {getTranslation(sectionFour?.translations, "description") && (
              <p className="text-base leading-relaxed md:text-base 2xl:text-lg">
                {getTranslation(sectionFour?.translations, "description")}
              </p>
            )}
          </div>
          <div className="relative h-[220px] md:h-[300px] xl:h-[350px]">
            <Image
              src={getMedia(sectionFour, "foreground", DEFAULT_IMAGES.materials)}
              alt={getTranslation(sectionFour?.translations, "title")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>
      )}

      {/* Craftsmanship & Materials — section five */}
      {sectionFive && (
        <section className="bg-[#FCFAF7] px-3 py-12 2xl:py-24 lg:py-16">
          <div className="container mx-auto max-w-[780px] text-center">
            <h2 className="mb-8 font-boska-bold text-2xl text-primary md:text-4xl lg:text-5xl">
              {getTranslation(sectionFive?.translations, "title")}
            </h2>
            {getTranslation(sectionFive?.translations, "description") && (
              <p className="text-light-gray text-base leading-relaxed md:text-base 2xl:text-lg">
                {getTranslation(sectionFive?.translations, "description")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Closing CTA — section six */}
      {sectionSix && (
        <section className="relative overflow-hidden px-3 py-14 2xl:py-28 lg:py-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${getMedia(sectionSix, "background", DEFAULT_IMAGES.cta)}')`,
            }}
          />
          <div className="absolute inset-0 bg-[#00000085]" />
          <div className="container relative z-10 mx-auto max-w-[780px] text-center">
            <h2 className="mb-8 font-boska-bold text-2xl text-white md:text-4xl lg:text-5xl">
              {getTranslation(sectionSix?.translations, "title")}
            </h2>
            {getTranslation(sectionSix?.translations, "description") && (
              <p className="mb-10 text-base leading-relaxed text-white/90 md:text-base 2xl:text-lg">
                {getTranslation(sectionSix?.translations, "description")}
              </p>
            )}
            {getTranslation(sectionSix?.translations, "buttonText") && (
              <LinkButton
                btnTheme="light"
                icon
                text={getTranslation(sectionSix?.translations, "buttonText")}
                link={
                  getTranslation(sectionSix?.translations, "buttonUrl") ||
                  "/all-collections"
                }
                className="mx-auto w-fit"
              />
            )}
          </div>
        </section>
      )}
    </article>
  );
}
