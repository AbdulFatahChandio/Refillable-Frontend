"use client";

import { useEffect } from "react";
import { useGetPages } from "../hooks/useGetPages";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const router = useAppRouter()
  const {t, i18n} = useTranslation()

  const isFromApp = router?.query?.source === "app";
  const appLang = router?.query?.lang;


  const lang = i18n.language;

  const { data: privacyPolicy, refetch } = useGetPages("1");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const selectedTranslation =
    privacyPolicy?.data?.translations?.find((i: any) => i.language.includes(appLang)) || privacyPolicy?.data?.translations?.find((i: any) => i.language === lang) ||
    privacyPolicy?.data?.translations?.find((i: any) => i.language === "en");

  const description = selectedTranslation?.content || "";

  return (
    <section className="lg:pb-24 pb-10 pt-12 px-3 heroBanner" dir={appLang?.includes("ar") || lang === "ar" ? "rtl" : "ltr"}>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {!isFromApp && (
            <div className="flex items-center gap-4 mb-3">
              <button type="button" onClick={() => {
                router.back();
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "instant" });
                }, 0);
              }} className="min-lg:hidden"><HiOutlineArrowLeft size={25} className="rtl:rotate-180" /></button>
              {/* <h1 className="text-2xl md:text-4xl text-black mb-5">
                {t("Privacy Policy")}
              </h1> */}
            </div>
          )}

          <div
            className="
              text-[#C4C8C2] dark:text-[#465240] capitalize
              [&_h1]:! [&_h1]:font-medium [&_h1]:2xl:text-[38px] [&_h1]:text-2xl [&_h1]:mb-6 [&_h1]:text-primary
              [&_h2]:! [&_h2]:font-semibold [&_h2]:2xl:text-[28px] [&_h2]:lg:text-[50px] [&_h2]:md:text-4xl [&_h2]:text-2xl [&_h2]:mb-6 [&_h2]:text-primary
              [&_h3]:! [&_h3]:font-medium [&_h3]:2xl:text-[24px] [&_h3]:lg:text-[40px] [&_h3]:md:text-2xl [&_h3]:text-2xl [&_h3]:mb-6 [&_h3]:text-primary
              [&_h4]:font-semibold [&_h4]:md:text-xl [&_h4]:mb-3
              [&_h5]:font-semibold [&_h5]:md:text-xl [&_h5]:mb-3
              [&_h6]:font-semibold [&_h6]:md:text-xl [&_h6]:mb-3
              [&_p]:md:text-md [&_p]:mb-5
              [&_ul]:list-disc [&_ul]:ltr:pl-6 [&_ul]:rtl:pr-6 [&_ul]:mb-6
              [&_li]:mb-1 [&_li]:md:text-md [&_li]:md:text-primary
              [&_ol]:list-decimal [&_ol]:ltr:pl-6 [&_ol]:rtl:pr-6 [&_ol]:my-3
              [&_a]:underline [&_a]:break-words
            "
            dangerouslySetInnerHTML={{
              __html: description.replace(
                /<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/g,
                ""
              ),
            }}
          />
        </div>
      </div>
    </section>
  );
}
