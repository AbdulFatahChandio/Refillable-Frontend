import type { Metadata } from "next";
import NotFoundPage from "@/src/components/NotFoundPage";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundPage />;
}
