import type { Metadata } from "next";
import HomePage from "@/src/components/HomePage";

export const metadata: Metadata = {
  title: "Premium Beauty & Lifestyle Products",
  description:
    "Shop curated beauty, wellness, and lifestyle products at Bijou Sky. Discover exclusive collections and offers across the UAE.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <HomePage />;
}
