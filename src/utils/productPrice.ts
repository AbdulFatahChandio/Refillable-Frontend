/** Resolve display / cart prices from product API fields (converted `price` + optional offer). */
export function getProductPrices(product?: {
  price?: number | null;
  specialOffer?: {
    discountPercent?: number | string | null;
    discountedPrice?: number | string | null;
  } | null;
} | null) {
  const price = typeof product?.price === "number" ? product.price : null;
  const offer = product?.specialOffer;
  const discountPercent = Number(offer?.discountPercent) || 0;

  let discountedPrice: number | null = null;

  if (offer) {
    const fromApi = Number(offer.discountedPrice);
    if (
      offer.discountedPrice != null &&
      offer.discountedPrice !== "" &&
      !Number.isNaN(fromApi)
    ) {
      discountedPrice = fromApi;
    } else if (price != null && discountPercent > 0) {
      discountedPrice = Math.max(0, price * (1 - discountPercent / 100));
    }
  }

  const hasDiscount =
    discountedPrice != null && price != null && discountedPrice < price;

  return {
    price,
    discountedPrice,
    discountPercent,
    hasDiscount,
    /** Price to charge / add to cart */
    finalPrice: hasDiscount ? discountedPrice! : (price ?? 0),
  };
}
