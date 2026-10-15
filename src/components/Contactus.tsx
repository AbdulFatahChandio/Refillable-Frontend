"use client";

import { FaRegEnvelope } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { SlLocationPin } from "react-icons/sl";
import ContactForm from "./ContactForm";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { useGetContent } from "../hooks/useGetContent";

const normalizeLang = (value?: string): "en" | "ar" => {
  if (!value) return "en";
  const v = value.toLowerCase();
  if (v.startsWith("ar")) return "ar";
  return "en";
};

export default function Contactus() {
  const { t, i18n } = useTranslation();

  const { data: content, refetch, isLoading } = useGetContent("3");
  const section = content?.data;

  useEffect(() => {
    refetch();
  }, [refetch]);

  const lang = normalizeLang(i18n.language);

  // title + description section.translations se
  const mainTr = useMemo(() => {
    const translations = section?.translations ?? [];

    return (
      translations.find((tr: any) => tr.language === lang) ||
      translations.find((tr: any) => tr.language === "en") ||
      translations[0]
    );
  }, [section, lang]);

  return (
    <section className="py-12 px-3 heroBanner">
      <div className="max-w-3xl mx-auto grid grid-cols-12 gap-4 items-center">
        {/* <div className="md:col-span-6 col-span-12">
          <div className="flex items-start md:gap-5 gap-3 md:mb-10 mb-5">
            <div className="flex items-center justify-center bg-brown text-white px-2 py-2">
              <SlLocationPin size={24} />
            </div>
            <div className="text-primary">
              <h5 className=" font-semibold capitalize md:text-2xl">
                {t("Address")}
              </h5>
              <p className="md:text-[18px] text-sm mt-2">
                {t("Dubai, United Arab Emirates")}
              </p>
            </div>
          </div>
          <div className="flex items-start md:gap-5 gap-3 md:mb-10 mb-5">
            <div className="flex items-center justify-center bg-brown text-white px-2 py-2">
              <FaRegEnvelope size={24} />
            </div>
            <div className="text-primary">
              <h5 className=" font-semibold capitalize md:text-2xl">
                {t("Email")}
              </h5>
              <p className="md:text-[18px] text-sm mt-2">
                support@bijou.com
              </p>
            </div>
          </div>
          <div className="flex items-start md:gap-5 gap-3 md:mb-10 mb-5">
            <div className="flex items-center justify-center bg-brown text-white px-2 py-2">
              <FiPhone size={24} />
            </div>
            <div className="text-primary">
              <h5 className=" font-semibold capitalize md:text-2xl">
                {t("Phone")}
              </h5>
              <p className="md:text-[18px] text-sm mt-2">
                0568624232
              </p>
            </div>
          </div>
        </div> */}

        <div className="md:col-span-12 col-span-12">
          <div className="border border-brown md:px-8 md:py-11 px-3 py-5">
            <h1 className="authHeading">
              {t("bijou Fashion")}
            </h1>
            <p className="authPara">
              {t(
                "For any questions or assistance, please contact our customer service team at customer-service@bijousky.com. Our team will be happy to assist you."
              )}
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
