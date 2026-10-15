"use client";

import Select from "react-select";
import { outlineSelectStyles } from "./select.styles";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  list: { label: string; value: string }[] | undefined | any;
  errorMsg?: string | undefined | null;
  label: string;
  labelClassName?: string;
  classNamePrefix?: string;
  placeholder?: string;
  selectClassName?: string;
  errorClassName?: string;
  onChange: (e: any, { val }: any) => void;
  isMulti?: boolean;
  value?:
    | { label: string; value: string }[]
    | { label: string; value: string }
    | []
    | undefined
    | null
    | any;
  disable?: boolean;
  isSearchable?: boolean;
  name: string;
  tooltip?: ReactNode;
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
}

const CustomSelect = ({
  label,
  placeholder,
  list,
  selectClassName,
  labelClassName,
  classNamePrefix,
  errorMsg,
  errorClassName,
  onChange,
  onBlur,
  isMulti,
  value,
  disable,
  name,
  tooltip,
  isSearchable = true,
  ...rest
}: Props) => {
  const { t } = useTranslation();
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setMenuPortalTarget(document.body);
  }, []);

  return (
    <div className={selectClassName} dir="ltr">
      {label && (
        <div className="flex items-center pb-2 gap-2">
          <p className={`text-md font-semibold ${labelClassName}`}>{label}</p>
          {tooltip}
        </div>
      )}
      <Select
        className="font-semibold"
        placeholder={placeholder}
        styles={outlineSelectStyles}
        classNamePrefix={`select ${classNamePrefix}`}
        options={list}
        name={name}
        isMulti={isMulti}
        isDisabled={disable}
        onBlur={onBlur}
        closeMenuOnSelect={!isMulti}
        noOptionsMessage={() => t("No options found")}
        {...rest}
        value={value ?? null}
        onChange={onChange}
        isSearchable={isSearchable}
        menuPlacement="auto"
        menuPosition="fixed"
        menuPortalTarget={menuPortalTarget}
        menuShouldScrollIntoView={false}
        maxMenuHeight={260}
        filterOption={(option, input) =>
          option.label.toLowerCase().includes(input.toLowerCase().trim())
        }
      />
      {errorMsg && (
        <span className={`text-sm text-red-500 ${errorClassName}`}>
          {errorMsg}
        </span>
      )}
    </div>
  );
};

export default CustomSelect;
