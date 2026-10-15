import { COUNTRIES_CURRENCIES } from "./countries-currencies";
import { CountriesType } from "../ts-types/generated";

export function getCountryCode(
    countryNameOrCode?: string,
    countries?: CountriesType[]
): string {
    if (!countryNameOrCode) return "";

    const raw = String(countryNameOrCode).trim();
    if (/^[A-Za-z]{2}$/.test(raw)) return raw.toUpperCase();

    const fromApi = countries?.find(
        (country) =>
            country?.name?.toLowerCase() === raw.toLowerCase() ||
            country?.code?.toLowerCase() === raw.toLowerCase()
    );
    if (fromApi?.code) return String(fromApi.code).toUpperCase();

    const fromStatic = COUNTRIES_CURRENCIES.find(
        (country) =>
            country.countryName.toLowerCase() === raw.toLowerCase() ||
            country.countryCode.toLowerCase() === raw.toLowerCase()
    );

    return fromStatic?.countryCode?.toUpperCase() || "";
}
