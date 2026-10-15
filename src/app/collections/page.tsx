import type { Metadata } from "next";
import CollectionProducts from "@/src/components/Collections";
import CollectionsLayout from "@/src/layouts/collections-layout";
import { buildCategoryMetadata } from "@/src/lib/seo/metadata";

export const metadata: Metadata = buildCategoryMetadata(null);

export default function CollectionsPage() {
  return (
    <CollectionsLayout>
      <CollectionProducts />
    </CollectionsLayout>
  );
}
