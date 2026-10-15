"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import logo from "@/public/assets/images/smallLogo.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiShoppingCartThin } from "react-icons/pi";
import { BiHeartCircle } from "react-icons/bi";
import CanvasMenu from "./CanvasMenu";
import gsap from "gsap";
import LanguageToggle from "./LanguageToggle";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useUserStore } from "../store/useUserStore";
export default function Navigation() {
  const [showNavs, setShowNavs] = useState(true);
  const [showCanvasMenu, setShowCanvasMenu] = useState(false);

  const container = useRef(null);

  useEffect(() => {
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".nav",
        { opacity: 0, visibility: "hidden" },
        {
          opacity: 1,
          visibility: "visible",
          ease: "ease",
          scrollTrigger: {
            trigger: ".nav",
            start: "top top",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  const router = useAppRouter();

  const { isLoggedIn } = useUserStore();

  return (
    <>
      <div className="fixed z-50 top-36 left-0 nav" ref={container}>
        <ul className="flex gap-1 flex-col text-center [&_li>button]:block [&_li>button]:cursor-pointer [&_li>button]:uppercase [&_li]:border [&_li]:border-secondary [&_li]:hover:border-primary [&_li>button]:w-full [&_li]:text-secondary [&_li]:hover:text-primary [&_li]:bg-primary [&_li]:hover:bg-secondary [&_li>button]:py-1 [&_li>button]:md:px-3 [&_li>button]:px-1">
          <li className="!border-primary !bg-secondary !text-primary">
            <button onClick={() => setShowNavs(!showNavs)} type="button">
              <Image
                src={logo}
                className=" dark:invert animate-spin"
                alt="logo"
                width={26}
                height={26}
              />
            </button>
          </li>
          <div
            className={`flex gap-1 flex-col transition-all duration-500 ${!showNavs ? "opacity-0 mt-3 invisible" : ""
              }`}
          >
            <li>
              <button type="button" onClick={() => setShowCanvasMenu(true)}>
                <GiHamburgerMenu className="mx-auto" size={20} />
              </button>
            </li>
            <li>
              <button type="button" onClick={() => router.push("/cart")}>
                <PiShoppingCartThin className="mx-auto" size={20} />
              </button>
            </li>
            <li>
              <button type="button" onClick={() => router.push(isLoggedIn ? "/dashboard/wishlist" : "/signin")}>
                <BiHeartCircle className="mx-auto" size={20} />
              </button>
            </li>
            <li>
              {" "}
              <LanguageToggle position="menu" />
            </li>
          </div>
        </ul>
      </div>
      <CanvasMenu
        isOpen={showCanvasMenu}
        onClose={() => setShowCanvasMenu(false)}
      />
    </>
  );
}
