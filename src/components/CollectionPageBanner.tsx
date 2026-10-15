"use client";

import { useEffect, useState } from "react";

type CollectionPageBannerProps = {
  title: string;
  image?: string;
};

const DEFAULT_BANNER_IMAGE = "/assets/images/collection-banner.jpg";

export default function CollectionPageBanner({
  title,
  image,
}: CollectionPageBannerProps) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative flex min-h-[220px] items-center justify-center overflow-hidden md:min-h-[calc(100vh-126px)] 2xl:min-h-[680px]">
      <div
        className="absolute -top-20 -bottom-20 left-0 right-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${image || DEFAULT_BANNER_IMAGE}')`,
          transform: `translateY(${offsetY * 0.2}px)`,
        }}
      />
      <div className="absolute inset-0 bg-[#00000094]" />

      <div className="w-full relative z-10 flex h-full items-center justify-center">
        <div className="container-fluid relative z-10 py-16 text-center md:py-20">
          <h1 className="secHd text-white!">{title}</h1>
        </div>
      </div>
    </section>
  );
}
