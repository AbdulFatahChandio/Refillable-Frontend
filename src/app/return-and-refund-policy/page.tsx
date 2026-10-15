import type { Metadata } from "next";
import ReturnRefundPolicy from "@/src/components/ReturnRefundPolicy";

export const metadata: Metadata = {
  title: "Return and Refund Policy",
  description: "Understand Bijou Sky's return and refund policy for your peace of mind.",
  alternates: { canonical: "/return-and-refund-policy" },
};

export default function ReturnAndRefundPolicyPage() {
  return <ReturnRefundPolicy />;
}
