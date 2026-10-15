"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/images/footerLogo.svg";
import visaLogo from "@/public/assets/images/visa.svg";
import mastercardLogo from "@/public/assets/images/mastercard.svg";
import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks/product/useProducts";
import { useUserStore } from "../store/useUserStore";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { useSubscribeNewsLetter } from "../hooks/useSubscribeNewsLetter";
import { useForm } from "react-hook-form";
import Button from "./Button";
import TextField from "./TextField";
import LanguageToggle from "./LanguageToggle";
import CurrencySelector from "./CurrencySelector";
import { FaSnapchat } from "react-icons/fa6";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();

  const { mutate, isPending } = useSubscribeNewsLetter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (values: any) => {
    mutate(values, {
      onSuccess: ()=> {
        reset();
      }
    });
  };

  const getTranslation = (translations: any[], key: "name" | "description") => {
    if (!translations || translations.length === 0) return "";
    const ar = translations.find((tr: any) => tr.language === "ar");
    const en = translations.find((tr: any) => tr.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] || translations[0]?.[key] || "";
  };

  const { data: categoryList, isLoading } = useCategories({
    limit: 5,
    depth: 3,
  });

  const categories = categoryList?.data ?? [];

  const { isLoggedIn } = useUserStore();

  return (
    <footer className="text-foreground">
      {/* Top area */}
      <div className="mx-3 md:mx-20 pt-10 lg:pt-20">
        <div className="grid md:gap-5 gap-3 2xl:gap-16 grid-cols-1 lg:grid-cols-12 items-start">
          {/* Left: Logo + Social */}
          <div className="lg:col-span-6 text-center lg:text-left rtl:text-right">
            <Link href="/" aria-label="bijou Home" className="inline-block">
              <Image src={logo} alt="bijou" className="w-[190px] 2xl:w-[276px]" />
            </Link>
            <p className="lg:max-w-[400px] md:mt-7 mt-4 mb-4 2xl:tracking-[4px] tracking-[2px] 2xl:text-base text-sm text-light-gray">
              {t("18K gold-plated jewelry, hand-finished for the quietly bold. Designed to be lived in, layered, and loved.")}
            </p>

            <ul className="flex gap-4 max-lg:justify-center items-center uppercase  text-sm">
              {/* {t("Follow on")}: */}
              {/* <li>
                <Link href="https://www.facebook.com">
                  <FaFacebookF />
                </Link>
              </li> */}
              <li>
                <Link className="2xl:w-10 2xl:h-10 w-8 h-8 rounded-full border border-brown flex justify-center items-center 2xl:text-xl text-brown" href="https://www.instagram.com/bijou.ae?igsh=MmZwdDdnd3BtZm5r&utm_source=qr" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </Link>
              </li>
              <li>
                <Link className="2xl:w-10 2xl:h-10 w-8 h-8 rounded-full border border-brown flex justify-center items-center 2xl:text-xl text-brown" href="https://snapchat.com/t/GpcNFHb6" target="_blank" rel="noopener noreferrer">
                  <FaSnapchat />
                </Link>
              </li>
              {/* <li>
                <Link href="https://www.facebook.com">
                  <FaLinkedinIn />
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Right: 2 cols on mobile, 3 cols on sm+ */}
          <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-6 gap-5 
          // font-[250]
          ">
            {/* SHOP */}
            {!isLoading && categories?.length > 0 ? (
              <nav aria-label={t("Shop")} className="md:col-span-2">
                <h4 className="uppercase! 2xl:text-lg text-sm font-inter! font-medium! text-light-brown">
                  {t("Shop")}
                </h4>

                <ul className="md:mt-6 mt-4 md:space-y-4 space-y-2 max-2xl:text-[12px] text-light-gray hover:[&_a]:text-primary font-normal! 2xl:tracking-[4px] tracking-[2px]">
                  {categories?.map((item, index: any) => (
                    <li key={index}>
                      <Link
                        href={`/collections/${item?.translations
                          ?.find((tr: any) => tr.language === "en")
                          ?.name?.toLowerCase()
                          .split(" ")
                          .join("-")}?id=${item?.id}`}
                        className="hover:underline line-clamp-1"
                      >
                        {getTranslation(item?.translations, "name")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
            {/* HELP */}
            <nav aria-label={t("SUPPORT")} className="md:col-span-2">
              <h4 className="uppercase! 2xl:text-lg text-sm font-inter! font-medium! text-light-brown">
                {t("SUPPORT")}
              </h4>
              <ul className="md:mt-6 mt-4 md:space-y-4 space-y-2 max-2xl:text-[12px] text-light-gray hover:[&_a]:text-primary font-normal! 2xl:tracking-[4px] tracking-[2px]">
                {/* <li><Link href="/shipping-policy" className="hover:text-white">{t("Shipping & Returns")}</Link></li> */}
                <li>
                  <Link href="/faqs" className="hover:underline">
                    {t("FAQs")}
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="hover:underline">
                    {t("Track Order")}
                  </Link>
                </li>
                {/* <li><Link href="/about-us" className="hover:underline">{t("About Us")}</Link></li> */}
                <li>
                  <Link href="/contact-us" className="hover:underline">
                    {t("Contact Us")}
                  </Link>
                </li>
               
              </ul>
            </nav>
            <nav aria-label={t("Company")} className="md:col-span-2">
              <h4 className="uppercase! 2xl:text-lg text-sm font-inter! font-medium! text-light-brown">{t("Company")}</h4>
              <ul className="md:mt-6 mt-4 md:space-y-4 space-y-2 max-2xl:text-[12px] text-light-gray hover:[&_a]:text-primary font-normal! 2xl:tracking-[4px] tracking-[2px]">
                {/* <li><Link href="/shipping-policy" className="hover:text-white">{t("Shipping & Returns")}</Link></li> */}
                <li>
                  <Link href="/about-us" className="hover:underline">
                    {t("Our Story")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:underline">
                    {t("Privacy Policy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="hover:underline"
                  >
                    {t("Terms & Conditions")}
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:underline">
                    {t("Shipping Policy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/return-and-refund-policy"
                    className="hover:underline"
                  >
                    {t("Return Policy")}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* ACCOUNT (full row on mobile for balance) */}
            {/* <nav aria-label={t("STAY CONNECTED")} className="md:col-span-5">
              <h4 className="uppercase! tracking-widest 2xl:text-lg text-sm font-inter! font-medium!">
                {t("STAY CONNECTED")}
              </h4>
              <p className="md:my-6 my-4">
                {t("Join the SUYA community for new launches, exclusive offers, and skincare insights.")}
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
                <TextField
                  type="email"
                  {...register("email", {
                    required: t("Email is required"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("Please enter a valid email address"),
                    },
                  })}
                  placeholder={t("Email Address")}
                  className="grow"
                />
                <Button
                  text={t("SUBSCRIBE")}
                  type="submit"
                  btnTheme="dark"
                  className="shrink-0 max-xl:px-3!"
                />
              </form>
            </nav> */}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 mt-8 border-t border-[#E2E8F0]">
          <p className="text-light-gray text-center sm:text-start 2xl:text-lg text-[12px] 2xl:tracking-[4px] tracking-[2px]">
            © {year} Bijou Sky.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4">
            <div className="flex items-center gap-2" aria-label={t("We accept")}>
              <Image
                src={visaLogo}
                alt="Visa"
                width={48}
                height={32}
                className="h-7 w-auto"
              />
              <Image
                src={mastercardLogo}
                alt="Mastercard"
                width={48}
                height={32}
                className="h-7 w-auto"
              />
            </div>
            <CurrencySelector />
          </div>
        </div>
      </div>
      
    </footer>
  );
}
