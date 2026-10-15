"use client";

import React from "react";
import { HiChevronDown } from "react-icons/hi";
import userimg from "@/public/assets/images/user.png";
import { AiOutlineUser } from "react-icons/ai";
import logout from "@/public/assets/images/logout.png";
import Image from "next/image";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useUserStore } from "../store/useUserStore";
import { useLogoutUser } from "../hooks/useLogoutUser";
import { useTranslation } from "react-i18next";
import useClickOutside from "../hooks/useClickOutside";
import { toast } from "react-toastify";
import Cookies from 'js-cookie'
const removeAuthCookie = () => {
  // match attributes used when setting the cookie so browsers actually delete it
  Cookies.remove("_ca", { path: "/", sameSite: "strict", secure: true });
};
import { FiUser } from "react-icons/fi";

export default function DashboardProfileMenu() {
  const router = useAppRouter();
  const { t, i18n } = useTranslation();

  const { mutate } = useLogoutUser();

  const { clearUser, user } = useUserStore();


  const handleLogout = () => {
    mutate({}, {
      onSuccess: (data) => {
        removeAuthCookie();
        toast.success(t(data.message));
        clearUser();
        window.location.href = "/";
      },
    });

  };
  

  const { modal, modalRef, setModal } = useClickOutside();

  return (
    <div onClick={() => setModal((prev: any) => !prev)}
      ref={modalRef} className="relative cursor-pointer">
      <span
        className={
          "2xl:text-2xl text-xl"
        }
      >
        {/* <FiUser /> */}
        <AiOutlineUser />
      </span>
      <div className={`absolute rtl:left-0 ltr:right-0 p-1 md:p-3 top-14 md:w-[230px] w-[200px] border border-[#D9D9D9] rounded-xl bg-secondary text-primary duration-500  ${i18n.language === "ar" ? "origin-top-left" : "origin-top-right"
        } ${modal
          ? "visible scale-100 opacity-100"
          : "invisible scale-0 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      // className={
      //   "z-[99999] py-3 min-w-[250px] !fixed !top-[92px] px-4 border border-white/60 bg-secondary dark:text-secondary dark:bg-primary"
      // }
      >
        <button
          className="flex w-full items-end gap-3 md:px-6 md:py-3 px-3 py-2 md:text-xl text-base border-b"
          onClick={() => router.push("/dashboard/profile-management")}
        >
          <Image src={userimg} className="invert" alt="user" width={24} height={24} />
          {t("Profile")}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-end gap-3 md:px-6 md:py-3 px-3 py-2 md:text-xl text-base"
        >
          <Image src={logout} className="invert" alt="user" width={24} height={24} />
          {t("Logout")}
        </button>
      </div>
    </div>
  );
}
