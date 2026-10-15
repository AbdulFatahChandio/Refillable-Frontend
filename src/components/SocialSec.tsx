"use client";

import { useTranslation } from "react-i18next";
import SecHd from "./SecHd";
import Image from "next/image";
import Subtitle from "./Subtitle";
import CustomSwiper from "./swiper/CustomSwiper";
import Link from "next/link";
import ProductError from "./ProductError";

const socials = [
  {
    img: "/assets/images/social.jpg",
  },
  {
    img: "/assets/images/social.jpg",
  },
  {
    img: "/assets/images/social.jpg",
  },
  {
    img: "/assets/images/social.jpg",
  },
  {
    img: "/assets/images/social.jpg",
  },
  {
    img: "/assets/images/social.jpg",
  },
  {
    img: "/assets/images/social.jpg",
  },
];

export default function SocialSec({ section, isLoading, error }: any) {


  const SkeletonCard = () => (

    <div className="overflow-hidden animate-pulse relative bg-light-brown/10 h-[170px] lg:h-100" />

  );


  const getTranslation = (
    translations: any[] = [],
    key:
      | "title"
      | "subtitle"
      | "description"
      | "buttonText"
      | "buttonUrl"
      | "buttonUrl"
      | "icon",
  ) => {
    const ar = translations.find((t) => t.language === "ar");
    const en = translations.find((t) => t.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] ?? translations[0]?.[key] ?? "";
  };


  const { t, i18n } = useTranslation();

  const socialPosts = section?.subContent || [];


  return (
    <section className="lg:pb-20 pb-10">
      <div className="space-y-2 text-center px-3 md:mb-10 mb-8">
        <Subtitle text={getTranslation(section?.translations, "subtitle") || "@bijousky"} />
        <SecHd text={getTranslation(section?.translations, "title") || "Follow Us on Instagram"} />
      </div>
      <div className="grid grid-cols-5 divide-x divide-light-brown/10">
        {
        isLoading &&
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>

      {error && !isLoading && (
        <div className="lg:col-span-4 col-span-2">
          <ProductError
            text={
              error
                ? error?.response?.data?.message
                : "Something went wrong"
            }
          />

        </div>
      )}

      <CustomSwiper
        navigation={true}
        key={i18n.language}
        dir={i18n.dir()}
        slidesPerView={2}
        spaceBetween={0}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 4,
          },
          1281: {
            slidesPerView: 5,
          },
        }}
        // autoPlay
        list={socialPosts?.map((social: any, index: any) => (
          <div className="relative" key={index}>
            <img
              // src={social?.foregroundMedias?.[0] || social?.img}
              src={social?.foregroundMedias?.[0] || "/assets/images/defaultImage.jpg"}
              alt="social" width={390} height={390} />
            <Link href={getTranslation(social?.translations, "buttonUrl") ||
              "https://www.instagram.com/bijou.ae?igsh=MmZwdDdnd3BtZm5r&utm_source=qr"}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute opacity-0 hover:opacity-100 duration-400 inset-0 bg-[#CEAF9199]/60 w-full h-full flex items-center justify-center">
              <Image
                src={"/assets/images/insta.png"}
                alt="social"
                width={60}
                height={60}
              />
            </Link>
          </div>
        ))}
      />
    </section>
  );
}
