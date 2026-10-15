import i18n from "i18next";
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"

// ======== Main Translations Files ========
import mainEn from "@/public/locales/en/main.json"
import mainAr from "@/public/locales/ar/main.json"

const resources = {
    en: {
        main: mainEn,
    },
    ar: {
        main: mainAr,
    },
};

i18n
    .use(initReactI18next)
    .use(Backend)
    .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: [
            "en",
            "ar"
        ],
        ns: ["main"],
        defaultNS: "main"
    });

export default i18n;
