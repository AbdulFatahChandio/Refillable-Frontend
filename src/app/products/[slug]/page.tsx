import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SingleProductSec from "@/src/components/SingleProduct";
import { fetchProductBySlug } from "@/src/lib/api/server";
import {
  buildProductJsonLd,
  buildProductMetadata,
} from "@/src/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await fetchProductBySlug(slug);
    if (!data?.data?.product) {
      return { title: "Product Not Found" };
    }
    return buildProductMetadata(data.data.product);
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  let productId: string;
  try {
    const data = await fetchProductBySlug(slug);
    if (!data?.data?.product?.id) {
      notFound();
    }
    productId = String(data.data.product.id);
  } catch {
    notFound();
  }

  let jsonLd = null;
  try {
    const data = await fetchProductBySlug(slug);
    if (data?.data?.product) {
      jsonLd = buildProductJsonLd(data.data.product);
    }
  } catch {
    // metadata still works from client fetch
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <SingleProductSec id={productId} />
    </>
  );
}
