import type { Metadata } from "next";
import PrivacyPolicy from "@/src/components/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read Bijou Sky's privacy policy to understand how we collect and protect your data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
