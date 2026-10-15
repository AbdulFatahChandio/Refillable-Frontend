"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetContent } from "../hooks/useGetContent";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useGetPageAllContent } from "../hooks/useGetPageAllContent";


const pickTrans = (translations: any[] = [], lang: any) =>
  translations.find((t) => t.language === lang) ??
  translations.find((t) => t.language === "en") ??
  translations[0];

export default function Faqs() {
  const router = useAppRouter()
  const { t, i18n } = useTranslation()
  const appLang = router?.query?.lang;
  console.log(appLang);

  const isFromApp = router?.query?.source === "app";

  // const [lang, setLang] = useState<"en" | "ar">("en");

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const readLang = () => {
  //     const stored = localStorage.getItem("language");

  //     if (stored === "ar") {
  //       setLang("ar");
  //     } else {
  //       setLang("en");
  //     }
  //   };
  //   readLang();

  //   const handleStorage = (e: StorageEvent) => {
  //     if (e.key === "language") {
  //       readLang();
  //     }
  //   };

  //   window.addEventListener("storage", handleStorage);
  //   window.addEventListener("languageChange", readLang);

  //   return () => {
  //     window.removeEventListener("storage", handleStorage);
  //     window.removeEventListener("languageChange", readLang);
  //   };
  // }, []);
  const lang = i18n.language;


  const {
    data: content,
    refetch,
    isLoading,
  } = useGetPageAllContent({
    pageName: "FAQs",
  });
  const sections = content?.data;
  const faqSec = sections?.find((sec: any) => sec?.type === "faqs section");

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    refetch();
  }, [refetch]);


  const mainTr = useMemo(
    () => pickTrans(faqSec?.translations ?? [], appLang?.includes("en") ? "en" : appLang || lang),
    [faqSec, appLang, lang]
  );

  const faqs = useMemo(
    () => (Array.isArray(faqSec?.subContent) ? faqSec.subContent : []),
    [faqSec]
  );

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="lg:pb-24 pb-10 pt-12 px-3 heroBanner" dir={appLang?.includes("ar") || lang === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto max-w-4xl">
        {/* TOP HEADING + DESCRIPTION  */}
        {!isFromApp && (
          <div className="lg:mb-10 mb-5">
            <div className="flex items-center min-lg:justify-center gap-4 mb-3">
              <button type="button" onClick={() => {
                router.back();
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "instant" });
                }, 0);
              }} className="min-lg:hidden"><HiOutlineArrowLeft size={25} className="rtl:rotate-180" /></button>
              <h1 className="text-2xl md:text-4xl text-black">
                {mainTr?.title || "FAQs"}
              </h1>
            </div>
            {mainTr?.description && (
              <p className="text-base text-center md:text-lg text-gray-700 max-lg:hidden">
                {mainTr.description}
              </p>
            )}
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        )}

        {/* FAQ LIST */}
        {!isLoading && faqs.length > 0 && (
          <div className="space-y-4">
            {faqs.map((faq: any, index: number) => {
              const tr = pickTrans(faq?.translations ?? [], appLang?.includes("en") ? "en" : appLang || lang);
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.id ?? index}
                  className="border-b border-[#D9D9D9] overflow-hidden bg-white"
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(index)}
                    className="w-full flex items-center justify-between px-2 md:px-6 py-4 text-left"
                  >
                    <span className="text-gray-900 min-md:text-lg text-sm">
                      {tr?.title}
                    </span>
                    <span className="ms-4 text-primary text-xl leading-none">
                      {isOpen ? <FaChevronUp className="max-md:size-4" /> : <FaChevronDown className="max-md:size-4" />}
                    </span>
                  </button>

                  <div
                    className={`px-4 md:px-6 text-gray-700 text-sm md:text-base overflow-hidden transition-all duration-300 ease-in-out ${isOpen
                      ? "max-h-96 py-4 opacity-100"
                      : "max-h-0 py-0 opacity-0"
                      }`}
                  >
                    {tr?.description}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && faqs.length === 0 && (
          <div className="text-center text-gray-500">
            No FAQs available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}
