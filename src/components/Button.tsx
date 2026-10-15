import React, { ReactNode } from 'react'
import { IoArrowForward } from 'react-icons/io5'
import { HiOutlineArrowRight } from "react-icons/hi";
import { ImSpinner } from "react-icons/im";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: boolean
    disabled?: boolean
    loading?: boolean
    text: ReactNode
    type?: "button" | "submit" | "reset"
    className?: string
    btnTheme?: "light" | "transparent" | "dark"
}

export default function Button({ icon, loading, disabled, text, className, type = "button", btnTheme = "dark", ...props }: Props) {
    return (
        <button
            type={type}
            {...props}
            disabled={disabled || loading}
            className={`disabled:!cursor-not-allowed flex gap-2 uppercase relative  rounded-[2px] items-center justify-center max-md:text-[10px] max-2xl:text-[12px] border  px-4 md:px-6 py-2 md:py-3 transition
            ${btnTheme === "light" ? "bg-secondary text-brown hover:bg-brown hover:text-secondary border-secondary" : btnTheme === "dark" ? "bg-brown text-secondary hover:bg-secondary hover:text-brown border-brown" : "text-secondary hover:bg-secondary hover:text-primary border-primary"}
            ${className}`}>
            {loading && <ImSpinner size={24} className='animate-spin absolute top-1/2 left-1/2 -translate-1/2' />}
            <span className={`${loading ? "invisible" : ""} flex items-center tracking-wider`}>{text}</span>
            {!loading && icon && <HiOutlineArrowRight className='rtl:rotate-180' />}
        </button>
    )
}
