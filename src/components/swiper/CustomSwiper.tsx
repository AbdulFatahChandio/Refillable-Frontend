import React, { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import 'swiper/css/effect-fade';

interface CustomSwiperProps {
  slidesPerView?: number;
  spaceBetween?: number;
  pagination?: boolean;
  navigation?: boolean;
  autoPlay?: boolean;
  className?: string;
  effect?: string;
  list: ReactNode[];
  breakpoints?: any;
  speed?: any;
  dir?: string
}

export default function CustomSwiper({
  slidesPerView,
  spaceBetween,
  pagination,
  navigation = false,
  autoPlay,
  className,
  list,
  breakpoints,
  effect,
  speed,
  dir
}: CustomSwiperProps) {
  return (
    <Swiper
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      dir={dir || "ltr"}
      speed={speed ?? 300}
      // loop={true}
      fadeEffect={{
        crossFade: true,
      }}
      effect={effect}
      breakpoints={breakpoints}
      autoplay={
        autoPlay
          ? {
            delay: 2500,
            disableOnInteraction: true,
          }
          : false
      }
      pagination={pagination ? { clickable: true } : false}
      navigation={navigation}
      modules={[Pagination,Navigation, Autoplay, ...(effect === "fade" ? [EffectFade] : [])]}
      className={`mySwiper ${className}`}
    >
      {list?.map((item, index) => (
        <SwiperSlide key={index}>{item}</SwiperSlide>
      ))}
    </Swiper>
  );
}
