import { CategoryType, ProductType, TranslationsType } from "@/src/ts-types/generated";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getTranslation(
  translations: TranslationsType[] = [],
  key: "name" | "description" = "name",
  language = "en",
): string {
  const preferred = translations.find((t) => t.language === language)?.[key];
  if (preferred) return preferred;
  const en = translations.find((t) => t.language === "en")?.[key];
  if (en) return en;
  return translations[0]?.[key] ?? "";
}

export function getCategorySlug(category: CategoryType): string {
  const name = getTranslation(category.translations, "name", "en");
  return slugify(name);
}

export function getProductSlug(product: ProductType): string {
  // if (product.slug) return product.slug;
  const name = getTranslation(product.translations, "name", "en");
  return `${slugify(name || "product")}-${product.id}`;
}

export function getProductUrl(product: ProductType): string {
  return `/products/${getProductSlug(product)}`;
}

export function flattenCategories(
  categories: CategoryType[],
  parentSlugs: string[] = [],
): Array<{ category: CategoryType; path: string; id: number }> {
  const result: Array<{ category: CategoryType; path: string; id: number }> = [];

  for (const category of categories) {
    if (!category.id) continue;
    const slug = getCategorySlug(category);
    const path = [...parentSlugs, slug].join("/");
    result.push({ category, path, id: category.id });

    if (category.subcategories?.length) {
      result.push(
        ...flattenCategories(category.subcategories, [...parentSlugs, slug]),
      );
    }
  }

  return result;
}

export function findCategoryById(
  categories: CategoryType[],
  id: string | number,
): CategoryType | null {
  for (const category of categories) {
    if (String(category.id) === String(id)) return category;
    if (category.subcategories?.length) {
      const found = findCategoryById(category.subcategories, id);
      if (found) return found;
    }
  }
  return null;
}
