"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useCategories, useGetSubCategories } from "../hooks/product/useProducts";
import { RxCross2 } from "react-icons/rx";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import Spinner from "./Spinner";

export default function CanvasMenu({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) {

  const menuRef = useRef<HTMLDivElement | null>(null);

  const [openCategory, setOpenCategory] = useState<any>(null);
  const [openCategoryName, setOpenCategoryName] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);


  const { t, i18n } = useTranslation();


  const router = useAppRouter()


  const { data: categoryList, isLoading, refetch } = useCategories({
    limit: 999,
    depth: 3
  });
  const { data: subcategoryList, isFetching: isSubloading, refetch: refetchSub } = useGetSubCategories({
    limit: 999,
    depth: 3,
    parentId: openCategory,
    search,

  }, {
    enabled: !!openCategory
  });
  const categories = categoryList?.data ?? [];

  const subcategories = subcategoryList?.data ?? [];


  // useEffect(() => {
  //   refetch()
  //   refetchSub()
  // }, [i18n?.language])


  const getTranslation = (translations: any[], key: "name" | "description") => {
    if (!translations || translations.length === 0) return "";
    const ar = translations.find((tr: any) => tr.language === "ar");
    const en = translations.find((tr: any) => tr.language === "en");
    if (i18n.language === "ar" && ar?.[key]) return ar[key];
    return en?.[key] || translations[0]?.[key] || "";
  };


  const handleCategoryClick = (category: any) => {

    if (category?.subcategories?.length > 0) {
      // Toggle dropdown
      setOpenCategory(() => category.id);
      setOpenCategoryName(() => category?.translations?.find((tr: any) => tr.language === i18n?.language)?.name);
    } else {
      router.push(`/collections/${category?.translations?.find((tr: any) => tr.language === i18n?.language)?.name?.toLowerCase().replaceAll(" ", "-")}?id=${category?.id}`);
      onClose();
    }
  };

  useEffect(() => {
    setOpenCategory(categories?.find((cat: any) => cat.subcategories.length > 0)?.id)
    setOpenCategoryName(categories?.find((cat: any) => cat.subcategories.length > 0)?.translations?.find((tr: any) => tr.language === i18n?.language)?.name);
  }, [categories])

  return (
    <div
      className={`fixed z-[9999999] bg-transparent top-0 start-0 w-full md:pt-20 pt-12 md:pb-10 pb-5 h-[100vh] overflow-y-auto 
           ${isOpen ? "translate-x-0 duration-500 transition" : "ltr:-translate-x-full duration rtl:translate-x-full"} `}

    >
      <div ref={menuRef} className={`fixed z-[9999999] transition duration-500 top-0 start-0 shadow-[-40px_0_50px_rgba(0,0,0,0.08),100px_0_100px_rgba(0,0,0,0.08)] w-full max-w-[350px] md:pt-20 pt-12 bg-secondary md:pb-10 pb-5 h-[100vh] overflow-y-auto 
            `}>
        <button
          onClick={onClose}
          className="absolute md:top-5 md:end-5 end-2 top-2 cursor-pointer text-primary md:text-3xl text-xl"
        >
          <RxCross2 />
        </button>
        {/* <ul className="flex gap-3 flex-col">
        {categories?.map((category) => (
          <li
            key={category.id}
            className="bg-primary text-secondary overflow-hidden"
          >
            <button
              onClick={() => handleCategoryClick(category)} onMouseEnter={() => category?.subcategories && category?.subcategories?.length > 0 && handleCategoryClick(category)}
              className="w-full group py-3 uppercase flex items-center justify-between px-3 max-sm:text-sm"
            >
              {getTranslation(category.translations, "name")}
              {category?.subcategories && category?.subcategories?.length > 0 && (
                <span
                  className={` group-hover:opacity-100 opacity-0 duration-300 ${openCategory === category.id ? "rotate-180" : ""
                    }`}
                >
                  ▼
                </span>
              )}
            </button>


            <ul
              className={`bg-secondary text-white text-sm flex flex-col overflow-hidden transition-[max-height] duration-500 ease-in-out ${openCategory === category.id && category?.subcategories && category?.subcategories?.length > 0
                ? "max-h-96"
                : "max-h-0"
                }`}
            >
              {category?.subcategories?.map((sub) => (
                <li key={sub.id} className="border-t border-gray-700">
                  <button
                    onClick={() => {
                      router.push(`/collections/${sub?.translations?.find((tr: any) => tr?.language === "en")?.name?.toLowerCase().replaceAll(" ", "-")}`);
                      onClose();
                    }}
                    className="block w-full py-2 px-5 text-start text-primary hover:bg-primary hover:text-secondary transition"
                  >
                    {getTranslation(sub.translations, "name")}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul> */}
        {isLoading || isSubloading && <Spinner className="absolute left-1/2 top-1/2 -translate-1/2" />}
        {!isLoading && categories?.length > 0 ? (
          <>
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={15}
              freeMode={true}
              modules={[FreeMode]}
              className="mySwiper mb-5 border-b border-[#D9D9D9] md:!mx-5 !mx-3"
              dir={"ltr"}
            >
              {categories?.map((item, index: any) => (
                <SwiperSlide key={index} className="!inline-block !w-auto">
                  <div className={`pb-5 border-b-4 hover:border-primary capitalize text-primary cursor-pointer max-sm:text-sm ${openCategory === item.id ? "border-primary" : "border-transparent"}`}
                    onClick={() => { handleCategoryClick(item) }}
                  >
                    {getTranslation(item?.translations, "name")}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="md:px-5 px-3">
              <label htmlFor="search" className="border py-2 px-3 rounded-lg w-full bg-secondary col-span-12 mt-1 border-[#D9D9D9] text-primary flex items-center gap-2">
                <FiSearch />
                <input type="text" id="search" value={search} className="outline-none text-sm grow" placeholder={t("SEARCH")}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { e.key === "Enter" && router.push(`/collections?search=${search}`); }} />
              </label>
              {!isSubloading && subcategories?.length > 0 && (
                <ul className="mt-10 pt-10 border-t border-[#D9D9D9]">
                  {subcategories?.map((item, index: any) => (
                    <li key={index} className="mb-5 text-primary">
                      <button className="font-medium mb-2 block capitalize" onClick={() => { router.push(`/collections/${openCategoryName.toLowerCase().replaceAll(" ", "-")}/${item?.translations?.find((tr: any) => tr.language === i18n?.language)?.name?.toLowerCase().replaceAll(" ", "-")}?id=${item?.id}`); onClose(); }}>{getTranslation(item?.translations, "name")}</button>
                      {item?.subcategories && item?.subcategories?.length > 0 && (
                        item?.subcategories?.map((sub, index: any) => (
                          <button className="block text-sm mb-1 capitalize" key={index} onClick={() => { router.push(`/collections/${openCategoryName.toLowerCase().replaceAll(" ", "-")}/${item?.translations?.find((tr: any) => tr.language === i18n?.language)?.name?.toLowerCase().replaceAll(" ", "-")}/${sub?.translations?.find((tr: any) => tr.language === i18n?.language)?.name?.toLowerCase().replaceAll(" ", "-")}?id=${sub?.id}`); onClose(); }}>{getTranslation(sub?.translations, "name")}</button>
                        ))
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {!isSubloading && subcategories?.length == 0 && <p className="absolute left-1/2 top-1/2 -translate-1/2 w-full text-center max-sm:text-sm">{t("Subcategory not found")}</p>}


            </div>


          </>
        ) : <p className="absolute left-1/2 top-1/2 -translate-1/2 w-full text-center max-sm:text-sm">{t("Categories not found")}</p>}
        {/* <ul className="min-md:hidden flex gap-2 justify-end text-center mt-10 px-3">
          <LanguageToggle position="menu" />
        </ul> */}
      </div>

    </div>
  );
}
