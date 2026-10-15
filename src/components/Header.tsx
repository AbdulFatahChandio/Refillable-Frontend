"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/images/logo2.svg";
import DashboardProfileMenu from "./DashboardProfileMenu";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { IoMenuSharp } from "react-icons/io5";
import { useUserStore } from "../store/useUserStore";
import DashboardNotificationDropdown from "./DashboardNotificationDropdown";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/useCartStore";
import { FiHeart, FiSearch, FiUser } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { useEffect, useState } from "react";
import CanvasMenu from "./CanvasMenu";
import { useWishlistStore } from "../store/useWishlistStore";
import { FaHeart, FaSnapchat } from "react-icons/fa6";
import LanguageToggle from "./LanguageToggle";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { SlBag } from "react-icons/sl";
import { MdOutlineShoppingBag } from "react-icons/md";

export default function Header({ onClick }: any) {
  const { isLoggedIn } = useUserStore();
  const { count } = useWishlistStore();
  
  const hasWishlist = count > 0;

  const { t } = useTranslation();
  const { totalItems } = useCartStore();
  const router = useAppRouter();
  const [search, setSearch] = useState("");
  const [showCanvasMenu, setShowCanvasMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`${router.pathname?.startsWith("/dashboard") ? "fixed top-0 w-full z-[9999999999]" : ""}`}
    >
      <div>
        <div className="lg:px-20 px-3 bg-brown text-secondary uppercase py-2.5 grid grid-cols-12 items-center lg:gap-3 gap-1">
          <div className="md:col-span-12 col-span-12">
            <p className="text-center 2xl:text-[14px]! text-[12px]! text-secondary!">
              {t("Handcrafted 18k Gold Plated Jewellery · Worldwide Shipping")}
            </p>
          </div>
        </div>
        <div
          className={`header py-3 relative z-50 top-0 w-full border-b border-brown transition-all duration-300 bg-[#FCFAF7] text-black
            ${router.pathname === "/" && "border-transparent"}`}
        >
          <div
            className={`container-fluid relative grid md:grid-cols-10 grid-cols-12 justify-between items-center md:gap-3 gap-2`}
          >
            <div className="md:col-span-4 col-span-3 flex items-center md:gap-2 gap-2.5">
              <button
                onClick={() => setShowCanvasMenu(true)}
                className={`xl:text-3xl text-2xl min-lg:hidden ${router.pathname?.startsWith("/dashboard") ? "hidden" : "block"}`}
              >
                <IoMenuSharp />
              </button>
              <button
                onClick={onClick}
                className={`min-lg:hidden text-2xl ${!router.pathname?.startsWith("/dashboard") && "hidden"}`}
              >
                <IoMenuSharp />
              </button>
              <ul className="2xl:gap-10 gap-4 items-center max-2xl:text-[12px] uppercase min-lg:flex hidden">
                {/* <li>
                  <Link href="/">{t("Home")}</Link>
                </li> */}
                <li>
                  <Link href="/all-collections">{t("Collections")}</Link>
                </li>
                <li>
                  <Link href="/collections/new-arrivals">{t("New")}</Link>
                </li>
                <li>
                  <Link href="/about-us">{t("About Us")}</Link>
                </li>
              </ul>
              {/* <div className="max-md:hidden">
              <LanguageToggle position="header" />
            </div> */}
              <button
                className="md:hidden text-xl"
                onClick={() => setOpenSearch(!openSearch)}
              >
                <FiSearch />
              </button>
              {isLoggedIn && (
                <Link
                  href="/dashboard/wishlist"
                  className="xl:text-2xl text-xl min-md:hidden"
                >
                  {hasWishlist ? <FaHeart /> : <FiHeart />}
                </Link>
              )}
            </div>
            <div className="md:col-span-2 col-span-6">
              <Link href="/">
                <Image
                  src={logo}
                  alt="logo"
                  className={`mx-auto w-full md:max-w-[95px] max-w-[70px]`}
                  width={95}
                  height={45}
                />
              </Link>
            </div>
            <div className="md:col-span-4 col-span-3">
              <div className="flex items-center justify-end gap-2.5 md:gap-4 2xl:gap-10">
                {/* search input (desktop) */}
                {/* <div className="hidden md:flex items-center gap-2 border-b pb-1 w-full xl:me-4 xl:max-w-[200px] max-w-[150px]">
                  <FiSearch className=" shrink-0" />
                  <input
                    type="text"
                    placeholder={t("SEARCH")}
                    className={`bg-transparent outline-none text-sm w-full placeholder:text-primary`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      router.push(`/collections?search=${search}`)
                    }
                  />
                </div> */}

                <button
                  className="min-md:block hidden 2xl:text-2xl text-xl"
                  onClick={() => setOpenSearch(!openSearch)}
                >
                  <FiSearch />
                </button>

                {/* cart */}
                {totalItems > 0 && (
                  <Link href="/cart" className="relative 2xl:text-2xl text-xl">
                    {/* <HiOutlineShoppingCart /> */}
                    <MdOutlineShoppingBag />
                    <span
                      className={`absolute -top-1.5 -end-2 text-[10px] rounded-full xl:w-4.5 xl:h-4.5 h-[15px] w-[15px] flex items-center justify-center text-center bg-primary text-secondary`}
                    >
                      {totalItems}
                    </span>
                  </Link>
                )}

                {/* user / account */}
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/dashboard/wishlist"
                      className="2xl:text-2xl text-xl max-md:hidden"
                    >
                      {hasWishlist ? <FaHeart /> : <FiHeart />}
                    </Link>
                    <DashboardNotificationDropdown
                      isScrolled={
                        isScrolled || openSearch || router.pathname !== "/"
                      }
                    />
                    <DashboardProfileMenu />
                  </>
                ) : (
                  <Link href={"/signin"} className="2xl:text-2xl text-xl">
                    <FiUser />
                  </Link>
                )}
                
              </div>
            </div>
            {openSearch && (
              <label
                htmlFor="search"
                className="border py-2 px-3 rounded-lg w-full bg-secondary md:col-span-10 col-span-12 mt-1 border-[#D9D9D9] text-primary flex items-center gap-2"
              >
                <FiSearch />
                <input
                  type="text"
                  id="search"
                  value={search}
                  className="outline-none text-sm grow"
                  placeholder={t("SEARCH")}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      router.push(`/collections?search=${search}`);
                      setOpenSearch(false);
                    }
                  }}
                />
              </label>
            )}
          </div>

          <CanvasMenu
            isOpen={showCanvasMenu}
            onClose={() => setShowCanvasMenu(false)}
          />
        </div>
      </div>
    </div>
  );
}
