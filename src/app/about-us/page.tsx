import type { Metadata } from "next";
import AboutPage from "@/src/components/AboutPage";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover Bijou Sky — hand-finished 18K gold-plated jewellery crafted for the quietly bold.",
  alternates: { canonical: "/about-us" },
};

export default function AboutUsPage() {
  return <AboutPage />;
}
