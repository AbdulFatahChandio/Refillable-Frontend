import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYou from "@/src/components/ThankYou";
import Spinner from "@/src/components/Spinner";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Your Bijou Sky order has been confirmed.",
  alternates: { canonical: "/order-confirmation" },
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[calc(100dvh-200px)] items-center justify-center px-3 py-16">
          <Spinner />
        </section>
      }
    >
      <ThankYou />
    </Suspense>
  );
}
