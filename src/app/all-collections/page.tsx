import type { Metadata } from "next";
import AllCollectionsPage from "@/src/components/AllCollectionsPage";

export const metadata: Metadata = {
  title: "All Collections",
  description:
    "Browse every Bijou Sky collection — explore curated products and shop each collection.",
  alternates: {
    canonical: "/all-collections",
  },
};

export default function Page() {
  return <AllCollectionsPage />;
}
