import type { Metadata } from "next";
import TrackOrder from "@/src/components/TrackOrder";

export const metadata: Metadata = {
  title: "Track Order",
  description:
    "Track your Bijou Sky order status using your email and order tracking ID.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return <TrackOrder />;
}
