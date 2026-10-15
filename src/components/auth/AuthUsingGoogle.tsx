"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/assets/images/google-logo.png";
import { useTranslation } from "react-i18next";
import { GoogleLogin } from "@react-oauth/google";
import { getOrCreateDeviceToken } from "@/src/utils/deviceToken";
import { getFcmToken } from "@/firebase";
import { useGoogle } from "@/src/hooks/useGoogle";
import { toast } from "react-toastify";
import { useUserStore } from "@/src/store/useUserStore";
import Cookies from "js-cookie";
import { useAppRouter } from "@/src/hooks/useAppRouter";

export default function AuthUsingGoogle() {
  const { t } = useTranslation();

  const { setUser } = useUserStore();
  const [deviceToken, setDeviceToken] = useState<string>("");
  const [fcmToken, setFcmToken] = useState<string>("");
  const router = useAppRouter();

  useEffect(() => {
    setDeviceToken(getOrCreateDeviceToken());
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getFcmToken();
      setFcmToken(token || "");
      if (token) localStorage.setItem("fcmToken", token);
    })();
  }, []);

  const { mutate: googleLogin, isPending } = useGoogle();

  const handleSuccess = (credentialResponse: any) => {
    const idToken: string | undefined = credentialResponse?.credential;
    if (!idToken) return;

    // ✅ EXACT BODY (as requested)
    const body = {
      idToken, // string
      fcmToken: fcmToken || undefined, // optional
      deviceId: deviceToken, // string
    };

    googleLogin(body, {
      onSuccess: (data) => {
        const token = data?.meta?.accessToken;

        if (token) {
          // Save token in cookie (7 din ke liye)
          Cookies.set("_ca", token, {
            expires: 1,
            secure: true,
            sameSite: "strict",
          });
        }
        toast.success("Login successful!");
        router.push("/dashboard/profile-management");
        setUser(data.data);
      },
    });
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="relative h-12 w-full">
      {/* Invisible Google widget overlay to power our custom button */}
      <div className="absolute inset-0 opacity-0 z-10 cursor-pointer">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          size="large"
          shape="rectangular"
          width="100%"
        />
      </div>

      {/* Custom-styled button */}
      <button
        type="button"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary py-3 text-primary hover:bg-primary hover:text-secondary disabled:opacity-60"
      >
        <Image
          src={logo}
          alt="Google"
          width={20}
          height={20}
          className="h-5 w-5"
        />
        <span className="text-sm font-medium">
          {isPending ? t("Signing in...") : t("Google")}
        </span>
      </button>
    </div>
  );
}
