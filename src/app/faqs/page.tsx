import type { Metadata } from "next";
import FAQs from "@/src/components/FAQs";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about Bijou Sky orders, shipping, returns, and products.",
  alternates: { canonical: "/faqs" },
};

export default function FAQsPage() {
  return <FAQs />;
}
