"use client";

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Language } from '../utils/constants';
import { useAppRouter } from "@/src/hooks/useAppRouter";

export default function LanguageToggle({ position }: { position: string }) {

    const { i18n } = useTranslation();
    const [language, setLanguage] = useState<string>(Language.English);
    const router = useAppRouter();

    useEffect(() => {
        const savedLang = localStorage.getItem("language") || "en";
        setLanguage(savedLang);
        i18n.changeLanguage(savedLang);
        document.dir = savedLang === "ar" ? "rtl" : "ltr";
    }, [i18n]);


    const toggleLanguage = () => {
        const newLang = language === "en" ? "ar" : "en";
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem("language", newLang);
        document.dir = newLang === "ar" ? "rtl" : "ltr";
        window.dispatchEvent(new Event("languageChange"));
    };


    return (
        <button onClick={toggleLanguage}
            className={`max-md:p-2 rounded-md 
            ${position === "header" ? "text-sm" : "border border-transparent hover:border-primary hover:bg-secondary hover:text-primary bg-primary text-secondary text-[12px]"}`}>
            {language === "en" ? "العربية" : "ENGLISH"}
        </button>
    )
}
