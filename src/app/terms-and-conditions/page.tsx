import type { Metadata } from "next";
import TermsandConditions from "@/src/components/TermsAndConditions";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Review the terms and conditions for shopping at Bijou Sky.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsAndConditionsPage() {
  return <TermsandConditions />;
}
