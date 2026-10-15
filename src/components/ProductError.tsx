"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type EmptyCartProps = {
  text?: string;
  className?: string;
};

export default function EmptyCart({
  text = "Your cart is empty",
  className = "",
}: EmptyCartProps) {
  const cartRef = useRef<SVGSVGElement>(null);
  const wheelLRef = useRef<SVGCircleElement>(null);
  const wheelRRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!cartRef.current || !wheelLRef.current || !wheelRRef.current) return;

    // Cart tilt / float
    gsap.to(cartRef.current, {
      rotate: 3,
      y: -4,
      transformOrigin: "50% 50%",
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });

    // Wheels rotate
    gsap.to([wheelLRef.current, wheelRRef.current], {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 2.2,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <div className={className}>
      <svg
        ref={cartRef}
        className="mx-auto md:mb-10 mb-5 w-[140px] md:w-[220px] text-primary"
        viewBox="0 0 220 160"
        fill="none"
        aria-hidden="true"
        role="img"
      >
        {/* Handle */}
        <path
          d="M28 30h32"
          className="stroke-current"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {/* Frame + Basket */}
        <path
          d="M60 30l16 64h98a10 10 0 0 0 9.6-7.1l12.8-41.8A10 10 0 0 0 187.6 34H76"
          className="stroke-current"
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Basket slats */}
        <path
          d="M92 54h76M88 70h70M92 86h60"
          className="stroke-current"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Ground shadow */}
        <ellipse
          cx="110"
          cy="132"
          rx="74"
          ry="10"
          className="fill-current"
          opacity={0.08}
        />
        {/* Wheels */}
        <circle
          ref={wheelLRef}
          cx="90"
          cy="120"
          r="14"
          className="stroke-current"
          strokeWidth={10}
        />
        <circle
          ref={wheelRRef}
          cx="162"
          cy="120"
          r="14"
          className="stroke-current"
          strokeWidth={10}
        />
      </svg>

      <h6 className="text-center text-xl text-primary">{text}</h6>
    </div>
  );
}
