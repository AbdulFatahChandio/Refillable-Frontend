import axios from "axios";
import Cookies from "js-cookie";
import { CURRENCY_COOKIE, DEFAULT_COUNTRY } from "@/src/utils/countries-currencies";
import { whenCurrencyReady } from "@/src/store/useCurrencyStore";

const AUTH_ROUTES = ["/signin", "/signup", "/forgot-password", "/reset-password", "/verify"];

const removeAuthCookie = () => {
    Cookies.remove("_ca", { path: "/", sameSite: "strict", secure: true });
};

const isAuthRoute = () =>
    typeof window !== "undefined" &&
    AUTH_ROUTES.some((route) => window.location.pathname.startsWith(route));

const getCurrencyHeader = () =>
    Cookies.get(CURRENCY_COOKIE) || DEFAULT_COUNTRY.currency;

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
    timeout: 30000,
    headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
    },
});

// Hold requests until IP/cookie currency is resolved (avoids first-hit AED race)
api.interceptors.request.use(async (config) => {
    await whenCurrencyReady();
    const token = Cookies.get("_ca");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers["X-Currency"] = getCurrencyHeader();
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;

        if (status === 401) {
            removeAuthCookie();
            if (!isAuthRoute()) {
                window.location.href = "/signin";
            }
            return Promise.reject(err);
        }

        return Promise.reject(err);
    }
);

export default api;
