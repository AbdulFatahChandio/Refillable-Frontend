import type { Metadata } from "next";
import CollectionProducts from "@/src/components/Collections";
import CollectionsLayout from "@/src/layouts/collections-layout";
import { fetchCategories } from "@/src/lib/api/server";
import { buildCategoryMetadata } from "@/src/lib/seo/metadata";
import { findCategoryById } from "@/src/lib/seo/slugs";

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { id } = await searchParams;
  const path = slug?.join("/");

  if (!id) {
    return buildCategoryMetadata(null, path);
  }

  try {
    const categories = await fetchCategories();
    const category = findCategoryById(categories.data, id);
    return buildCategoryMetadata(category, path);
  } catch {
    return buildCategoryMetadata(null, path);
  }
}

export default function CategoryPage() {
  return (
    <CollectionsLayout>
      <CollectionProducts />
    </CollectionsLayout>
  );
}
