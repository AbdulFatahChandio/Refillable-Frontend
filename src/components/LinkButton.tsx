import React, { ReactNode } from 'react'
import { IoArrowForward } from 'react-icons/io5'
import { HiOutlineArrowRight } from "react-icons/hi";
import { ImSpinner } from "react-icons/im";
import Link from 'next/link';
import { HiOutlineArrowLongRight } from 'react-icons/hi2';

type Props = React.LinkHTMLAttributes<HTMLAnchorElement> & {
    icon?: boolean
    text: ReactNode
    className?: string
    btnTheme?: "light" | "transparent" | "dark"
    link: string
}

export default function LinkButton({ icon, text, className, btnTheme = "dark", link, ...props }: Props) {
    return (
        <Link
            href={link}
            {...props}
            className={`disabled:!cursor-not-allowed inline-flex gap-2 uppercase relative rounded-[2px] items-center justify-center max-md:text-[10px] max-2xl:text-[12px] border  px-4 md:px-6 py-2 md:py-3 transition
            ${btnTheme === "light" ? "bg-secondary text-brown hover:bg-brown hover:text-secondary border-secondary" : btnTheme === "dark" ? "bg-brown text-secondary hover:bg-secondary hover:text-brown border-brown" : "text-secondary hover:bg-secondary hover:text-primary border-primary"}
            ${className}`}>
            <span className={`flex items-center 2xl:tracking-[4px] tracking-[2px] font-semibold`}>{text}</span>
            {icon && <HiOutlineArrowLongRight className='rtl:rotate-180' />}
        </Link>
    )
}
