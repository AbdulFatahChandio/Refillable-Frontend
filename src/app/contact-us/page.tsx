import type { Metadata } from "next";
import Contactus from "@/src/components/Contactus";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Bijou Sky. We're here to help with orders, products, and support.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactUsPage() {
  return <Contactus />;
}
