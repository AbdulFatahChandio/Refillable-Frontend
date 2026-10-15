import { fetchProduct } from "@/src/hooks/product/useProductGetById";
import { useCartStore } from "@/src/store/useCartStore";
import { useUserStore } from "@/src/store/useUserStore";
import { getProductPrices } from "@/src/utils/productPrice";

/** Refetch cart product prices with the current X-Currency header. */
export async function refreshCartPricesForCurrency() {
  const cart = useCartStore.getState().cart;
  if (!cart.length) return;

  const uniqueIds = [...new Set(cart.map((item) => item.id))];
  const route = useUserStore.getState().isLoggedIn ? "user" : "public";

  const results = await Promise.allSettled(
    uniqueIds.map((id) => fetchProduct(route, String(id))),
  );

  const priceByProductId: Record<number, number> = {};

  results.forEach((result, index) => {
    if (result.status !== "fulfilled") return;
    const product = result.value?.data?.product;
    if (!product) return;
    priceByProductId[uniqueIds[index]] = getProductPrices(product).finalPrice;
  });

  if (Object.keys(priceByProductId).length > 0) {
    useCartStore.getState().syncPrices(priceByProductId);
  }
}
