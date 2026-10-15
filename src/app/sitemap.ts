import type { MetadataRoute } from "next";
import { fetchAllProducts, fetchCategories } from "@/src/lib/api/server";
import {
  flattenCategories,
  getProductUrl,
} from "@/src/lib/seo/slugs";
import { SITE_URL } from "@/src/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
  "",
    "collections",
    "about-us",
    "contact-us",
    "privacy-policy",
    "terms-and-conditions",
    "faqs",
    "shipping-policy",
    "return-and-refund-policy",
  ].map((route) => ({
    url: `${SITE_URL}/${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  try {
    const [categoriesRes, products] = await Promise.all([
      fetchCategories(),
      fetchAllProducts(),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = flattenCategories(
      categoriesRes.data,
    ).map(({ path, id }) => ({
      url: `${SITE_URL}/collections/${path}?id=${id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${SITE_URL}${getProductUrl(product)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
