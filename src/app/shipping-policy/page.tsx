import type { Metadata } from "next";
import Shippingpolicy from "@/src/components/ShippingPolicy";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Learn about Bijou Sky shipping rates, delivery times, and regions we serve.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return <Shippingpolicy />;
}
