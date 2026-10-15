"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import LinkButton from "./LinkButton";
import Subtitle from "./Subtitle";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[calc(100dvh-200px)] items-center justify-center overflow-hidden bg-[#FCFAF7] py-16 px-3">
      <span
        aria-hidden
        className="pointer-events-none absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-cormorant text-[180px] leading-none text-[#6D49170D] select-none md:text-[280px] 2xl:text-[340px]"
      >
        BIJOU
      </span>

      <div className="relative z-10 mx-auto max-w-xl text-center">
        <Subtitle text={t("Page not found")} />
        <p className="mt-4 font-cormorant text-[100px] leading-none text-brown md:text-[140px]">
          404
        </p>
        <h1 className="mt-4 text-2xl text-primary md:text-[40px]">
          {t("This page doesn't exist")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-light-gray 2xl:text-lg">
          {t(
            "The link may be broken or the page may have been moved. Explore our collections instead.",
          )}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-6">
          <LinkButton
            icon
            btnTheme="dark"
            text={t("Back to Home")}
            link="/"
          />
          <Link
            href="/all-collections"
            className="flex items-center gap-2 border-b-2 border-black pb-2.5 text-[10px] font-semibold tracking-[2px] text-light-brown max-2xl:text-[12px] 2xl:tracking-[4px]"
          >
            {t("Explore Collections")}
            <HiOutlineArrowLongRight className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
