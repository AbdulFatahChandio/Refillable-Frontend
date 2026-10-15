"use client";

import { ReactNode } from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useMediaQuery } from "react-responsive";

const POLICY_ROUTES = [
  "/privacy-policy",
  "/terms-and-conditions",
  "/faqs",
  "/shipping-policy",
  "/return-and-refund-policy",
];

export default function RootLayoutShell({ children }: { children: ReactNode }) {
  const router = useAppRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 992px)" });
  const hiddenHeader = POLICY_ROUTES.includes(router?.pathname ?? "");
  const isDashboardRoute = router?.pathname?.startsWith("/dashboard");
  const showFooter = !isDashboardRoute && !(hiddenHeader && isMobile);

  return (
    <>
      {hiddenHeader && isMobile ? null : <Header />}
      {children}
      {showFooter && <Footer />}
    </>
  );
}
