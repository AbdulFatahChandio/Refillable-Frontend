"use client";

import { ReactNode, Suspense, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import i18n from "@/src/i18n";
import { Language } from "@/src/utils/constants";
import { useFindUser } from "@/src/hooks/useFindUser";
import { useUserStore } from "@/src/store/useUserStore";
import ManagedModal from "@/src/components/modal/ManagedModal";
import RootLayoutShell from "@/src/components/layouts/RootLayoutShell";
import CurrencyInit from "@/src/components/CurrencyInit";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

function AppInit() {
  const { data, isSuccess } = useFindUser({});
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data?.data);
    } else {
      clearUser();
    }
  }, [data, isSuccess, setUser, clearUser]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem("language") ?? Language.English);
  }, []);

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <AppInit />
          <CurrencyInit />
          <Suspense fallback={null}>
            <RootLayoutShell>{children}</RootLayoutShell>
            <ManagedModal />
          </Suspense>
          <ToastContainer
            position="bottom-right"
            className={"!z-[999999999999999999999999]"}
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </QueryClientProvider>
      </I18nextProvider>
    </GoogleOAuthProvider>
  );
}
