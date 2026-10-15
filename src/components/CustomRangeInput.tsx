"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Range } from "react-range";

type Props = {
  min?: number;
  max?: number;
  step?: number;
  values: [number, number];
  onChange: (vals: [number, number]) => void;
  onFinalChange?: (vals: [number, number]) => void; // fires on mouse up
};

export default function CustomRangeInput({
  min = 0,
  max = 5,
  step = 5,
  values,
  onChange,
  onFinalChange,
}: Props) {

  const { t } = useTranslation();

  return (
    <div
      className="w-full relative mt-8"
      dir="ltr"
    >
      <div className="flex rtl:flex-row-reverse absolute gap-1 ltr:left-16 rtl:right-16 -top-8 text-sm text-primary">
        <span>{t("Price")}</span>
        <span>{values[0]} - {values[1]}</span>
      </div>


      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={(vals) => onChange(vals as [number, number])}
        onFinalChange={(vals) => onFinalChange?.(vals as [number, number])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 w-full rounded-md bg-primary"
            style={{ ...props.style }}
          >
            <div
              className="h-1 rounded-md bg-primary"
              style={{
                marginLeft: `${((values[0] - min) / (max - min)) * 100}%`,
                width: `${((values[1] - values[0]) / (max - min)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            key={props.key}
            className="h-3 w-3 bg-primary rounded-full top-0 cursor-pointer flex items-center justify-center"
          >
            <div className="h-2 w-2 bg-secondary rounded-full" />
          </div>
        )}
      />
    </div>
  );
}
