import type { Metadata } from "next";
import { CategoryType, ProductType } from "@/src/ts-types/generated";
import { getProductSlug, getTranslation } from "./slugs";

export const SITE_NAME = "Bijou Sky";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bijou.ae";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Discover premium beauty, wellness, and lifestyle products at Bijou Sky. Shop curated collections with exclusive offers.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function buildCategoryMetadata(
  category: CategoryType | null,
  path?: string,
): Metadata {
  const name =
    getTranslation(category?.translations, "name") || "All Collections";
  const description =
    getTranslation(category?.translations, "description") ||
    `Browse ${name} products at ${SITE_NAME}. Shop premium beauty and lifestyle essentials.`;
  const url = path ? `${SITE_URL}/collections/${path}` : `${SITE_URL}/collections`;

  return {
    title: name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: name,
      description,
      url,
      images: category?.image ? [{ url: category.image, alt: name }] : undefined,
    },
  };
}

export function buildProductMetadata(product: ProductType): Metadata {
  const name = getTranslation(product.translations, "name");
  const description =
    getTranslation(product.translations, "description") ||
    `Buy ${name} online at ${SITE_NAME}. Premium quality with fast delivery across UAE.`;
  const slug = getProductSlug(product);
  const url = `${SITE_URL}/products/${slug}`;
  const image = product.imageUrls?.[0];

  return {
    title: name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: name,
      description,
      url,
      type: "website",
      images: image ? [{ url: image, alt: name }] : undefined,
    },
  };
}

export function buildProductJsonLd(product: ProductType) {
  const name = getTranslation(product.translations, "name");
  const description = getTranslation(product.translations, "description");
  const slug = getProductSlug(product);
  const off = Number(product.specialOffer?.discountPercent) || 0;
  const price =
    product.price != null && off > 0
      ? Math.round(product.price * (1 - off / 100))
      : product.price;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: product.imageUrls,
    sku: String(product.id),
    url: `${SITE_URL}/products/${slug}`,
    offers: {
      "@type": "Offer",
      price: price ?? 0,
      priceCurrency: "AED",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${slug}`,
    },
  };
}
