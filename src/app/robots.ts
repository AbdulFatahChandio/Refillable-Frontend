import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/cart",
        "/checkout",
        "/signin",
        "/signup",
        "/verify",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
