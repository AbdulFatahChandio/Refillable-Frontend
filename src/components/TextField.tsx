"use client";

import React, { useState } from 'react'
import { InputType } from '../ts-types/custom_types'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'

export default function TextField({ label, name, value, placeholder, className, type = "text", onChange, error, ...props }: InputType) {

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputFieldType = isPassword ? (showPassword ? "text" : "password") : type;

  if (type === "textarea") {
    return (
      <div className={`${className}`}>
        {label && (
          <label
            className="block text-light-gray font-semibold mb-3 max-2xl:text-sm"
            htmlFor={name}
          >
            {label}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="border border-light-brown rounded-[2px] text-light-gray outline-none 2xl:px-6 2xl:py-4 px-3 py-2 w-full resize-none max-2xl:text-sm"
          rows={3}
          {...props}
        />
        {error && <span className="!text-red-500 2xl:text-sm text-[12px] mt-2 block text-start">{error}</span>}
      </div>
    );
  }


  return (
    <div className={`${className}`}>
      {label && <label className='block text-light-gray font-semibold mb-3 max-2xl:text-sm' htmlFor={name}>{label}</label>}
      {!isPassword ? (
        <input
          type={inputFieldType}
          className="border border-light-brown rounded-[2px] text-light-gray outline-none 2xl:px-6 2xl:py-4 px-3 py-2 w-full disabled:cursor-not-allowed max-2xl:text-sm"
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
        />
      ) : (
        <div className="relative flex items-center border text-light-gray border-light-brown rounded-[2px] gap-4 2xl:px-6 2xl:py-4 px-3 py-2 max-2xl:text-sm">
          <input
            type={inputFieldType}
            className="outline-none w-full grow"
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="md:text-2xl text-xl cursor-pointer"
          >
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
        </div>
      )}
      {error && <span className="!text-red-500 2xl:text-sm text-[12px] mt-2 block text-start">{error}</span>}
    </div>
  )
}
