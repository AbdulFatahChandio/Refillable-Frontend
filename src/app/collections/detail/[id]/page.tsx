import { redirect } from "next/navigation";
import { fetchProductById } from "@/src/lib/api/server";
import { getProductUrl } from "@/src/lib/seo/slugs";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyProductRedirect({ params }: PageProps) {
  const { id } = await params;

  try {
    const data = await fetchProductById(id);
    redirect(getProductUrl(data.data.product));
  } catch {
    redirect("/collections");
  }
}
