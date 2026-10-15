import React from 'react'
import SecHd from './SecHd'
import Image from 'next/image'
import { useTranslation } from 'react-i18next';

export default function QuoteSec({ section }: any) {
    const { t, i18n } = useTranslation();
    const getTranslation = (
        translations: any[] = [],
        key:
            | "title"
            | "subtitle"
            | "description"
            | "buttonText"
            | "buttonUrl"
            | "icon",
    ) => {
        const ar = translations.find((t) => t.language === "ar");
        const en = translations.find((t) => t.language === "en");
        if (i18n.language === "ar" && ar?.[key]) return ar[key];
        return en?.[key] ?? translations[0]?.[key] ?? "";
    };

    const quote = getTranslation(section?.translations, "description") || "Jewelry is the most intimate form of art we possess — a quiet conversation between the body and the object.";
    const author = getTranslation(section?.translations, "subtitle") || "The Bijou Sky Atelier";
    return (
        <section className="2xl:py-25 lg:py-15 py-10 bg-[#FCFAF7] text-center">
            <div className='2xl:max-w-[1200px] md:max-w-[700px] max-w-[90%] mx-auto'>
                <Image src="/assets/images/sparkle.png" alt="quote" width={28} height={28} className='mx-auto max-2xl:w-5 max-2xl:h-5' />
                <SecHd className='mt-10 mb-8'
                    text={`"${quote}"`} />
                <span className='text-[#A37C43] max-2xl:text-[12px] uppercase 2xl:tracking-[4px] tracking-[2px]'>— {author}</span>
            </div>
        </section>
    )
}
