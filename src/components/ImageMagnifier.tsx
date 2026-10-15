"use client";

import React, { useId, useMemo, useRef, useState } from "react";

export default function ImageMagnifier({
    src,
    alt = "",
    // width = 420,
    // height = 320,
    zoom = 2.5,
    lensSize = 140,
    className = "",
    imgClassName = "",
}: any) {
    const wrapRef = useRef<any>(null);
    const [active, setActive] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 }); // in %
    const id = useId();

    const bgSize = useMemo(() => `${zoom * 100}% ${zoom * 100}%`, [zoom]);

    const onMove = (e: any) => {
        const el = wrapRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        let x = ((clientX - rect.left) / rect.width) * 100;
        let y = ((clientY - rect.top) / rect.height) * 100;

        // clamp 0..100
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));

        setPos({ x, y });
    };

    return (
        <div
            ref={wrapRef}
            className={className}
            style={{
                position: "relative",
                // width,
                // height,
                overflow: "hidden",
                borderRadius: 12,
            }}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            onMouseMove={onMove}
            onTouchStart={() => setActive(true)}
            onTouchEnd={() => setActive(false)}
            onTouchMove={onMove}
            aria-describedby={id}
        >
            <img
                src={src}
                alt={alt}
                draggable={false}
                className={imgClassName}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    // userSelect: "none",
                    //   WebkitUserDrag: "none",
                    display: "block",
                }}
            />

            {/* Lens */}
            {active && (
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: `calc(${pos.x}% - ${lensSize / 2}px)`,
                        top: `calc(${pos.y}% - ${lensSize / 2}px)`,
                        width: lensSize,
                        height: lensSize,
                        borderRadius: "50%",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                        border: "2px solid rgba(255,255,255,0.9)",
                        backgroundImage: `url(${src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: bgSize,
                        backgroundPosition: `${pos.x}% ${pos.y}%`,
                        pointerEvents: "none",
                        transform: "translateZ(0)",
                    }}
                />
            )}

            {/* Screen-reader hint */}
            <span
                id={id}
                style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: "hidden",
                    clip: "rect(0,0,0,0)",
                    whiteSpace: "nowrap",
                    border: 0,
                }}
            >
                Hover or touch to zoom the image.
            </span>
        </div>
    );
}
